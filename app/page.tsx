"use client";

/**
 * Al-Nasr Project Landing Page
 * Public landing page for real estate project with lead capture form
 */

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, MapPin, Home, Users, Phone, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateLead } from "@/hooks/use-leads";

// Lead form validation schema
const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Valid phone number required"),
  referralCode: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export default function LandingPage() {
  const searchParams = useSearchParams();
  const createLead = useCreateLead();
  const [submitted, setSubmitted] = useState(false);

  // Get referral code from URL query params
  const urlReferralCode = searchParams?.get("ref") || searchParams?.get("referralCode") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      referralCode: urlReferralCode,
    },
  });

  // Set referral code when URL params change
  useEffect(() => {
    if (urlReferralCode) {
      setValue("referralCode", urlReferralCode.toUpperCase());
    }
  }, [urlReferralCode, setValue]);

  const onSubmit = async (data: LeadFormData) => {
    const submitData = {
      ...data,
      email: data.email || undefined,
      referralCode: data.referralCode || undefined,
      budget: data.budget ? parseFloat(data.budget) : undefined,
    };

    await createLead.mutateAsync(submitData);
    setSubmitted(true);
    reset();
    
    // Reset submitted state after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-12 w-12" />
            <h1 className="text-5xl md:text-6xl font-bold">Al-Nasr</h1>
          </div>
          <p className="text-xl md:text-2xl mb-2 text-blue-100">Premium Residential Project</p>
          <p className="text-lg md:text-xl text-blue-200 mb-8">
            Your Dream Home Awaits in the Heart of the City
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Prime Location</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              <span>2, 3 & 4 BHK</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Gated Community</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900">
            World-Class Amenities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "24/7 Security", desc: "Gated community with CCTV surveillance" },
              { title: "Modern Gym", desc: "State-of-the-art fitness center" },
              { title: "Swimming Pool", desc: "Olympic-size swimming pool with kids pool" },
              { title: "Landscaped Gardens", desc: "Beautiful green spaces for relaxation" },
              { title: "Parking", desc: "Covered parking for all residents" },
              { title: "Power Backup", desc: "24/7 power backup and water supply" },
            ].map((feature, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 bg-slate-50" id="contact">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Register Your Interest
            </h2>
            <p className="text-lg text-muted-foreground">
              Fill in your details and our team will get back to you shortly
            </p>
            {urlReferralCode && (
              <p className="mt-4 text-sm text-blue-600 font-medium">
                🎫 Referral Code Applied: <span className="font-mono">{urlReferralCode.toUpperCase()}</span>
              </p>
            )}
          </div>

          {submitted ? (
            <Card className="max-w-2xl mx-auto bg-green-50 border-green-200">
              <CardContent className="pt-12 pb-12 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-900 mb-2">
                  Thank You!
                </h3>
                <p className="text-green-700 mb-4">
                  Your inquiry has been submitted successfully.
                </p>
                <p className="text-green-600">
                  Our team will contact you shortly to discuss Al-Nasr project details.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  We&apos;ll reach out to you with complete project details and pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      disabled={createLead.isPending}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-muted-foreground text-xs">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                        disabled={createLead.isPending}
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="pl-10"
                        disabled={createLead.isPending}
                        {...register("phone")}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <Label htmlFor="budget">
                      Budget <span className="text-muted-foreground text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="e.g., 5000000"
                      disabled={createLead.isPending}
                      {...register("budget")}
                    />
                    {errors.budget && (
                      <p className="text-sm text-destructive">{errors.budget.message}</p>
                    )}
                  </div>

                  {/* Referral Code */}
                  <div className="space-y-2">
                    <Label htmlFor="referralCode">
                      Referral Code{" "}
                      <span className="text-muted-foreground text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="referralCode"
                      placeholder="Enter referral code if you have one"
                      className="uppercase font-mono"
                      disabled={createLead.isPending}
                      {...register("referralCode")}
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 Have a referral code from our channel partner? Enter it here for priority assistance
                    </p>
                    {errors.referralCode && (
                      <p className="text-sm text-destructive">{errors.referralCode.message}</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">
                      Additional Information{" "}
                      <span className="text-muted-foreground text-xs">(Optional)</span>
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Tell us about your requirements (preferred floor, facing, possession timeline, etc.)"
                      rows={4}
                      disabled={createLead.isPending}
                      {...register("notes")}
                    />
                    {errors.notes && (
                      <p className="text-sm text-destructive">{errors.notes.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={createLead.isPending}
                    className="w-full h-12 text-base"
                    size="lg"
                  >
                    {createLead.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Phone className="mr-2 h-5 w-5" />
                        Submit Inquiry
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By submitting this form, you agree to be contacted by our sales team
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-8 w-8" />
            <h3 className="text-2xl font-bold">Al-Nasr</h3>
          </div>
          <p className="text-slate-400 mb-6">Premium Residential Project</p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>info@alnasr.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Mumbai, India</span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-xs text-slate-500">
            <p>&copy; 2025 Al-Nasr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
