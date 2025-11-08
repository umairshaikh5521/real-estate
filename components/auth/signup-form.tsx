"use client";

/**
 * Signup Form Component
 * Handles user registration with form validation and API integration
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignup } from "@/hooks/use-auth";
import { UserRole } from "@/types/auth";

// Validation schema matching backend requirements
const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(255, "Full name is too long"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm({ 
  className, 
  ...props 
}: React.ComponentProps<"div">) {
  const signup = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    await signup.mutateAsync({
      email: data.email,
      fullName: data.fullName,
      phone: data.phone || undefined,
      password: data.password,
      role: UserRole.CHANNEL_PARTNER, // Default role
    });
  };

  const isLoading = isSubmitting || signup.isPending;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your details below to create your account
                </p>
              </div>

              {/* Full Name Field */}
              <Field>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  disabled={isLoading}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <FieldDescription className="text-destructive">
                    {errors.fullName.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Email Field */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  disabled={isLoading}
                  {...register("email")}
                />
                {errors.email ? (
                  <FieldDescription className="text-destructive">
                    {errors.email.message}
                  </FieldDescription>
                ) : (
                  <FieldDescription>
                    We&apos;ll use this to contact you. We will not share your
                    email with anyone else.
                  </FieldDescription>
                )}
              </Field>

              {/* Phone Field (Optional) */}
              <Field>
                <FieldLabel htmlFor="phone">
                  Phone Number <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  disabled={isLoading}
                  {...register("phone")}
                />
                {errors.phone && (
                  <FieldDescription className="text-destructive">
                    {errors.phone.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Password Fields */}
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      disabled={isLoading}
                      {...register("password")}
                    />
                    {errors.password && (
                      <FieldDescription className="text-destructive text-xs">
                        {errors.password.message}
                      </FieldDescription>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      disabled={isLoading}
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <FieldDescription className="text-destructive text-xs">
                        {errors.confirmPassword.message}
                      </FieldDescription>
                    )}
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters with uppercase, lowercase, and a
                  number.
                </FieldDescription>
              </Field>

              {/* Submit Button */}
              <Field>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Field>

              <FieldSeparator />

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          
          {/* Side Image */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Signup illustration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      
      <FieldDescription className="px-6 text-center text-xs">
        By clicking continue, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
