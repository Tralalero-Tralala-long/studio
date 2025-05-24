
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useState, useEffect } from "react";

export default function TermsPage() {
  const { mode } = useAppContext();
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    // Set the date only on the client-side after hydration
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
            <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
              Terms of Service
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-lg ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>
            Welcome to PromoPulse! These are our terms of service.
          </p>
          <p><strong>1. Acceptance of Terms:</strong> By accessing or using PromoPulse, you agree to be bound by these Terms of Service and our Privacy Policy.</p>
          <p><strong>2. Use of Service:</strong> PromoPulse provides a platform to find promotional codes. You agree to use the service responsibly and not to misuse any information or features provided.</p>
          <p><strong>3. User Accounts:</strong> You may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your account information.</p>
          <p><strong>4. Promo Codes:</strong> While we strive to provide accurate and up-to-date promo codes, we do not guarantee their validity or availability. Promo codes are subject to the terms and conditions of the respective merchants.</p>
          <p><strong>5. Limitation of Liability:</strong> PromoPulse is provided "as is" without any warranties. We are not liable for any damages arising from your use of the service.</p>
          <p><strong>6. Changes to Terms:</strong> We reserve the right to modify these terms at any time. Your continued use of the service after changes constitutes acceptance of the new terms.</p>
          {lastUpdated && (
            <p className="mt-6 text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
