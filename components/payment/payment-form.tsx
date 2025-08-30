"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Building2, Shield, Lock } from "lucide-react";

interface PaymentFormProps {
	amount: number;
	donationType: "one-time" | "monthly";
	donorInfo: {
		name: string;
		email: string;
		anonymous: boolean;
	};
	onPaymentSuccess: (paymentData: any) => void;
}

const paymentMethods = [
	{
		id: "card",
		name: "Credit/Debit Card",
		description: "Visa, Mastercard, Verve",
		icon: CreditCard,
		providers: ["Stripe", "Paystack"],
	},
	{
		id: "bank",
		name: "Bank Transfer",
		description: "Direct bank transfer",
		icon: Building2,
		providers: ["Paystack", "Flutterwave"],
	},
	{
		id: "mobile",
		name: "Mobile Money",
		description: "MTN, Airtel, 9mobile",
		icon: Smartphone,
		providers: ["Paystack", "Flutterwave"],
	},
];

export default function PaymentForm({ amount, donationType, donorInfo, onPaymentSuccess }: PaymentFormProps) {
	const [selectedMethod, setSelectedMethod] = useState("card");
	const [isProcessing, setIsProcessing] = useState(false);
	const [cardDetails, setCardDetails] = useState({
		number: "",
		expiry: "",
		cvv: "",
		name: "",
	});

	const handlePayment = async () => {
		setIsProcessing(true);

		try {
			// Simulate payment processing
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Mock successful payment response
			const paymentData = {
				id: `pay_${Date.now()}`,
				amount,
				currency: "NGN",
				status: "success",
				method: selectedMethod,
				paymentMethod: selectedMethod,
				transactionId: `txn_${Date.now()}`,
				donor: donorInfo,
				timestamp: new Date().toISOString(),
			};

			const donationEvent = new CustomEvent("donationCompleted", {
				detail: paymentData,
			});
			window.dispatchEvent(donationEvent);

			onPaymentSuccess(paymentData);
		} catch (error) {
			console.error("Payment failed:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	const formatAmount = (amount: number) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
		}).format(amount);
	};

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			{/* Payment Summary */}
			<Card className="border-border bg-card">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-foreground">
						<Shield className="h-5 w-5 text-primary" />
						Secure Payment
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<span className="text-muted-foreground">Donation Amount:</span>
							<span className="text-2xl font-bold text-primary">{formatAmount(amount)}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-muted-foreground">Type:</span>
							<Badge variant="outline" className="capitalize">
								{donationType}
							</Badge>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-muted-foreground">Donor:</span>
							<span className="text-foreground">{donorInfo.anonymous ? "Anonymous" : donorInfo.name}</span>
						</div>
						<Separator />
						<div className="flex justify-between items-center text-lg font-semibold">
							<span className="text-foreground">Total:</span>
							<span className="text-primary">{formatAmount(amount)}</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Payment Methods */}
			<Card className="border-border bg-card">
				<CardHeader>
					<CardTitle className="text-foreground">Choose Payment Method</CardTitle>
				</CardHeader>
				<CardContent>
					<RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-4">
						{paymentMethods.map((method) => {
							const Icon = method.icon;
							return (
								<div
									key={method.id}
									className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
										selectedMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
									}`}
									onClick={() => setSelectedMethod(method.id)}>
									<RadioGroupItem value={method.id} id={method.id} />
									<div className="flex items-center gap-3 flex-1">
										<div
											className={`p-2 rounded-full ${
												selectedMethod === method.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
											}`}>
											<Icon className="h-5 w-5" />
										</div>
										<div className="flex-1">
											<Label htmlFor={method.id} className="text-foreground font-semibold cursor-pointer">
												{method.name}
											</Label>
											<p className="text-sm text-muted-foreground">{method.description}</p>
										</div>
										<div className="flex gap-1">
											{method.providers.map((provider) => (
												<Badge key={provider} variant="outline" className="text-xs">
													{provider}
												</Badge>
											))}
										</div>
									</div>
								</div>
							);
						})}
					</RadioGroup>
				</CardContent>
			</Card>

			{/* Card Details Form (shown when card is selected) */}
			{selectedMethod === "card" && (
				<Card className="border-border bg-card">
					<CardHeader>
						<CardTitle className="text-foreground">Card Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="card-name" className="text-foreground">
								Cardholder Name
							</Label>
							<Input
								id="card-name"
								placeholder="John Doe"
								value={cardDetails.name}
								onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="card-number" className="text-foreground">
								Card Number
							</Label>
							<Input
								id="card-number"
								placeholder="1234 5678 9012 3456"
								value={cardDetails.number}
								onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
								maxLength={19}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="card-expiry" className="text-foreground">
									Expiry Date
								</Label>
								<Input
									id="card-expiry"
									placeholder="MM/YY"
									value={cardDetails.expiry}
									onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
									maxLength={5}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="card-cvv" className="text-foreground">
									CVV
								</Label>
								<Input
									id="card-cvv"
									placeholder="123"
									value={cardDetails.cvv}
									onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
									maxLength={4}
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Security Notice */}
			<Card className="border-border bg-card">
				<CardContent className="p-4">
					<div className="flex items-center gap-3 text-sm text-muted-foreground">
						<Lock className="h-4 w-4 text-green-600" />
						<span>Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.</span>
					</div>
				</CardContent>
			</Card>

			{/* Payment Button */}
			<Button
				onClick={handlePayment}
				disabled={isProcessing}
				className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 text-lg"
				size="lg">
				{isProcessing ? (
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
						Processing Payment...
					</div>
				) : (
					`Donate ${formatAmount(amount)}`
				)}
			</Button>

			{/* Supported Payment Providers */}
			<div className="text-center space-y-2">
				<p className="text-sm text-muted-foreground">Powered by secure payment providers</p>
				<div className="flex justify-center gap-4">
					{["Stripe", "Paystack", "Flutterwave", "PayPal"].map((provider) => (
						<Badge key={provider} variant="outline" className="text-xs">
							{provider}
						</Badge>
					))}
				</div>
			</div>
		</div>
	);
}
