/**
 * Follow-ups Types
 */

export interface FollowUp {
  id: string;
  leadId: string;
  userId: string;
  scheduledAt: string;
  completedAt: string | null;
  status: "pending" | "completed" | "cancelled";
  type: "call" | "meeting" | "email" | "whatsapp";
  notes: string | null;
  reminder: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFollowUpRequest {
  scheduledAt: string; // ISO date string
  type: "call" | "meeting" | "email" | "whatsapp";
  notes?: string;
  reminder?: boolean;
}

export interface UpdateFollowUpRequest {
  status?: "completed" | "cancelled";
  notes?: string;
}

export interface FollowUpsResponse {
  success: boolean;
  data: {
    followUps: FollowUp[];
    total: number;
  };
}

export interface CreateFollowUpResponse {
  success: boolean;
  data: {
    followUp: FollowUp;
    message: string;
  };
}
