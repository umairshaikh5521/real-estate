"use client";

/**
 * Referral Code Card
 * Displays channel partner's referral code with copy functionality
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/hooks/use-auth";

export function ReferralCodeCard() {
  const { data } = useSession();
  const [copied, setCopied] = useState(false);
  
  const user = data?.data?.user;
  const referralCode = user?.referralCode;

  const handleCopy = async () => {
    if (!referralCode) return;
    
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success("Referral code copied to clipboard!");
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const handleShare = async () => {
    if (!referralCode) return;

    const shareText = `Use my referral code ${referralCode} when you inquire about properties!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Referral Code",
          text: shareText,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Share text copied to clipboard!");
    }
  };

  if (!referralCode) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Your Referral Code
        </CardTitle>
        <CardDescription>
          Share this code with homebuyers to get leads assigned to you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
            <p className="text-3xl font-bold text-primary text-center tracking-wider">
              {referralCode}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="flex-1"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </>
            )}
          </Button>
          
          <Button
            onClick={handleShare}
            variant="default"
            className="flex-1"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          <p>💡 <strong>Tip:</strong> When a homebuyer uses your code, their inquiry will be assigned to you automatically.</p>
        </div>
      </CardContent>
    </Card>
  );
}
