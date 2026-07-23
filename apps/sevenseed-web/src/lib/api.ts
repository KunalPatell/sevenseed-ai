// Sevenseed Platform API Client for FastAPI Endpoints

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface VerifyKeyPayload {
  provider: string;
  api_key: string;
}

export interface VerifyEmailPayload {
  email: string;
}

export interface OutreachSequencePayload {
  product_name: string;
  target_audience: string;
}

export interface BaPrdPayload {
  product_name: string;
  concept_description: string;
  target_users?: string;
}

export interface HiringQuestionsPayload {
  role: string;
  experience_level?: string;
}

export interface EvaluateAnswerPayload {
  question: string;
  candidate_answer: string;
}

export interface MeetingSummaryPayload {
  meeting_title: string;
  transcript_text: string;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'API Request Failed' }));
    throw new Error(errorData.detail || `HTTP Error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // BYOK Key Vault
  verifyApiKey: (payload: VerifyKeyPayload) =>
    fetchApi<{ provider: string; valid: boolean; status: string }>('/api/keys/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getKeysStatus: () =>
    fetchApi<{ mode: string; configured_keys: string[] }>('/api/keys/status'),

  // Growth Outreach Engine
  verifyEmail: (payload: VerifyEmailPayload) =>
    fetchApi<{
      email: string;
      domain: string;
      mx_record_found: boolean;
      is_disposable: boolean;
      deliverability_score: number;
      status: string;
      recommendation: string;
    }>('/api/outreach/verify-email', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  generateOutreachSequence: (payload: OutreachSequencePayload) =>
    fetchApi<{
      product_name: string;
      target_audience: string;
      sequence: Array<{ step: number; channel: string; timing: string; subject?: string; body?: string; message?: string }>;
    }>('/api/outreach/sequence', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // AI Business Analyst PRD Suite
  generatePrd: (payload: BaPrdPayload) =>
    fetchApi<{
      prd_title: string;
      executive_summary: string;
      functional_requirements: Array<{ id: string; feature: string; priority: string; description: string }>;
      system_architecture_recommendation: { frontend: string; backend: string; database: string };
    }>('/api/ba/prd', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // AI Hiring Candidate Screener
  generateHiringQuestions: (payload: HiringQuestionsPayload) =>
    fetchApi<{
      role: string;
      experience_level: string;
      question_set: Array<{ id: number; category: string; question: string }>;
    }>('/api/hiring/questions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  evaluateCandidateAnswer: (payload: EvaluateAnswerPayload) =>
    fetchApi<{
      score: number;
      grade: string;
      feedback: string;
      follow_up_prompt: string;
    }>('/api/hiring/evaluate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // AI Meeting Notetaker
  summarizeMeeting: (payload: MeetingSummaryPayload) =>
    fetchApi<{
      meeting_title: string;
      executive_summary: string;
      key_decisions: string[];
      action_items: Array<{ task: string; owner: string; deadline: string }>;
    }>('/api/meeting/summarize', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Auditec CRM Pipeline
  createCrmLead: (payload: { contact_name: string; email: string; company_name?: string; deal_value?: number }) =>
    fetchApi<{ lead_id: string; contact_name: string; email: string; company: string; stage: string; lead_score: number; estimated_value: number }>('/api/crm/lead', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listCrmPipeline: () =>
    fetchApi<{ pipeline_stages: string[]; total_pipeline_value: number; active_deals_count: number }>('/api/crm/leads'),

  // HR Attendance Portal
  employeeCheckIn: (payload: { employee_id: string; location?: string }) =>
    fetchApi<{ employee_id: string; check_in_time: string; location: string; status: string; attendance_score: number }>('/api/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getAttendanceSummary: () =>
    fetchApi<{ total_employees: number; present_today: number; remote_count: number; office_count: number; monthly_attendance_rate: number }>('/api/attendance/summary'),

  // MeetAir AI Meeting Rooms
  createMeetAirRoom: (payload: { room_name: string; max_participants?: number }) =>
    fetchApi<{ room_id: string; room_name: string; webrtc_url: string; max_participants: number; ai_notetaker_active: boolean }>('/api/meetair/create-room', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // BrainWorld Quiz Engine
  generateBrainQuiz: (payload: { topic: string; num_questions?: number }) =>
    fetchApi<{ topic: string; quiz_set: Array<{ id: number; question: string; options: string[]; correct: string }> }>('/api/quiz/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // CapermintDesk Support Ticket System (Backup-2018)
  createSupportTicket: (payload: { subject: string; category?: string; user_email: string; message: string }) =>
    fetchApi<{ ticket_id: string; subject: string; category: string; user_email: string; status: string; priority: string; assigned_agent: string; estimated_resolution: string }>('/api/support/ticket', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listSupportTickets: () =>
    fetchApi<{ open_tickets_count: number; resolved_tickets_count: number; avg_resolution_time_minutes: number }>('/api/support/tickets'),

  // PTEOnline AI Exam Prep (Backup-2018)
  generateExamPractice: (payload: { exam_type?: string; section?: string }) =>
    fetchApi<{ exam_type: string; section: string; prompt: string; target_speaking_rate: string; target_score_band: string }>('/api/exam/practice', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // SOS Urgent Job Matcher (Backup-2018)
  matchUrgentJobs: (payload: { candidate_skills?: string[]; desired_role?: string }) =>
    fetchApi<{ matched_jobs_count: number; top_matches: Array<{ title: string; company: string; match_score: number; location: string }> }>('/api/jobs/match', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // CompareCart Deal Radar (Backup-2018)
  getDealRadar: () =>
    fetchApi<{ active_deals_count: number; top_deals: Array<{ product: string; discount: string; coupon: string }> }>('/api/deals/radar'),

  // BeautyCloud Service Booking (Backup-2019)
  bookAppointment: (payload: { client_name: string; service_name?: string; preferred_date?: string }) =>
    fetchApi<{ booking_id: string; client_name: string; service_name: string; date: string; status: string; assigned_specialist: string }>('/api/beauty/book', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listAppointments: () =>
    fetchApi<{ total_bookings_today: number; completed_bookings: number; upcoming_bookings: number }>('/api/beauty/appointments'),

  // HappiAds Campaign Engine (Backup-2019)
  createAdCampaign: (payload: { campaign_name: string; budget_usd?: number; target_demographic?: string }) =>
    fetchApi<{ campaign_id: string; campaign_name: string; budget_usd: number; estimated_impressions: number; status: string }>('/api/ads/campaign', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getAdAnalytics: () =>
    fetchApi<{ total_impressions: number; total_clicks: number; average_ctr: string; total_revenue_usd: number }>('/api/ads/analytics'),

  // DigiPay Micro-Wallet (Backup-2019)
  processWalletTransaction: (payload: { user_id: string; amount: number; transaction_type?: string }) =>
    fetchApi<{ tx_id: string; user_id: string; amount: number; type: string; status: string; new_balance: number }>('/api/wallet/transact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getWalletBalance: (userId: string = 'USER-101') =>
    fetchApi<{ user_id: string; currency: string; current_balance: number; wallet_status: string }>(`/api/wallet/balance?user_id=${userId}`),

  // FoodMenu Kitchen Dispatch (Backup-2019)
  placeFoodOrder: (payload: { customer_name: string; items: string[] }) =>
    fetchApi<{ order_id: string; customer_name: string; items_count: number; status: string; estimated_delivery: string }>('/api/food/order', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // AuraGym / GetFit Activity Tracker (Backup-2018)
  logFitnessActivity: (payload: { user_id: string; activity_type?: string; duration_minutes?: number; calories_burned?: number }) =>
    fetchApi<{ log_id: string; user_id: string; activity: string; duration_mins: number; calories_burned: number; status: string }>('/api/fitness/log', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getFitnessSummary: (userId: string = 'USER-101') =>
    fetchApi<{ user_id: string; total_workouts_this_week: number; total_calories_burned: number; fitness_score: number }>(`/api/fitness/summary?user_id=${userId}`),

  // Busline Transit Dispatch (Backup-2018)
  dispatchFleetRoute: (payload: { origin?: string; destination?: string }) =>
    fetchApi<{ route_id: string; origin: string; destination: string; estimated_travel_minutes: number; active_vehicles: number; dispatch_status: string }>('/api/fleet/route', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Hosty Hospitality Reservations (Backup-2018)
  makeHotelReservation: (payload: { guest_name: string; hotel_name?: string; nights?: number }) =>
    fetchApi<{ reservation_id: string; guest_name: string; hotel: string; nights: number; status: string; room_number: number }>('/api/hotel/reserve', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // DonnerApp Donor Matcher (Backup-2018)
  matchDonors: (payload: { blood_group?: string; city?: string }) =>
    fetchApi<{ blood_group: string; city: string; available_donors_count: number; donors: Array<{ donor_id: string; name: string; distance_km: number; contact_status: string }> }>('/api/donor/match', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Carz Taxi Ride Dispatch (Backup-2020)
  bookTaxiRide: (payload: { passenger_name: string; pickup_location?: string; dropoff_location?: string }) =>
    fetchApi<{ ride_id: string; passenger_name: string; pickup: string; dropoff: string; estimated_fare_inr: number; assigned_driver: string; eta_minutes: number; status: string }>('/api/taxi/book', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getTaxiFleetStatus: () =>
    fetchApi<{ active_cabs: number; available_drivers: number; ongoing_trips: number; avg_wait_time_mins: number }>('/api/taxi/status'),

  // BeerApp Beverage Catalog (Backup-2020)
  searchBeverages: (payload: { category?: string; max_price?: number }) =>
    fetchApi<{ category: string; results_count: number; items: Array<{ name: string; abv: string; price_inr: number; rating: number }> }>('/api/beverage/search', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // LocalHoy Hyperlocal Merchant (Backup-2020)
  updateMerchantInventory: (payload: { store_id: string; item_name: string; quantity?: number }) =>
    fetchApi<{ store_id: string; item_name: string; quantity: number; status: string; hyperlocal_radius_km: number }>('/api/merchant/inventory', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listLocalMerchants: () =>
    fetchApi<{ total_merchants: number; active_today: number; deliveries_completed: number }>('/api/merchant/stores'),

  // HeloLudo Lobby Matcher (Backup-2020)
  createGameLobby: (payload: { host_name: string; max_players?: number }) =>
    fetchApi<{ lobby_id: string; host_name: string; max_players: number; current_players: number; status: string; socket_room_token: string }>('/api/lobby/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Circads Real Estate (Backup-2021)
  estimatePropertyValue: (payload: { property_type?: string; city?: string; area_sqft: number; bedrooms?: number }) =>
    fetchApi<{ property_type: string; city: string; area_sqft: number; estimated_valuation_inr: number; price_per_sqft_inr: number; valuation_confidence: string }>('/api/realestate/estimate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listFeaturedProperties: () =>
    fetchApi<{ total_listings: number; featured: Array<{ title: string; city: string; price_lakhs: number; area_sqft: number }> }>('/api/realestate/properties'),

  // AlwaysFresh Express Grocery (Backup-2021)
  placeGroceryOrder: (payload: { customer_name: string; delivery_address: string; items?: string[] }) =>
    fetchApi<{ order_id: string; customer_name: string; items_count: number; delivery_window: string; cold_chain_verified: boolean; status: string }>('/api/grocery/order', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // TailorWay Custom Apparel (Backup-2021)
  placeTailorOrder: (payload: { client_name: string; garment_type?: string; chest_inches?: number; waist_inches?: number }) =>
    fetchApi<{ order_id: string; client_name: string; garment: string; measurements: { chest: number; waist: number }; master_tailor_assigned: string; status: string }>('/api/tailor/order', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // KryptoMarket Asset Tracker (Backup-2021)
  getCryptoTokenPrices: () =>
    fetchApi<{ currency: string; market_status: string; tokens: Array<{ symbol: string; name: string; price: number; change_24h: string }> }>('/api/crypto/prices'),
};
