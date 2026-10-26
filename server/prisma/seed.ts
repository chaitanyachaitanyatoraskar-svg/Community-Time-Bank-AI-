import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing records
  await prisma.adminAuditLog.deleteMany();
  await prisma.communityPoolAllocation.deleteMany();
  await prisma.communityPoolDonation.deleteMany();
  await prisma.communityPool.deleteMany();
  await prisma.redemption.deleteMany();
  await prisma.redemptionOption.deleteMany();
  await prisma.report.deleteMany();
  await prisma.review.deleteMany();
  await prisma.creditTransaction.deleteMany();
  await prisma.completionConfirmation.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.category.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 1. Create Categories
  const catTech = await prisma.category.create({
    data: {
      name: 'Tech & Computers',
      description: 'Computer troubleshooting, software setup, mobile devices, programming help',
      icon: 'Laptop',
      active: true
    }
  });

  const catGarden = await prisma.category.create({
    data: {
      name: 'Gardening & Outdoors',
      description: 'Plant care, landscaping, lawn maintenance, vegetable gardening',
      icon: 'Sprout',
      active: true
    }
  });

  const catHome = await prisma.category.create({
    data: {
      name: 'Home Repair & DIY',
      description: 'Furniture assembly, minor plumbing, painting, tool sharing',
      icon: 'Wrench',
      active: true
    }
  });

  const catTutor = await prisma.category.create({
    data: {
      name: 'Tutoring & Languages',
      description: 'Math, science, English ESL, Spanish, music instruction',
      icon: 'BookOpen',
      active: true
    }
  });

  const catCreative = await prisma.category.create({
    data: {
      name: 'Creative & Design',
      description: 'Graphic design, video editing, photography, resume review',
      icon: 'Palette',
      active: true
    }
  });

  // 2. Create Skills
  const skillCompHelp = await prisma.skill.create({ data: { name: 'Basic Computer Help', categoryId: catTech.id } });
  const skillWifi = await prisma.skill.create({ data: { name: 'Wi-Fi & Network Setup', categoryId: catTech.id } });
  const skillPython = await prisma.skill.create({ data: { name: 'Python Programming', categoryId: catTech.id } });
  const skillPlant = await prisma.skill.create({ data: { name: 'Plant Care & Pruning', categoryId: catGarden.id } });
  const skillVeg = await prisma.skill.create({ data: { name: 'Vegetable Gardening', categoryId: catGarden.id } });
  const skillFurniture = await prisma.skill.create({ data: { name: 'Furniture Assembly', categoryId: catHome.id } });
  const skillMath = await prisma.skill.create({ data: { name: 'Math Tutoring', categoryId: catTutor.id } });
  const skillDesign = await prisma.skill.create({ data: { name: 'Graphic Design Basics', categoryId: catCreative.id } });

  console.log('✅ Categories and Skills created.');

  // Password hashes
  const memberPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // 3. Create Member A (Requester: Alice)
  const userA = await prisma.user.create({
    data: {
      email: 'member.a@college.edu',
      passwordHash: memberPassword,
      role: 'MEMBER',
      status: 'ACTIVE',
      creditBalance: 4.0,
      profile: {
        create: {
          fullName: 'Alice Johnson',
          bio: 'College junior studying literature. Love reading, writing, and community organizing.',
          area: 'Downtown',
          phone: '+1 (555) 019-2834',
          contactPreference: 'IN_APP',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          averageRating: 5.0,
          reviewCount: 2,
          completedCount: 2
        }
      },
      availability: {
        create: [
          { weekday: 'Saturday', startTime: '10:00', endTime: '16:00' },
          { weekday: 'Sunday', startTime: '13:00', endTime: '18:00' }
        ]
      }
    }
  });

  // 4. Create Member B (Helper: Bob - Perfect match for Computer Help)
  const userB = await prisma.user.create({
    data: {
      email: 'member.b@college.edu',
      passwordHash: memberPassword,
      role: 'MEMBER',
      status: 'ACTIVE',
      creditBalance: 3.0,
      profile: {
        create: {
          fullName: 'Bob Smith',
          bio: 'Computer Science sophomore passionate about open source, Linux, and teaching tech.',
          area: 'Downtown',
          phone: '+1 (555) 014-9821',
          contactPreference: 'IN_APP',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          averageRating: 5.0,
          reviewCount: 4,
          completedCount: 4
        }
      },
      availability: {
        create: [
          { weekday: 'Saturday', startTime: '09:00', endTime: '17:00' },
          { weekday: 'Wednesday', startTime: '16:00', endTime: '20:00' }
        ]
      }
    }
  });

  // Assign skills to Bob
  await prisma.userSkill.create({ data: { userId: userB.id, skillId: skillCompHelp.id, proficiency: 'EXPERT' } });
  await prisma.userSkill.create({ data: { userId: userB.id, skillId: skillWifi.id, proficiency: 'INTERMEDIATE' } });
  await prisma.userSkill.create({ data: { userId: userB.id, skillId: skillPython.id, proficiency: 'EXPERT' } });

  // 5. Create Member C (Carlos: Gardener & Math Tutor)
  const userC = await prisma.user.create({
    data: {
      email: 'member.c@college.edu',
      passwordHash: memberPassword,
      role: 'MEMBER',
      status: 'ACTIVE',
      creditBalance: 5.0,
      profile: {
        create: {
          fullName: 'Carlos Mendez',
          bio: 'Urban gardening enthusiast and DIY handyman with 5 years community volunteering.',
          area: 'Westside',
          phone: '+1 (555) 018-7744',
          contactPreference: 'IN_APP',
          avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
          averageRating: 4.9,
          reviewCount: 6,
          completedCount: 6
        }
      },
      availability: {
        create: [
          { weekday: 'Sunday', startTime: '09:00', endTime: '15:00' },
          { weekday: 'Friday', startTime: '15:00', endTime: '19:00' }
        ]
      }
    }
  });

  await prisma.userSkill.create({ data: { userId: userC.id, skillId: skillPlant.id, proficiency: 'EXPERT' } });
  await prisma.userSkill.create({ data: { userId: userC.id, skillId: skillVeg.id, proficiency: 'EXPERT' } });
  await prisma.userSkill.create({ data: { userId: userC.id, skillId: skillMath.id, proficiency: 'INTERMEDIATE' } });

  // 6. Create Administrator
  const admin = await prisma.user.create({
    data: {
      email: 'admin@college.edu',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      creditBalance: 100.0,
      profile: {
        create: {
          fullName: 'Campus Admin',
          bio: 'Platform safety moderator and Community Time Bank administrator.',
          area: 'Campus Center',
          contactPreference: 'EMAIL',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          averageRating: 5.0,
          reviewCount: 0,
          completedCount: 0
        }
      }
    }
  });

  console.log('✅ Member A, Member B, Member C, and Admin created.');

  // 7. Initial Welcome Transactions
  await prisma.creditTransaction.createMany({
    data: [
      { toUserId: userA.id, amount: 4.0, type: 'SIGNUP_BONUS', description: 'Initial account allocation + verified onboarding credit' },
      { toUserId: userB.id, amount: 3.0, type: 'SIGNUP_BONUS', description: 'Welcome signup bonus' },
      { toUserId: userC.id, amount: 5.0, type: 'SIGNUP_BONUS', description: 'Welcome signup bonus + community leader grant' }
    ]
  });

  // 8. Create Sample Listings
  const listingA = await prisma.listing.create({
    data: {
      ownerId: userA.id,
      type: 'REQUEST',
      categoryId: catTech.id,
      title: 'Need 1 hour of laptop & printer setup assistance',
      description: 'Looking for a kind neighbor to help configure my wireless printer and organize my laptop backup storage.',
      durationHours: 1.0,
      complexityLevel: 'STANDARD',
      multiplier: 1.0,
      complexityExplanation: 'Basic wireless printer setup and cloud storage backup.',
      materialsRequired: false,
      urgencyLevel: 'STANDARD',
      status: 'ACTIVE',
      area: 'Downtown',
      preferredDates: 'Saturday morning preferred'
    }
  });

  const listingB = await prisma.listing.create({
    data: {
      ownerId: userB.id,
      type: 'OFFER',
      categoryId: catTech.id,
      title: 'Advanced Laptop Diagnostics & Solder Component Repair',
      description: 'Motherboard hardware diagnostics, thermal paste replacement, and micro-soldering rework requiring specialized tools and antistatic workstation.',
      durationHours: 2.0,
      complexityLevel: 'ADVANCED',
      multiplier: 1.5,
      complexityExplanation: 'High technical specialization, component-level micro-soldering, and expensive precision equipment used.',
      materialsRequired: true,
      urgencyLevel: 'STANDARD',
      status: 'ACTIVE',
      area: 'Downtown',
      preferredDates: 'Saturday or Wednesday afternoons'
    }
  });

  const listingC = await prisma.listing.create({
    data: {
      ownerId: userC.id,
      type: 'OFFER',
      categoryId: catGarden.id,
      title: 'Balcony Vegetable & Herbal Garden Consultation',
      description: 'Learn how to start growing cherry tomatoes, basil, and peppers with soil pH testing and organic fertilizer prep.',
      durationHours: 1.5,
      complexityLevel: 'INTERMEDIATE',
      multiplier: 1.25,
      complexityExplanation: 'Soil composition testing and specialized organic pruning guide.',
      materialsRequired: true,
      urgencyLevel: 'STANDARD',
      status: 'ACTIVE',
      area: 'Westside',
      preferredDates: 'Sunday mornings'
    }
  });

  // 9. Generate Multiple Bookings Across States (REQUESTED, ACCEPTED, COMPLETED, DISPUTED)
  
  // Booking 1: ACCEPTED between Alice and Bob (Laptop Repair at 1.5x)
  const bookingAccepted1 = await prisma.booking.create({
    data: {
      requesterId: userA.id,
      helperId: userB.id,
      listingId: listingB.id,
      startAt: new Date(Date.now() + 2 * 86400000), // In 2 days
      durationHours: 2.0,
      agreedMultiplier: 1.5,
      finalCreditAmount: 3.0,
      notes: 'Mode: In-person • Meet at campus tech lab. 2.0 hrs @ 1.5x = 3.0 credits.',
      status: 'ACCEPTED'
    }
  });

  // Booking 2: REQUESTED from Alice to Carlos (Math Tutoring at 1.0x)
  await prisma.booking.create({
    data: {
      requesterId: userA.id,
      helperId: userC.id,
      listingId: null,
      startAt: new Date(Date.now() + 4 * 86400000), // In 4 days
      durationHours: 2.0,
      agreedMultiplier: 1.0,
      finalCreditAmount: 2.0,
      notes: 'Mode: Online • Need help preparing for linear algebra midterm (2.0 hrs @ 1.0x = 2.0 credits).',
      status: 'REQUESTED'
    }
  });

  // Booking 3: REQUESTED from Carlos to Bob (Greenhouse Automation at 1.25x)
  await prisma.booking.create({
    data: {
      requesterId: userC.id,
      helperId: userB.id,
      listingId: listingB.id,
      startAt: new Date(Date.now() + 5 * 86400000),
      durationHours: 2.0,
      agreedMultiplier: 1.25,
      finalCreditAmount: 2.5,
      notes: 'Mode: Online • Automating greenhouse sensor data export script (2.0 hrs @ 1.25x = 2.5 credits).',
      status: 'REQUESTED'
    }
  });

  // Booking 4: COMPLETED (Bob helped Carlos with Advanced Arduino Sensor at 1.5x)
  const bookingCompleted1 = await prisma.booking.create({
    data: {
      requesterId: userC.id,
      helperId: userB.id,
      listingId: listingB.id,
      startAt: new Date(Date.now() - 7 * 86400000),
      durationHours: 2.0,
      agreedMultiplier: 1.5,
      finalCreditAmount: 3.0,
      notes: 'Helped set up automated plant watering sensor with Arduino circuit soldering (2.0 hrs @ 1.5x = 3.0 cr)',
      status: 'COMPLETED'
    }
  });

  await prisma.completionConfirmation.createMany({
    data: [
      { bookingId: bookingCompleted1.id, userId: userC.id },
      { bookingId: bookingCompleted1.id, userId: userB.id }
    ]
  });

  await prisma.creditTransaction.create({
    data: {
      bookingId: bookingCompleted1.id,
      fromUserId: userC.id,
      toUserId: userB.id,
      amount: 3.0,
      baseCreditAmount: 2.0,
      multiplier: 1.5,
      finalCreditAmount: 3.0,
      transactionReason: '2.0 hrs × 1.5× complexity multiplier (ADVANCED: Hardware diagnostics & soldering)',
      type: 'SERVICE_EXCHANGE',
      description: 'Completed exchange: "Advanced Laptop Diagnostics & Solder Component Repair" (2.0 hr @ 1.5× = 3.0 cr)'
    }
  });

  await prisma.review.create({
    data: {
      bookingId: bookingCompleted1.id,
      authorId: userC.id,
      subjectId: userB.id,
      rating: 5,
      comment: 'Bob was fantastic! Patient, knowledgeable, and helped troubleshoot the setup quickly.'
    }
  });

  // Seed sample Admin Audit Log
  await prisma.adminAuditLog.create({
    data: {
      adminId: admin.id,
      action: 'MULTIPLIER_APPROVAL',
      targetType: 'LISTING',
      targetId: listingB.id,
      reason: 'Verified technician certification and specialized micro-soldering toolkit requirement.',
      oldValue: '1.0x (STANDARD)',
      newValue: '1.5x (ADVANCED)'
    }
  });

  // Booking 5: COMPLETED (Carlos helped Alice with Balcony Herb Garden)
  const bookingCompleted2 = await prisma.booking.create({
    data: {
      requesterId: userA.id,
      helperId: userC.id,
      listingId: listingC.id,
      startAt: new Date(Date.now() - 3 * 86400000),
      durationHours: 1.0,
      notes: 'Mode: In-person • Organic basil and mint planting setup.',
      status: 'COMPLETED'
    }
  });

  await prisma.completionConfirmation.createMany({
    data: [
      { bookingId: bookingCompleted2.id, userId: userA.id },
      { bookingId: bookingCompleted2.id, userId: userC.id }
    ]
  });

  await prisma.creditTransaction.create({
    data: {
      bookingId: bookingCompleted2.id,
      fromUserId: userA.id,
      toUserId: userC.id,
      amount: 1.0,
      type: 'SERVICE_EXCHANGE',
      description: 'Completed 1-on-1 exchange: "Balcony Herb Garden Setup" (1 hr = 1 credit)'
    }
  });

  await prisma.review.create({
    data: {
      bookingId: bookingCompleted2.id,
      authorId: userA.id,
      subjectId: userC.id,
      rating: 5,
      comment: 'Carlos brought potting soil and taught me how to prune basil properly. Super kind and helpful!'
    }
  });

  // Booking 6: DISPUTED sample (for Admin dispute desk verification)
  const bookingDisputed = await prisma.booking.create({
    data: {
      requesterId: userC.id,
      helperId: userA.id,
      listingId: null,
      startAt: new Date(Date.now() - 2 * 86400000),
      durationHours: 1.0,
      notes: 'Creative writing proofreading session',
      status: 'DISPUTED'
    }
  });

  await prisma.report.create({
    data: {
      reporterId: userC.id,
      targetUserId: userA.id,
      bookingId: bookingDisputed.id,
      reason: 'Session was cut short due to audio disconnect; requesting administrative review and credit re-check.',
      status: 'OPEN'
    }
  });

  // 7. Seed Community Credit Pool & Transparent Transactions
  const pool = await prisma.communityPool.create({
    data: {
      id: 'default-pool',
      name: 'Campus Community Care Pool',
      description: 'Shared credit reserve funded by member donations to provide welcome grants and hardship assistance.',
      currentBalance: 8.0,
      totalDonated: 10.0,
      totalAllocated: 2.0
    }
  });

  // Seed sample donation from Bob
  await prisma.communityPoolDonation.create({
    data: {
      poolId: pool.id,
      donorId: userB.id,
      amount: 5.0,
      note: 'Happy to give back surplus credits from my weekend Python tutoring sessions!'
    }
  });
  await prisma.creditTransaction.create({
    data: {
      fromUserId: userB.id,
      toUserId: null,
      amount: 5.0,
      type: 'DONATED_TO_POOL',
      description: 'Donated 5.0 credits to the Campus Community Care Pool'
    }
  });

  // Seed sample donation from Alice
  await prisma.communityPoolDonation.create({
    data: {
      poolId: pool.id,
      donorId: userA.id,
      amount: 5.0,
      note: 'Supporting incoming transfer students and community garden projects.'
    }
  });
  await prisma.creditTransaction.create({
    data: {
      fromUserId: userA.id,
      toUserId: null,
      amount: 5.0,
      type: 'DONATED_TO_POOL',
      description: 'Donated 5.0 credits to the Campus Community Care Pool'
    }
  });

  // Seed sample allocation from Admin to Carlos
  await prisma.communityPoolAllocation.create({
    data: {
      poolId: pool.id,
      recipientId: userC.id,
      adminId: admin.id,
      amount: 2.0,
      reason: 'Welcome seed grant to assist with campus community greenhouse supplies.'
    }
  });
  await prisma.creditTransaction.create({
    data: {
      fromUserId: admin.id,
      toUserId: userC.id,
      amount: 2.0,
      type: 'ALLOCATED_FROM_POOL',
      description: 'Community Pool Grant: Welcome seed grant for greenhouse supplies'
    }
  });

  // 8. Seed Approved Credit Redemption Options
  const optionList = [
    {
      title: 'Campus Spring Acoustic Music Fest - VIP Pass',
      description: 'Front-row festival pass, complimentary drink voucher, and artist meet & greet.',
      category: 'EVENT_PASS',
      creditCost: 3.0,
      quantityTotal: 25,
      quantityRemaining: 18,
      status: 'ACTIVE',
      partnerName: 'Campus Arts & Culture Union',
      expiryDate: new Date(Date.now() + 30 * 86400000),
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Local Campus Bookstore & Stationery Discount (30% Off)',
      description: 'Redeem for 30% off any course textbook, notebook bundle, or art supply order.',
      category: 'PARTNER_DISCOUNT',
      creditCost: 2.0,
      quantityTotal: 50,
      quantityRemaining: 34,
      status: 'ACTIVE',
      partnerName: 'Downtown University Co-op Bookstore',
      expiryDate: new Date(Date.now() + 60 * 86400000),
      imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Makerspace 3D Printing & Laser Cutter Workshop Voucher',
      description: 'Includes 5 hours of machine time plus 500g of PLA filament and safety induction.',
      category: 'VOUCHER',
      creditCost: 2.5,
      quantityTotal: 30,
      quantityRemaining: 21,
      status: 'ACTIVE',
      partnerName: 'Engineering Makerspace Lab',
      expiryDate: new Date(Date.now() + 45 * 86400000),
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Organic Campus Garden Seed & Herb Planter Kit',
      description: 'Complete balcony gardening starter kit: organic basil, mint, cherry tomato seeds, potting mix, and biodegradable planter pots.',
      category: 'DONATED_GOOD',
      creditCost: 1.5,
      quantityTotal: 40,
      quantityRemaining: 29,
      status: 'ACTIVE',
      partnerName: 'Campus Sustainability Club',
      expiryDate: new Date(Date.now() + 90 * 86400000),
      imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Full Campus Bicycle Tune-Up & Safety Inspection',
      description: 'Comprehensive gear adjustment, brake bleeding, chain lubrication, and tire trueing by student bike mechanics.',
      category: 'LOCAL_SERVICE',
      creditCost: 2.0,
      quantityTotal: 20,
      quantityRemaining: 12,
      status: 'ACTIVE',
      partnerName: 'Bike Collective Co-op',
      expiryDate: new Date(Date.now() + 60 * 86400000),
      imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Zero-Waste Campus Cafe Fair-Trade Coffee & Bakery Card',
      description: 'Valid for 3 premium espresso beverages and artisan pastries of your choice.',
      category: 'VOUCHER',
      creditCost: 1.0,
      quantityTotal: 100,
      quantityRemaining: 76,
      status: 'ACTIVE',
      partnerName: 'The Green Bean Student Cafe',
      expiryDate: new Date(Date.now() + 30 * 86400000),
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80'
    }
  ];

  for (const opt of optionList) {
    await prisma.redemptionOption.create({ data: opt });
  }

  // Seed sample redemption for Alice
  const cafeOption = await prisma.redemptionOption.findFirst({ where: { title: { contains: 'Coffee' } } });
  if (cafeOption) {
    await prisma.redemption.create({
      data: {
        userId: userA.id,
        redemptionOptionId: cafeOption.id,
        creditsSpent: cafeOption.creditCost,
        voucherCode: 'TB-RED-9K3E-7W2P',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 86400000)
      }
    });
    await prisma.creditTransaction.create({
      data: {
        fromUserId: userA.id,
        toUserId: null,
        amount: cafeOption.creditCost,
        type: 'REDEEMED',
        description: `Redeemed: ${cafeOption.title} (Voucher: TB-RED-9K3E-7W2P)`
      }
    });
  }

  console.log('✅ Community Pool and Redemption Options seeded successfully!');
  console.log('✅ Multiple realistic bookings generated across REQUESTED, ACCEPTED, COMPLETED, and DISPUTED states!');
  console.log('---------------------------------------------------------');
  console.log('Demo Accounts:');
  console.log('  👤 Member A (Requester): member.a@college.edu / password123');
  console.log('  🛠️ Member B (Helper):    member.b@college.edu / password123');
  console.log('  🌱 Member C (Gardener):  member.c@college.edu / password123');
  console.log('  🛡️ Admin:                admin@college.edu    / admin123');
  console.log('---------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
