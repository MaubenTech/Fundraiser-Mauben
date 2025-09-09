"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, ArrowLeft, X, CreditCard } from "lucide-react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

interface DonationData {
	id: string;
	amount: number;
	tier_badge: string;
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

	const getFlutterwaveConfig = () => {
		if (!donationData) {
			return {
				public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_API_KEY_TEST || "",
				tx_ref: `temp_${Date.now()}`,
				amount: 1000,
				currency: "NGN",
				payment_options: "card,mobilemoney,ussd",
				customer: {
					email: "temp@example.com",
					phone_number: "",
					name: "Temp User",
				},
				customizations: {
					title: "MaubenTech Roots Donation",
					description: "Donation",
					logo: "/maubentech-logo.png",
				},
			};
		}

		return {
			public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_API_KEY_LIVE || "",
			tx_ref: `donation_${donationData.id}_${Date.now()}`,
			amount: donationData.amount * donationData.quantity,
			currency: "NGN",
			payment_options: "card,mobilemoney,ussd",
			customer: {
				email: donationData.donor_email,
				phone_number: "",
				name: donationData.donor_name,
			},
			customizations: {
				title: "MaubenTech Roots Donation",
				description: `${donationData.tier_badge} donation`,
				logo: "/maubentech-logo.png",
			},
		};
	};

	const flutterwavePayment = useFlutterwave(getFlutterwaveConfig());

	const bankDetails = {
		accountNumber: "1308190088",
		bankName: "Providus Bank",
		accountName: "Mauben Limited",
	};

	useEffect(() => {
		const donationId = searchParams.get("donationId");
		console.log("[v0] URL search params:", searchParams.toString());
		console.log("[v0] Donation ID from params:", donationId);

		if (donationId) {
			fetchDonationData(donationId);
		} else {
			console.error("[v0] No donationId found in URL parameters");
			// Instead of immediately redirecting, show an error message
			alert("No donation ID found. Please try creating your donation again.");
			router.push("/");
		}
	}, [searchParams, router]);

	const fetchDonationData = async (donationId: string) => {
		console.log("[v0] Fetching donation data for ID:", donationId);
		try {
			const response = await fetch(`/donations/api/donations/${donationId}`);
			console.log("[v0] API response status:", response.status);

			if (response.ok) {
				const data = await response.json();
				console.log("[v0] API response data:", data);
				setDonationData(data.donation);
				console.log("[v0] Donation data loaded:", data.donation);
			} else {
				const errorText = await response.text();
				console.error("[v0] Failed to fetch donation data:", response.status, errorText);
				alert("Failed to load donation details. Please try again.");
				router.push("/");
			}
		} catch (error) {
			console.error("[v0] Error fetching donation data:", error);
			alert("Error loading donation details. Please check your connection and try again.");
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

	const handlePayNow = () => {
		console.log("Pay Now clicked");
		console.log("Paying now");

		if (!donationData) {
			console.error("No donation data available");
			return;
		}

		console.log("Donation Data present");

		flutterwavePayment({
			callback: (response) => {
				console.log("Flutterwave payment response:", response);
				if (response.status === "completed") {
					// Update donation status to confirmed
					updatePaymentStatus(response.status, "flutterwave", response.transaction_id.toString());
				} else {
					console.error("[v0] Payment failed:", response);
				}
				closePaymentModal();
			},
			onClose: () => {
				console.log("Payment modal closed");
			},
		});
	};

	const updatePaymentStatus = async (status: string, method: string, transactionId?: string) => {
		if (!donationData) return;

		setIsConfirming(true);

		try {
			const response = await fetch(`/donations/api/donations/${donationData.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					payment_status: status,
					payment_method: method,
					transaction_id: transactionId,
				}),
			});

			if (response.ok) {
				setIsConfirmed(true);
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
									{donationData.tier_badge}
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

					<Card>
						<CardHeader>
							<CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
								<CreditCard className="h-6 w-6 text-primary" />
								Payment Instructions
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
								<ul className="text-sm text-blue-800 space-y-1">
									<li>• Use your name as transfer description</li>
									<li>• Click on the Pay Now button below to proceed</li>
								</ul>
							</div>

							<Button
								onClick={handlePayNow}
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
										<CreditCard className="h-5 w-5 mr-2" />
										Pay Now
									</>
								)}
							</Button>

							<p className="text-xs text-muted-foreground text-center">
								Secure payment powered by Flutterwave. Your donation will be processed immediately.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
