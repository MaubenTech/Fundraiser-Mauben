"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Share2, Heart } from "lucide-react"

interface PaymentSuccessProps {
  paymentData: {
    id: string
    amount: number
    currency: string
    status: string
    method: string
    donor: {
      name: string
      email: string
      anonymous: boolean
    }
    timestamp: string
  }
  onClose: () => void
}

export default function PaymentSuccess({ paymentData, onClose }: PaymentSuccessProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const handleDownloadReceipt = () => {
    // Generate and download receipt
    console.log("Downloading receipt for:", paymentData.id)
  }

  const handleShare = () => {
    // Share donation on social media
    const shareText = `I just donated ${formatAmount(paymentData.amount)} to TechForGood! Join me in transforming lives through technology education. #TechForGood #Donation`

    if (navigator.share) {
      navigator.share({
        title: "I made a donation!",
        text: shareText,
        url: window.location.origin,
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-border bg-card">
        <CardContent className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-bold text-foreground">Thank You!</h2>
            <p className="text-lg text-muted-foreground">Your generous donation has been processed successfully</p>
          </div>

          {/* Donation Details */}
          <div className="bg-muted/30 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Donation Amount:</span>
              <span className="text-2xl font-bold text-primary">{formatAmount(paymentData.amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="font-mono text-sm text-foreground">{paymentData.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment Method:</span>
              <Badge variant="outline" className="capitalize">
                {paymentData.method}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date:</span>
              <span className="text-foreground">
                {new Date(paymentData.timestamp).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Impact Message */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-serif font-bold text-foreground">Your Impact</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your donation of {formatAmount(paymentData.amount)} will directly support our technology education
              programs, helping to provide coding bootcamps, digital literacy training, and career mentorship to
              underserved communities.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share Your Impact
            </Button>
          </div>

          {/* Email Confirmation */}
          <div className="text-sm text-muted-foreground">
            A confirmation email has been sent to{" "}
            <span className="font-semibold text-foreground">{paymentData.donor.email}</span>
          </div>

          {/* Close Button */}
          <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Continue to Website
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
