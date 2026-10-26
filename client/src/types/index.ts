export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  bio: string | null;
  area: string;
  phone: string | null;
  avatarUrl?: string | null;
  contactPreference: string;
  averageRating: number;
  reviewCount: number;
  completedCount: number;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
  skill: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
}

export interface AvailabilitySlot {
  id?: string;
  weekday: string;
  startTime: string;
  endTime: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'MEMBER' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  creditBalance: number;
  profile: UserProfile | null;
  userSkills?: UserSkill[];
  availability?: AvailabilitySlot[];
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  active: boolean;
  multiplierEligible?: boolean;
  maxMultiplier?: number;
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  categoryId: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  type: 'OFFER' | 'REQUEST';
  categoryId: string;
  category: Category;
  title: string;
  description: string;
  durationHours: number;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED';
  area: string;
  preferredDates: string | null;
  complexityLevel?: 'STANDARD' | 'INTERMEDIATE' | 'ADVANCED';
  multiplier?: number;
  complexityExplanation?: string | null;
  materialsRequired?: boolean;
  urgencyLevel?: 'STANDARD' | 'URGENT';
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    email: string;
    profile: UserProfile | null;
  };
}

export interface MatchScoreResult {
  helperId: string;
  helperName: string;
  email: string;
  area: string;
  averageRating: number;
  reviewCount: number;
  completedCount: number;
  skills: { name: string; proficiency: string; category: string }[];
  availability: { weekday: string; startTime: string; endTime: string }[];
  matchScore: number;
  breakdown: {
    skillScore: number;
    availabilityScore: number;
    locationScore: number;
    ratingScore: number;
    reliabilityScore: number;
  };
  explanation: string;
  fitHighlights: string[];
}

export interface BookingConfirmation {
  id: string;
  bookingId: string;
  userId: string;
  confirmedAt: string;
}

export interface Booking {
  id: string;
  listingId: string | null;
  listing?: Listing | null;
  requesterId: string;
  requester: {
    id: string;
    email: string;
    profile: UserProfile | null;
  };
  helperId: string;
  helper: {
    id: string;
    email: string;
    profile: UserProfile | null;
  };
  startAt: string;
  durationHours: number;
  agreedMultiplier?: number;
  finalCreditAmount?: number;
  notes: string | null;
  status: 'REQUESTED' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  createdAt: string;
  confirmations: BookingConfirmation[];
  reviews: Review[];
}

export interface CreditTransaction {
  id: string;
  bookingId: string | null;
  serviceTitle: string;
  amount: number;
  baseCreditAmount?: number | null;
  multiplier?: number;
  finalCreditAmount?: number | null;
  transactionReason?: string | null;
  type: 'SERVICE_EXCHANGE' | 'ADMIN_ADJUSTMENT' | 'SIGNUP_BONUS' | 'REDEEMED' | 'DONATED_TO_POOL' | 'ALLOCATED_FROM_POOL';
  direction: 'INCOMING' | 'OUTGOING';
  otherParty: string;
  description: string;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  reason: string;
  oldValue?: string | null;
  newValue?: string | null;
  createdAt: string;
  admin?: {
    email: string;
    profile?: { fullName: string } | null;
  };
}

export interface WalletData {
  creditBalance: number;
  totalEarned: number;
  totalSpent: number;
  completedExchanges: number;
  transactions: CreditTransaction[];
}

export interface Review {
  id: string;
  bookingId: string;
  authorId: string;
  author?: {
    id: string;
    profile: {
      fullName: string;
      area?: string;
    } | null;
  };
  subjectId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeListings: number;
  totalBookings: number;
  completedBookings: number;
  openReports: number;
  totalCreditsTransferred: number;
  communityPoolBalance?: number;
  totalRedemptions?: number;
}

export type RedemptionCategory =
  | 'COMMUNITY_EVENT_PASS'
  | 'PARTNER_DISCOUNT'
  | 'VOUCHER'
  | 'DONATED_GOODS'
  | 'LOCAL_SERVICE';

export type RedemptionOptionStatus = 'ACTIVE' | 'OUT_OF_STOCK' | 'PAUSED' | 'EXPIRED';

export interface RedemptionOption {
  id: string;
  title: string;
  description: string;
  category: RedemptionCategory;
  creditCost: number;
  quantityRemaining: number;
  status: RedemptionOptionStatus;
  partnerName?: string | null;
  expiryDate?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Redemption {
  id: string;
  userId: string;
  redemptionOptionId: string;
  creditsSpent: number;
  voucherCode: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
  usedAt?: string | null;
  redemptionOption: RedemptionOption;
  user?: {
    id: string;
    email: string;
    profile?: { fullName: string; area?: string } | null;
  };
}

export interface CommunityPoolDonation {
  id: string;
  poolId: string;
  userId: string;
  amount: number;
  note?: string | null;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    profile?: { fullName: string; avatarUrl?: string | null; area?: string } | null;
  };
}

export interface CommunityPoolAllocation {
  id: string;
  poolId: string;
  recipientId: string;
  adminId: string;
  amount: number;
  reason: string;
  createdAt: string;
  recipient?: {
    id: string;
    email: string;
    profile?: { fullName: string; area?: string } | null;
  };
  admin?: {
    id: string;
    email: string;
    profile?: { fullName: string } | null;
  };
}

export interface CommunityPool {
  id: string;
  name: string;
  description: string;
  currentBalance: number;
  totalDonated: number;
  totalAllocated: number;
  recentDonations: CommunityPoolDonation[];
  recentAllocations: CommunityPoolAllocation[];
}

