import prisma from '../prisma.js';

export interface MatchScoreResult {
  helperId: string;
  helperName: string;
  email: string;
  area: string;
  avatarUrl?: string;
  averageRating: number;
  reviewCount: number;
  completedCount: number;
  skills: { name: string; proficiency: string; category: string }[];
  availability: { weekday: string; startTime: string; endTime: string }[];
  matchScore: number; // 0 to 100
  breakdown: {
    skillScore: number;       // out of 40
    availabilityScore: number; // out of 25
    locationScore: number;     // out of 15
    ratingScore: number;       // out of 10
    reliabilityScore: number;  // out of 10
  };
  explanation: string;
  fitHighlights: string[];
}

export async function findMatchesForListing(
  listingId: string,
  excludeUserId?: string
): Promise<MatchScoreResult[]> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { category: true }
  });

  if (!listing) {
    throw new Error('Listing not found');
  }

  return calculateMatches({
    categoryId: listing.categoryId,
    categoryName: listing.category.name,
    title: listing.title,
    description: listing.description,
    area: listing.area,
    preferredDates: listing.preferredDates,
    excludeUserId: excludeUserId || listing.ownerId
  });
}

export async function calculateMatches(params: {
  categoryId?: string;
  categoryName?: string;
  title?: string;
  description?: string;
  area?: string;
  preferredDates?: string | null;
  excludeUserId?: string;
}): Promise<MatchScoreResult[]> {
  const { categoryId, categoryName, title = '', description = '', area = 'Downtown', preferredDates, excludeUserId } = params;

  // Get all active members excluding the requesting user
  const potentialHelpers = await prisma.user.findMany({
    where: {
      status: 'ACTIVE',
      role: 'MEMBER',
      ...(excludeUserId ? { id: { not: excludeUserId } } : {})
    },
    include: {
      profile: true,
      userSkills: {
        include: {
          skill: {
            include: { category: true }
          }
        }
      },
      availability: true
    }
  });

  const queryTerms = `${title} ${description} ${categoryName || ''}`.toLowerCase().split(/\s+/).filter(t => t.length > 2);

  const results: MatchScoreResult[] = [];

  for (const helper of potentialHelpers) {
    if (!helper.profile) continue;

    let skillScore = 0;       // Max 40
    let availabilityScore = 0; // Max 25
    let locationScore = 0;     // Max 15
    let ratingScore = 0;       // Max 10
    let reliabilityScore = 0;  // Max 10
    const fitHighlights: string[] = [];

    // 1. Skill & Category Match (40%)
    const matchingSkills = helper.userSkills.filter(us => {
      const skillName = us.skill.name.toLowerCase();
      const inCategory = categoryId ? us.skill.categoryId === categoryId : false;
      const termMatch = queryTerms.some(term => skillName.includes(term) || us.skill.category.name.toLowerCase().includes(term));
      return inCategory || termMatch;
    });

    if (matchingSkills.length > 0) {
      const topSkill = matchingSkills[0];
      const profBoost = topSkill.proficiency === 'EXPERT' ? 40 : topSkill.proficiency === 'INTERMEDIATE' ? 32 : 24;
      skillScore = Math.min(40, profBoost + (matchingSkills.length - 1) * 4);
      fitHighlights.push(`Direct skill match in ${topSkill.skill.name} (${topSkill.proficiency.toLowerCase()})`);
    } else {
      // Partial relevance fallback
      const anyRelevantSkill = helper.userSkills.some(us => 
        queryTerms.some(term => us.skill.name.toLowerCase().includes(term))
      );
      if (anyRelevantSkill) {
        skillScore = 20;
        fitHighlights.push('Related practical skills');
      } else {
        skillScore = 8; // general helper baseline
      }
    }

    // 2. Availability Overlap (25%)
    if (helper.availability.length > 0) {
      if (preferredDates) {
        const preferredLower = preferredDates.toLowerCase();
        const matchesDay = helper.availability.some(a => preferredLower.includes(a.weekday.toLowerCase()));
        if (matchesDay) {
          availabilityScore = 25;
          fitHighlights.push(`Available on preferred day (${helper.availability.map(a => a.weekday).join(', ')})`);
        } else {
          availabilityScore = 15;
          fitHighlights.push(`Has active schedule slots (${helper.availability.length} slots)`);
        }
      } else {
        // Broad availability
        const slotCount = helper.availability.length;
        availabilityScore = Math.min(25, 12 + slotCount * 4);
        fitHighlights.push(`Flexible availability (${helper.availability.map(a => a.weekday).slice(0, 3).join(', ')})`);
      }
    } else {
      availabilityScore = 5;
    }

    // 3. Location Area Compatibility (15%)
    const helperArea = helper.profile.area.toLowerCase();
    const reqArea = area.toLowerCase();
    if (helperArea === reqArea || helperArea.includes(reqArea) || reqArea.includes(helperArea)) {
      locationScore = 15;
      fitHighlights.push(`In your neighborhood (${helper.profile.area})`);
    } else if (helperArea === 'any' || reqArea === 'remote' || reqArea === 'online') {
      locationScore = 15;
      fitHighlights.push('Compatible for remote/online help');
    } else {
      locationScore = 7; // nearby within city
      fitHighlights.push(`Nearby in ${helper.profile.area}`);
    }

    // 4. Rating (10%)
    const rating = helper.profile.averageRating || 5.0;
    ratingScore = Math.min(10, Math.round((rating / 5.0) * 10));
    if (rating >= 4.5) {
      fitHighlights.push(`High community rating (${rating.toFixed(1)}★)`);
    }

    // 5. Past Completion Reliability (10%)
    const completed = helper.profile.completedCount || 0;
    if (completed >= 5) {
      reliabilityScore = 10;
      fitHighlights.push(`Experienced helper (${completed} exchanges completed)`);
    } else if (completed >= 1) {
      reliabilityScore = 7;
      fitHighlights.push(`Verified helper (${completed} exchange completed)`);
    } else {
      reliabilityScore = 5; // welcome baseline
    }

    const totalScore = Math.min(100, Math.round(skillScore + availabilityScore + locationScore + ratingScore + reliabilityScore));

    // Construct natural language explanation
    const explanationParts = [];
    if (matchingSkills.length > 0) {
      explanationParts.push(`Matches your ${matchingSkills[0].skill.name} request`);
    } else if (categoryName) {
      explanationParts.push(`Offers help in ${categoryName}`);
    }
    if (helper.availability.length > 0) {
      explanationParts.push(`available ${helper.availability[0].weekday}`);
    }
    if (rating >= 4.5) {
      explanationParts.push(`${rating.toFixed(1)}★ rating`);
    }
    const explanation = explanationParts.join(' • ') || 'Good community helper match';

    results.push({
      helperId: helper.id,
      helperName: helper.profile.fullName,
      email: helper.email,
      area: helper.profile.area,
      averageRating: helper.profile.averageRating,
      reviewCount: helper.profile.reviewCount,
      completedCount: helper.profile.completedCount,
      skills: helper.userSkills.map(us => ({
        name: us.skill.name,
        proficiency: us.proficiency,
        category: us.skill.category.name
      })),
      availability: helper.availability.map(a => ({
        weekday: a.weekday,
        startTime: a.startTime,
        endTime: a.endTime
      })),
      matchScore: totalScore,
      breakdown: {
        skillScore,
        availabilityScore,
        locationScore,
        ratingScore,
        reliabilityScore
      },
      explanation,
      fitHighlights
    });
  }

  // Sort by highest matchScore first
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
