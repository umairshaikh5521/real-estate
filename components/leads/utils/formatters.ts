/**
 * Lead Formatting Utilities
 * Pure functions for data formatting
 */

/**
 * Format budget to Indian currency format
 */
export function formatBudget(budget: number | string): string {
  const numBudget = typeof budget === "string" ? parseFloat(budget) : budget;

  if (numBudget >= 10000000) {
    return `₹${(numBudget / 10000000).toFixed(1)}Cr`;
  } else if (numBudget >= 100000) {
    return `₹${(numBudget / 100000).toFixed(1)}L`;
  } else if (numBudget >= 1000) {
    return `₹${(numBudget / 1000).toFixed(1)}K`;
  } else {
    return `₹${numBudget.toLocaleString("en-IN")}`;
  }
}

/**
 * Get relative time string
 */
export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - targetDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
}

/**
 * Get status display label
 */
export function getStatusLabel(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get status color classes
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "new":
      return "bg-blue-500/10 text-blue-700 border-blue-200";
    case "contacted":
      return "bg-purple-500/10 text-purple-700 border-purple-200";
    case "qualified":
      return "bg-green-500/10 text-green-700 border-green-200";
    case "negotiation":
      return "bg-orange-500/10 text-orange-700 border-orange-200";
    case "converted":
      return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
    case "lost":
      return "bg-red-500/10 text-red-700 border-red-200";
    default:
      return "bg-gray-500/10 text-gray-700 border-gray-200";
  }
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}
