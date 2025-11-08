/**
 * Public Inquiry Page
 * Homebuyers can submit inquiries with referral codes
 */

import { LeadForm } from "@/components/lead-form";

export default function InquirePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Find Your Dream Home
          </h1>
          <p className="text-muted-foreground text-lg">
            Fill out the form below and our team will get in touch with you shortly
          </p>
        </div>

        <LeadForm />

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Have questions? Contact us at{" "}
            <a href="mailto:support@example.com" className="underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
