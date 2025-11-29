"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, Check, Quote, ShieldCheck, BarChart, IndianRupee, Megaphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/lib/api";

export default function SellerRegistrationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    storeName: "",
    gstin: "",
    pickupAddress: "",
  });
  
  const [kycFiles, setKycFiles] = useState({
    aadhaar: { front: null as File | null, back: null as File | null },
    panOrGst: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (type: string, side?: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (type === "aadhaar") {
        if (side === "front") {
          setKycFiles(prev => ({ ...prev, aadhaar: { ...prev.aadhaar, front: file } }));
        } else if (side === "back") {
          setKycFiles(prev => ({ ...prev, aadhaar: { ...prev.aadhaar, back: file } }));
        }
      } else if (type === "panOrGst") {
        setKycFiles(prev => ({ ...prev, panOrGst: file }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await fetchClient("/sellers/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      alert("Application submitted for approval! You will be notified via email.");
      router.push("/login"); // Redirect to login page after successful registration
    } catch (err: any) {
      setError(err.message || "Failed to register as a seller.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 pt-20 lg:pt-0">
      {/* Left Panel - Info & Testimonials */}
      <div className="hidden lg:flex flex-col justify-between bg-card/30 backdrop-blur-md border-r border-white/5 p-12 xl:p-20 relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent -z-10" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />

        <div>
          <div className="flex items-center gap-3 mb-12">
             <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transform rotate-3 shadow-lg">
                <span className="text-white font-bold text-xl">T</span>
             </div>
             <span className="font-bold text-2xl tracking-tight">TezCart Seller</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
            Grow your business with India&apos;s fastest scaling marketplace.
          </h1>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12 relative">
            <Quote className="absolute top-6 left-6 text-primary/40 w-10 h-10 -z-10" />
            <p className="text-lg font-medium leading-relaxed mb-6 relative z-10">
              &quot;Tezcart helped me grow my business from a small local shop to a thriving online store. The 0% commission for the first 30 days allowed me to test the platform with zero risk.&quot;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-black flex items-center justify-center border border-white/10 font-bold">
                RK
              </div>
              <div>
                <div className="font-semibold">Rajesh Kumar</div>
                <div className="text-sm text-muted-foreground">Electronics Seller, Delhi</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-6">
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                   <Megaphone className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="font-semibold mb-1">Access to 10M+ Customers</h4>
                   <p className="text-sm text-muted-foreground">Instantly reach millions of buyers across Tier 1, 2 and 3 cities.</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                   <BarChart className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="font-semibold mb-1">Advanced Analytics</h4>
                   <p className="text-sm text-muted-foreground">Real-time data on sales, inventory, and customer behavior.</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                   <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="font-semibold mb-1">Fast Settlements</h4>
                   <p className="text-sm text-muted-foreground">Get paid within 24 hours of product delivery.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-col justify-center p-6 md:p-12 lg:p-20 bg-background/50">
        <div className="max-w-lg mx-auto w-full">
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-3">Create Seller Account</h2>
            <p className="text-muted-foreground">Complete the steps below to verify your business.</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-secondary -z-10" />
            {[1, 2, 3].map((step) => (
              <div key={step} className={`flex flex-col items-center gap-2 bg-background z-10 px-2`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    currentStep >= step 
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20" 
                    : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                <span className={`text-xs font-medium ${currentStep >= step ? "text-foreground" : "text-muted-foreground"}`}>
                  {step === 1 ? "Account" : step === 2 ? "Business" : "KYC"}
                </span>
              </div>
            ))}
          </div>
          {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
          {/* Step 1: Account Information */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="bg-secondary/50"
                  />
                </div>
              </div>

              <Button className="w-full mt-6 text-lg h-12" onClick={() => setCurrentStep(2)}>
                Continue to Business Details
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4">
                 Already have an account? <span className="text-primary cursor-pointer hover:underline">Log in</span>
              </p>
            </div>
          )}

          {/* Step 2: Business Details */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  placeholder="e.g. Super Electronics"
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN (Optional)</Label>
                <Input
                  id="gstin"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleInputChange}
                  placeholder="GSTIN Number"
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup Address</Label>
                <Textarea
                  id="pickupAddress"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleInputChange}
                  className="bg-secondary/50 min-h-[100px]"
                  placeholder="Enter complete address for courier pickup"
                />
              </div>

              <div className="flex gap-4 mt-8">
                <Button variant="outline" className="flex-1 h-12" onClick={() => setCurrentStep(1)}>Back</Button>
                <Button className="flex-1 h-12" onClick={() => setCurrentStep(3)}>Continue to KYC</Button>
              </div>
            </div>
          )}

          {/* Step 3: KYC Documents */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex items-start gap-3">
                 <ShieldCheck className="text-amber-500 shrink-0 mt-1" />
                 <div className="text-sm">
                    <p className="font-semibold text-amber-500 mb-1">Identity Verification</p>
                    <p className="text-muted-foreground">Government regulations require us to verify your identity before payouts.</p>
                 </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Aadhaar Front */}
                    <div 
                      className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                      onClick={() => document.getElementById('aadhaarFrontInput')?.click()}
                    >
                       <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-6 h-6 text-muted-foreground" />
                       </div>
                       <span className="text-sm font-medium">Aadhaar Front</span>
                       <span className="text-xs text-muted-foreground mt-1">JPG/PDF (Max 5MB)</span>
                       <input type="file" id="aadhaarFrontInput" className="hidden" onChange={handleFileUpload('aadhaar', 'front')} />
                       {kycFiles.aadhaar.front && <p className="mt-2 text-xs text-green-500 font-medium truncate w-full">{kycFiles.aadhaar.front.name}</p>}
                    </div>

                    {/* Aadhaar Back */}
                    <div 
                      className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                      onClick={() => document.getElementById('aadhaarBackInput')?.click()}
                    >
                       <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-6 h-6 text-muted-foreground" />
                       </div>
                       <span className="text-sm font-medium">Aadhaar Back</span>
                       <span className="text-xs text-muted-foreground mt-1">JPG/PDF (Max 5MB)</span>
                       <input type="file" id="aadhaarBackInput" className="hidden" onChange={handleFileUpload('aadhaar', 'back')} />
                       {kycFiles.aadhaar.back && <p className="mt-2 text-xs text-green-500 font-medium truncate w-full">{kycFiles.aadhaar.back.name}</p>}
                    </div>
                </div>

                {/* PAN/GST */}
                <div 
                    className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    onClick={() => document.getElementById('panOrGstInput')?.click()}
                >
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Upload PAN Card or GST Certificate</span>
                    <span className="text-xs text-muted-foreground mt-1">JPG/PDF (Max 5MB)</span>
                    <input type="file" id="panOrGstInput" className="hidden" onChange={handleFileUpload('panOrGst')} />
                    {kycFiles.panOrGst && <p className="mt-2 text-xs text-green-500 font-medium truncate w-full">{kycFiles.panOrGst.name}</p>}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button variant="outline" className="flex-1 h-12" onClick={() => setCurrentStep(2)}>Back</Button>
                <Button 
                  className="flex-1 h-12 text-lg" 
                  onClick={handleSubmit}
                  disabled={loading || !kycFiles.aadhaar.front || !kycFiles.aadhaar.back || !kycFiles.panOrGst}
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}