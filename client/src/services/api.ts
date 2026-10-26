const API_BASE = '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('timebank_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `HTTP error ${res.status}`);
  }
  return data;
}

export const api = {
  // Auth
  async register(body: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  async login(body: any) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  async demoLogin(role: 'member-a' | 'member-b' | 'admin') {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Profile
  async updateProfile(body: any) {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  async updateSkills(skills: { skillId: string; proficiency: string }[]) {
    const res = await fetch(`${API_BASE}/profile/skills`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ skills })
    });
    return handleResponse(res);
  },

  async updateAvailability(availability: { weekday: string; startTime: string; endTime: string }[]) {
    const res = await fetch(`${API_BASE}/profile/availability`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ availability })
    });
    return handleResponse(res);
  },

  async getPublicProfile(userId: string) {
    const res = await fetch(`${API_BASE}/profile/${userId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Listings
  async getListings(params?: { type?: string; categoryId?: string; search?: string; area?: string }) {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.categoryId) query.set('categoryId', params.categoryId);
    if (params?.search) query.set('search', params.search);
    if (params?.area) query.set('area', params.area);

    const res = await fetch(`${API_BASE}/listings?${query.toString()}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async getMyListings() {
    const res = await fetch(`${API_BASE}/listings/my`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async createListing(body: any) {
    const res = await fetch(`${API_BASE}/listings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  async updateListing(id: string, body: any) {
    const res = await fetch(`${API_BASE}/listings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  async deleteListing(id: string) {
    const res = await fetch(`${API_BASE}/listings/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Matching
  async getMatchesForListing(listingId: string) {
    const res = await fetch(`${API_BASE}/matching/listing/${listingId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async previewMatches(body: any) {
    const res = await fetch(`${API_BASE}/matching/preview`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  // Bookings
  async getBookings() {
    const res = await fetch(`${API_BASE}/bookings`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async createBooking(body: any) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  async acceptBooking(id: string) {
    const res = await fetch(`${API_BASE}/bookings/${id}/accept`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async cancelBooking(id: string) {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async confirmBookingCompletion(id: string) {
    const res = await fetch(`${API_BASE}/bookings/${id}/confirm`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async disputeBooking(id: string, reason: string) {
    const res = await fetch(`${API_BASE}/bookings/${id}/dispute`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason })
    });
    return handleResponse(res);
  },

  // Wallet
  async getWallet() {
    const res = await fetch(`${API_BASE}/wallet`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Reviews
  async submitReview(body: { bookingId: string; rating: number; comment: string }) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async updateUserStatus(userId: string, status: string) {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async adjustUserCredits(userId: string, amount: number, reason: string) {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/adjust-credits`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount, reason })
    });
    return handleResponse(res);
  },

  async getAdminReports() {
    const res = await fetch(`${API_BASE}/admin/reports`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async resolveReport(id: string, status: string, resolutionNotes: string) {
    const res = await fetch(`${API_BASE}/admin/reports/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, resolutionNotes })
    });
    return handleResponse(res);
  },

  async getAdminCategories() {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async updateCategoryMultiplierConfig(id: string, body: { multiplierEligible?: boolean; maxMultiplier?: number; reason?: string }) {
    const res = await fetch(`${API_BASE}/admin/categories/${id}/multiplier-config`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  async submitMultiplierDecision(body: { targetType: string; targetId: string; action: string; reason: string; newMultiplier?: number }) {
    const res = await fetch(`${API_BASE}/admin/audit-logs/multiplier-decision`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  async getAdminAuditLogs() {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // AI Assistant
  async askAiAssistant(message: string) {
    const res = await fetch(`${API_BASE}/ai-assistant/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message })
    });
    return handleResponse(res);
  },

  // Credit Redemption
  async getRedemptionOptions(params?: { category?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'ALL') query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    const res = await fetch(`${API_BASE}/redemptions/options?${query.toString()}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async redeemOption(optionId: string) {
    const res = await fetch(`${API_BASE}/redemptions/redeem/${optionId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async getMyRedemptions() {
    const res = await fetch(`${API_BASE}/redemptions/my-history`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async createRedemptionOption(body: any) {
    const res = await fetch(`${API_BASE}/redemptions/options`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  async updateRedemptionOption(id: string, body: any) {
    const res = await fetch(`${API_BASE}/redemptions/options/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  async deleteRedemptionOption(id: string) {
    const res = await fetch(`${API_BASE}/redemptions/options/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async verifyVoucher(voucherCode: string) {
    const res = await fetch(`${API_BASE}/redemptions/verify/${voucherCode}`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Community Credit Pool
  async getCommunityPool() {
    const res = await fetch(`${API_BASE}/community-pool`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async donateToCommunityPool(amount: number, note?: string) {
    const res = await fetch(`${API_BASE}/community-pool/donate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount, note })
    });
    return handleResponse(res);
  },

  async allocateFromCommunityPool(recipientId: string, amount: number, reason: string) {
    const res = await fetch(`${API_BASE}/community-pool/allocate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ recipientId, amount, reason })
    });
    return handleResponse(res);
  }
};

