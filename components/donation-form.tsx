"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Heart, Zap, Rocket, Crown, Gift, CreditCard } from "lucide-react"
import PaymentForm from "@/components/payment/payment-form"
import PaymentSuccess from "@/components/payment/payment-success"

const donationAmounts = [
  {
    amount: 5000,
    label: "Start a Spark",
    description: "Provides basic coding materials for one student",
    icon: Zap,
    badge: "Spark Starter",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    amount: 10000,
    label: "Empower a Dream",
    description: "Funds one week of intensive training",
    icon: Heart,
    badge: "Dream Builder",
    color: "bg-pink-100 text-pink-800",
  },
  {
    amount: 25000,
    label: "Fuel Innovation",
    description: "Sponsors a complete course for one student",
    icon: Rocket,
    badge: "Innovation Catalyst",
    color: "bg-blue-100 text-blue-800",
  },
  {
    amount: 50000,
    label: "Build a Future",
    description: "Provides laptop and full program access",
    icon: Crown,
    badge: "Future Architect",
    color: "bg-purple-100 text-purple-800",
  },
]

export default function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [donationType, setDonationType] = useState("one-time")
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    anonymous: false,
  })
  const [currentStep, setCurrentStep] = useState<"form" | "payment" | "success">("form")
  const [paymentData, setPaymentData] = useState<any>(null)

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount("")
  }

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const handleProceedToPayment = () => {
    if (finalAmount > 0 && donorInfo.name && donorInfo.email) {
      setCurrentStep("payment")
    }
  }

  const handlePaymentSuccess = (data: any) => {
    setPaymentData(data)
    setCurrentStep("success")
  }

  const handleBackToForm = () => {
    setCurrentStep("form")
  }

  const handleCloseSuccess = () => {
    setCurrentStep("form")
    // Reset form
    setSelectedAmount(null)
    setCustomAmount("")
    setDonorInfo({ name: "", email: "", anonymous: false })
    setPaymentData(null)
  }

  const finalAmount = selectedAmount || Number.parseInt(customAmount) || 0
  const selectedDonation = donationAmounts.find((d) => d.amount === selectedAmount)

  if (currentStep === "success" && paymentData) {
    return <PaymentSuccess paymentData={paymentData} onClose={handleCloseSuccess} />
  }

  if (currentStep === "payment") {
    return (
      <div className="space-y-6">
        <Button onClick={handleBackToForm} variant="outline" className="mb-4 bg-transparent">
          ← Back to Donation Form
        </Button>
        <PaymentForm
          amount={finalAmount}
          donationType={donationType as "one-time" | "monthly"}
          donorInfo={donorInfo}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Choose Your Impact Level</h2>
        <p className="text-lg text-muted-foreground">
          Every donation creates opportunities and transforms lives through technology education
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Donation Amount Selection */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Gift className="h-5 w-5 text-primary" />
                Select Donation Amount
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pre-set Amounts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {donationAmounts.map((donation) => {
                  const Icon = donation.icon
                  const isSelected = selectedAmount === donation.amount

                  return (
                    <Card
                      key={donation.amount}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                        isSelected
                          ? "ring-2 ring-primary bg-primary/5 border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleAmountSelect(donation.amount)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-serif font-bold text-foreground">{donation.label}</h3>
                              <p className="text-2xl font-bold text-primary">₦{donation.amount.toLocaleString()}</p>
                            </div>
                          </div>
                          <Badge className={donation.color}>{donation.badge}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{donation.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Custom Amount */}
              <div className="space-y-3">
                <Label htmlFor="custom-amount" className="text-foreground font-semibold">
                  Or enter a custom amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₦</span>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    className="pl-8 text-lg"
                    min="1000"
                  />
                </div>
              </div>

              {/* Donation Type */}
              <div className="space-y-3">
                <Label className="text-foreground font-semibold">Donation Type</Label>
                <RadioGroup value={donationType} onValueChange={setDonationType} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-time" id="one-time" />
                    <Label htmlFor="one-time" className="cursor-pointer">
                      One-time
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="cursor-pointer">
                      Monthly
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Donor Information */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-foreground">Donor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="donor-name">Full Name</Label>
                    <Input
                      id="donor-name"
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="donor-email">Email Address</Label>
                    <Input
                      id="donor-email"
                      type="email"
                      value={donorInfo.email}
                      onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={donorInfo.anonymous}
                    onChange={(e) => setDonorInfo({ ...donorInfo, anonymous: e.target.checked })}
                    className="rounded border-border"
                  />
                  <Label htmlFor="anonymous" className="cursor-pointer text-sm">
                    Make this donation anonymous
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donation Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Donation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {finalAmount > 0 && (
                <>
                  <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="text-3xl font-serif font-bold text-primary mb-2">
                      ₦{finalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {donationType === "monthly" ? "Monthly donation" : "One-time donation"}
                    </div>
                    {selectedDonation && (
                      <Badge className={`mt-2 ${selectedDonation.color}`}>{selectedDonation.badge}</Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Your Impact:</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {selectedDonation ? (
                        <p>{selectedDonation.description}</p>
                      ) : (
                        <p>Your generous contribution will directly support our technology education programs</p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleProceedToPayment}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                    size="lg"
                    disabled={!donorInfo.name || !donorInfo.email}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceed to Payment
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    Secure payment powered by multiple providers. Your information is protected.
                  </div>
                </>
              )}

              {finalAmount === 0 && (
                <div className="text-center p-6 text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p>Select an amount to see your impact</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
