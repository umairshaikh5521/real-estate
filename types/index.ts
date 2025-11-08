// Type definition for booking data
export type Booking = {
  id: string;
  date: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  project: string;
  unit: string;
  amount: string;
  percentage: string;
  paymentStatus: string;
  paymentAmount: string;
  balance: string;
  status: "Active" | "Completed" | "Cancelled";
};

export type BookingStatus = "All Status" | "Active" | "Completed" | "Cancelled";

// Type definition for leads data
export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  leadSource:
    | "Facebook"
    | "Expo"
    | "Walkin"
    | "Referral"
    | "Website"
    | "Campaign";
  projectInterested: string;
  unitDetails?: string;
  status:
    | "New"
    | "Contacted"
    | "Site Visit"
    | "Negotiation"
    | "Booked"
    | "Lost";
  leadScore: number;
  dateCreated: string;
};

export type LeadStatus =
  | "All Status"
  | "New"
  | "Contacted"
  | "Site Visit"
  | "Negotiation"
  | "Booked"
  | "Lost";
export type LeadSource =
  | "All Sources"
  | "Facebook"
  | "Expo"
  | "Walkin"
  | "Referral"
  | "Website"
  | "Campaign";

// Type definition for agent data
export type Agent = {
  id: string;
  name: string;
  pan: string;
  email: string;
  phone: string;
  avatar?: string;
  leads: number;
  bookings: number;
  commissionRate: number;
  totalEarned: number;
  paidAmount: number;
  pendingAmount: number;
  payoutStatus: "Paid" | "Pending";
  status: "Active" | "Inactive";
  type: "External" | "Internal" | "Dealer";
};

export type AgentStatus = "All Status" | "Active" | "Inactive";
export type AgentType = "All Type" | "External" | "Internal" | "Dealer";

// Type definition for project data
export type Project = {
  id: string;
  name: string;
  location: string;
  image: string;
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  unitStatus: string;
  priceRange: string;
  completion: number;
  status: "Upcoming" | "Under Construction" | "Completed";
  type: "Apartments" | "Condos" | "Plots" | "Bungalows" | "Townhouse";
  expectedCompletion: string;
  developer: string;
  amenities: string[];
};

export type ProjectStatus =
  | "All Status"
  | "Upcoming"
  | "Under Construction"
  | "Completed";
export type ProjectType =
  | "All Types"
  | "Apartments"
  | "Condos"
  | "Plots"
  | "Bungalows"
  | "Townhouse";

// Generic data table types
export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  title: string;
}

export interface DataTableFilterableColumn<TData> {
  id: keyof TData;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}
