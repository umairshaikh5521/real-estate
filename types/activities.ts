/**
 * Activities Types
 */

export interface Activity {
  id: string;
  activityType: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  } | null;
}

export interface ActivitiesResponse {
  success: boolean;
  data: {
    activities: Activity[];
    total: number;
  };
}
