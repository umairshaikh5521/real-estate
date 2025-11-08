"use client";

/**
 * Lead Form Component
 * Public form for homebuyers to submit inquiries with referral code
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateLead } from "@/hooks/use-leads";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Valid phone number required"),
  referralCode: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export function LeadForm() {
  const createLead = useCreateLead();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    const submitData = {
      ...data,
      email: data.email || undefined,
      referralCode: data.referralCode || undefined,
      budget: data.budget ? parseFloat(data.budget) : undefined,
    };

    await createLead.mutateAsync(submitData);
    reset();
  };

  const isLoading = isSubmitting || createLead.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Inquire About Properties</CardTitle>
        <CardDescription>
          Fill out the form below and we&apos;ll get back to you soon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              disabled={isLoading}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              disabled={isLoading}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              disabled={isLoading}
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Referral Code */}
          <div className="space-y-2">
            <Label htmlFor="referralCode">
              Referral Code <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="referralCode"
              placeholder="Enter referral code if you have one"
              disabled={isLoading}
              {...register("referralCode")}
              className="uppercase"
            />
            <p className="text-xs text-muted-foreground">
              Have a referral code from a channel partner? Enter it here
            </p>
            {errors.referralCode && (
              <p className="text-sm text-destructive">{errors.referralCode.message}</p>
            )}
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">
              Budget <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="budget"
              type="number"
              placeholder="5000000"
              disabled={isLoading}
              {...register("budget")}
            />
            {errors.budget && (
              <p className="text-sm text-destructive">{errors.budget.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              Additional Information <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Tell us about your requirements..."
              rows={4}
              disabled={isLoading}
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Inquiry"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
