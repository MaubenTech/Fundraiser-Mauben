"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Clock, ArrowLeft, Building2, X } from "lucide-react";

interface DonationData {
	id: string;
	amount: number;
	tierBadge: string;
	donor_name: string;
	donor_email: string;
	quantity: number;
	donation_type: string;
}

export default function PaymentConfirmationPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [donationData, setDonationData] = useState<DonationData | null>(null);
	const [isConfirming, setIsConfirming] = useState(false);
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [copied, setCopied] = useState(false);

	const bankDetails = {
		accountNumber: "1308190088",
		bankName: "Providus Bank",
		accountName: "Mauben Limited",
	};

	useEffect(() => {
		const donationId = searchParams.get("donationId");
		if (donationId) {
			fetchDonationData(donationId);
		} else {
			router.push("/");
		}
	}, [searchParams, router]);

	const fetchDonationData = async (donationId: string) => {
		try {
			const response = await fetch(`/donations/api/donations/${donationId}`);
			if (response.ok) {
				const data = await response.json();
				setDonationData(data.donation);
			} else {
				router.push("/");
			}
		} catch (error) {
			console.error("[v0] Error fetching donation data:", error);
			router.push("/");
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleCancelClick = () => {
		router.push("/");
	};

	const handlePaymentMade = async () => {
		if (!donationData) return;

		setIsConfirming(true);

		try {
			// Update donation status to unconfirmed
			const response = await fetch(`/donations/api/donations/${donationData.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					payment_status: "pending",
					payment_method: "bank_transfer",
				}),
			});

			if (response.ok) {
				setIsConfirmed(true);
				// Redirect to homepage after 3 seconds
				// setTimeout(() => {
				// 	router.push("/");
				// }, 10000);
				// Redirect to homepage after user clicks cancel
			}
		} catch (error) {
			console.error("[v0] Error updating payment status:", error);
		} finally {
			setIsConfirming(false);
		}
	};

	if (!donationData) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading donation details...</p>
				</div>
			</div>
		);
	}

	if (isConfirmed) {
		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				<Card className="max-w-md w-full text-center">
					<CardContent className="p-8 relative">
						<button
							onClick={handleCancelClick}
							className="absolute pr-8 right-0 top-0 rounded-full transition duration-200 ease-linear hover:text-black/30 self-end">
							<X />
						</button>
						<CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-foreground mb-4">Payment Confirmation Received</h2>
						<p className="text-muted-foreground mb-6">
							Thank you! Your payment is being confirmed by our agents. You'll receive an email confirmation once verified.
						</p>
						<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
							<Clock className="h-4 w-4" />
							<span>Click the cancel button to redirect to homepage...</span>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background p-4">
			<div className="max-w-4xl mx-auto">
				<Button onClick={() => router.push("/")} variant="outline" className="mb-6">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to Homepage
				</Button>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Donation Summary */}
					<Card>
						<CardHeader>
							<CardTitle className="text-2xl font-bold text-foreground">Donation Summary</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
								<div className="text-3xl font-bold text-primary mb-2">₦{(donationData.amount * donationData.quantity).toLocaleString()}</div>
								<Badge className="bg-primary/10 text-primary">
									{donationData.quantity > 1 ? `${donationData.quantity}x ` : ""}
									{donationData.tierBadge}
								</Badge>
							</div>

							<div className="space-y-4">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Donor Name:</span>
									<span className="font-semibold">{donationData.donor_name}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Email:</span>
									<span className="font-semibold">{donationData.donor_email}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Donation Type:</span>
									<span className="font-semibold capitalize">{(donationData.donation_type ?? "").replace("-", " ")}</span>
									{/* <span className="font-semibold capitalize">{JSON.stringify(donationData)}</span> */}
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Amount per donation:</span>
									<span className="font-semibold">₦{donationData.amount.toLocaleString()}</span>
								</div>
								{donationData.quantity > 1 && (
									<div className="flex justify-between">
										<span className="text-muted-foreground">Quantity:</span>
										<span className="font-semibold">{donationData.quantity}</span>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Bank Transfer Details */}
					<Card>
						<CardHeader>
							<CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
								<Building2 className="h-6 w-6 text-primary" />
								Bank Transfer Details
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="bg-muted/30 p-6 rounded-lg space-y-4">
								<div className="space-y-2">
									<label className="text-sm font-semibold text-muted-foreground">Account Number</label>
									<div className="flex items-center justify-between bg-background p-3 rounded border">
										<span className="font-mono text-lg font-bold">{bankDetails.accountNumber}</span>
										<Button size="sm" variant="outline" onClick={() => copyToClipboard(bankDetails.accountNumber)}>
											<Copy className="h-4 w-4" />
										</Button>
									</div>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-muted-foreground">Bank Name</label>
									<div className="flex items-center justify-between bg-background p-3 rounded border">
										<span className="font-semibold">{bankDetails.bankName}</span>
										<Button size="sm" variant="outline" onClick={() => copyToClipboard(bankDetails.bankName)}>
											<Copy className="h-4 w-4" />
										</Button>
									</div>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-muted-foreground">Account Name</label>
									<div className="flex items-center justify-between bg-background p-3 rounded border">
										<span className="font-semibold">{bankDetails.accountName}</span>
										<Button size="sm" variant="outline" onClick={() => copyToClipboard(bankDetails.accountName)}>
											<Copy className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</div>

							{copied && <div className="text-center text-sm text-green-600 font-semibold">✓ Copied to clipboard!</div>}

							<div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
								<h4 className="font-semibold text-blue-900 mb-2">Transfer Instructions:</h4>
								<ul className="text-sm text-blue-800 space-y-1">
									<li>• Transfer exactly ₦{(donationData.amount * donationData.quantity).toLocaleString()}</li>
									<li>• Use your name as the transfer description</li>
									<li>• Keep your transfer receipt for records</li>
									<li>• Click "I've Made Payment" after completing the transfer</li>
								</ul>
							</div>

							<Button
								onClick={handlePaymentMade}
								disabled={isConfirming}
								className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
								size="lg">
								{isConfirming ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Processing...
									</>
								) : (
									<>
										<CheckCircle className="h-5 w-5 mr-2" />
										I've Made Payment
									</>
								)}
							</Button>

							<p className="text-xs text-muted-foreground text-center">
								Our agents will verify your payment within 24 hours and send you a confirmation email.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
