"use client";

/**
 * Builder Leads View
 * View for builders/admins to see all leads across all channel partners
 * TODO: Implement assignment features, team analytics
 */

import { ChannelPartnerView } from "../channel-partner/channel-partner-view";

export function BuilderView() {
  // TODO: Implement builder-specific features:
  // - All leads view (not just assigned)
  // - Lead assignment dialog
  // - Team performance analytics
  // - Unassigned leads filter
  // - Channel partner performance
  
  // For now, reuse channel partner view
  // Will be enhanced in Phase 2
  return (
    <div>
      <div className="mb-4 p-4 bg-blue-500/10 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Builder View:</strong> Showing all leads. Assignment and analytics features coming soon.
        </p>
      </div>
      <ChannelPartnerView />
    </div>
  );
}
