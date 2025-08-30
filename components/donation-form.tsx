"use client";

import React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Zap, Rocket, Crown, Gift, CreditCard, Star, Trophy } from "lucide-react";
import PaymentForm from "@/components/payment/payment-form";
import PaymentSuccess from "@/components/payment/payment-success";

const donationAmounts = [
	{
		amount: 10000,
		label: "Plant a Seed",
		description: "Provides basic learning materials",
		icon: Gift,
		badge: "Seed Planter",
		color: "bg-emerald-100 text-emerald-800",
		range: { min: 1000, max: 19999 },
	},
	{
		amount: 20000,
		label: "Start a Spark",
		description: "Provides basic coding materials for one student",
		icon: Zap,
		badge: "Spark Starter",
		color: "bg-yellow-100 text-yellow-800",
		range: { min: 20000, max: 49999 },
	},
	{
		amount: 50000,
		label: "Empower a Dream",
		description: "Funds one week of intensive training",
		icon: Heart,
		badge: "Dream Builder",
		color: "bg-pink-100 text-pink-800",
		range: { min: 50000, max: 99999 },
	},
	{
		amount: 100000,
		label: "Fuel Innovation",
		description: "Funds two weeks of intensive training",
		icon: Rocket,
		badge: "Training Catalyst",
		color: "bg-blue-100 text-blue-800",
		range: { min: 100000, max: 199999 },
	},
	{
		amount: 200000,
		label: "Fuel Innovation",
		description: "Provides comprehensive coding bootcamp access",
		icon: Rocket,
		badge: "Innovation Catalyst",
		color: "bg-blue-100 text-blue-800",
		range: { min: 200000, max: 499999 },
	},
	{
		amount: 500000,
		label: "Build a Future",
		description: "Provides laptop and full program access for one student",
		icon: Crown,
		badge: "Future Architect",
		color: "bg-purple-100 text-purple-800",
		range: { min: 500000, max: 999999 },
	},
	{
		amount: 1000000,
		label: "Transform Lives",
		description: "Sponsors multiple students with equipment",
		icon: Star,
		badge: "Life Transformer",
		color: "bg-green-100 text-green-800",
		range: { min: 1000000, max: 4999999 },
	},
];

const hiddenTiers = [
	{
		amount: 5000000,
		label: "Champion Change",
		description: "Funds an entire program cohort",
		icon: Trophy,
		badge: "Change Champion",
		color: "bg-orange-100 text-orange-800",
		range: { min: 5000000, max: 9999999 },
	},
	{
		amount: 10000000,
		label: "Legacy Builder",
		description: "Establishes a complete learning center with equipment and staff",
		icon: Trophy,
		badge: "Legacy Builder",
		color: "bg-red-100 text-red-800",
		range: { min: 10000000, max: 99999999 },
	},
	{
		amount: 100000000,
		label: "Visionary Patron",
		description: "Creates a comprehensive and conducive tech education hub for students to learn and collaborate while growing",
		icon: Crown,
		badge: "Visionary Patron",
		color: "bg-indigo-100 text-indigo-800",
		range: { min: 100000000, max: Number.POSITIVE_INFINITY },
	},
];

const allTiers = [...donationAmounts, ...hiddenTiers];

export default function DonationForm() {
	const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
	const [customAmount, setCustomAmount] = useState("");
	const [donationType, setDonationType] = useState("one-time");
	const [isPledge, setIsPledge] = useState(false);
	const [pledgeDate, setPledgeDate] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [donorInfo, setDonorInfo] = useState({
		name: "",
		email: "",
		phone: "",
		anonymous: false,
	});
	const [currentStep, setCurrentStep] = useState<"form" | "payment" | "success">("form");
	const [paymentData, setPaymentData] = useState<any>(null);
	const [dropdownValue, setDropdownValue] = useState<string>("");
	const customAmountDesktopRef = useRef<HTMLInputElement>(null);
	const customAmountMobileRef = useRef<HTMLInputElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const getDonationTier = (amount: number) => {
		return allTiers.find((tier) => amount >= tier.range.min && amount <= tier.range.max) || allTiers[0];
	};

	const handleDonationTypeChange = (newType: string) => {
		setDonationType(newType);
		if (newType !== "quantity") {
			setQuantity(1);
		}
	};

	const handleCardSelect = (amount: number) => {
		if (amount === -1) {
			setSelectedAmount(null);
			setTimeout(() => {
				customAmountDesktopRef.current?.focus();
			}, 100);
		} else {
			setSelectedAmount(amount);
			setCustomAmount("");
		}
	};

	const handleDropdownSelect = (value: string) => {
		setDropdownValue(value);
		if (value === "other") {
			setSelectedAmount(null);
			setTimeout(() => {
				customAmountMobileRef.current?.focus();
			}, 100);
		} else {
			const amount = Number.parseInt(value);
			setSelectedAmount(amount);
			setCustomAmount("");
		}
	};

	const handleCustomAmount = (value: string) => {
		setCustomAmount(value);
		setSelectedAmount(null);
		if (value && value !== "") {
			setDropdownValue("other");
		} else {
			setDropdownValue("");
		}
	};

	const handleProceedToPayment = async () => {
		if (finalAmount > 0 && donorInfo.name && donorInfo.email) {
			setIsSubmitting(true);

			try {
				if (isPledge) {
					if (!pledgeDate) {
						alert("Please select a pledge date");
						setIsSubmitting(false);
						return;
					}

					const pledgeData = {
						amount: baseAmount,
						donorName: donorInfo.name,
						donorEmail: donorInfo.email,
						donorPhone: donorInfo.phone,
						donationType,
						quantity,
						pledgeDate,
						message: "",
						isAnonymous: donorInfo.anonymous,
					};

					const response = await fetch("/api/pledges", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(pledgeData),
					});

					if (!response.ok) {
						throw new Error("Failed to create pledge record");
					}

					const result = await response.json();
					console.log("[v0] Pledge record created:", result.pledge);

					alert("Thank you for your pledge! We'll send you a reminder closer to your pledge date.");
					handleCloseSuccess();
					return;
				}

				const donationData = {
					amount: baseAmount,
					donorName: donorInfo.name,
					donorEmail: donorInfo.email,
					donorPhone: donorInfo.phone,
					donationType,
					quantity,
					message: "",
					isAnonymous: donorInfo.anonymous,
					paymentMethod: "pending",
					payment_status: "pending",
				};

				const response = await fetch("/api/donations", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(donationData),
				});

				if (!response.ok) {
					throw new Error("Failed to create donation record");
				}

				const result = await response.json();
				console.log("[v0] Donation record created:", result.donation);

				window.location.href = `/payment-confirmation?donationId=${result.donation.id}`;
			} catch (error) {
				console.error("[v0] Error creating donation:", error);
				alert("There was an issue saving your donation. Please try again.");
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const handlePaymentSuccess = async (data: any) => {
		try {
			if (paymentData?.donationId) {
				const response = await fetch(`/api/donations/${paymentData.donationId}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						status: "completed",
						paymentMethod: data.paymentMethod || "card",
						transactionId: data.transactionId,
					}),
				});

				if (response.ok) {
					console.log("[v0] Donation status updated to completed");
				}
			}
		} catch (error) {
			console.error("[v0] Error updating donation status:", error);
		}

		setPaymentData({ ...paymentData, ...data });
		setCurrentStep("success");
	};

	const handleBackToForm = () => {
		setCurrentStep("form");
	};

	const handleCloseSuccess = () => {
		setCurrentStep("form");
		setSelectedAmount(null);
		setCustomAmount("");
		setIsPledge(false);
		setPledgeDate("");
		setDonorInfo({ name: "", email: "", phone: "", anonymous: false });
		setPaymentData(null);
	};

	const baseAmount = selectedAmount || Number.parseInt(customAmount) || 0;
	const finalAmount = baseAmount * quantity;
	const baseTier = baseAmount > 0 ? getDonationTier(baseAmount) : null;
	const finalTier = finalAmount > 0 ? getDonationTier(finalAmount) : null;

	if (currentStep === "success" && paymentData) {
		return <PaymentSuccess paymentData={paymentData} onClose={handleCloseSuccess} />;
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
		);
	}

	return (
		<div className="max-w-6xl mx-auto">
			<div className="text-center mb-6 sm:mb-8">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Choose Your Impact Level</h2>
				<p className="text-base sm:text-lg text-muted-foreground px-4 sm:px-0">
					Every donation creates opportunities and transforms lives through technology education
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
				<div className="lg:col-span-2">
					<div className="hidden md:block">
						<Card className="border-border bg-card">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-foreground text-xl">
									<Gift className="h-5 w-5 text-primary" />
									Select Donation Amount
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="relative">
									<div className="grid grid-cols-2 gap-3">
										{donationAmounts.map((donation) => {
											const Icon = donation.icon;
											const isSelected = selectedAmount === donation.amount;
											return (
												<Card
													key={donation.amount}
													className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
														isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50"
													}`}
													onClick={() => handleCardSelect(donation.amount)}>
													<CardContent className="p-3">
														<div className="flex items-start gap-3">
															<div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
																<Icon className="h-4 w-4" />
															</div>
															<div className="flex-1 min-w-0">
																<div className="flex items-center justify-between mb-1">
																	<h3 className="font-semibold text-sm text-foreground truncate">{donation.label}</h3>
																	<Badge className={`${donation.color} text-xs ml-2 flex-shrink-0`}>{donation.badge}</Badge>
																</div>
																<div className="text-lg font-bold text-primary mb-1">₦{donation.amount.toLocaleString()}</div>
																<p className="text-xs text-muted-foreground leading-tight">{donation.description}</p>
															</div>
														</div>
													</CardContent>
												</Card>
											);
										})}

										<Card
											className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
												selectedAmount === null && customAmount
													? "border-primary bg-primary/5 shadow-md"
													: "border-border hover:border-primary/50"
											}`}
											onClick={() => handleCardSelect(-1)}>
											<CardContent className="p-3">
												<div className="flex items-start gap-3">
													<div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
														<Gift className="h-4 w-4" />
													</div>
													<div className="flex-1">
														<div className="flex items-center justify-between mb-1">
															<h3 className="font-semibold text-sm text-foreground">Other</h3>
															<Badge className="bg-gray-100 text-gray-800 text-xs">Custom Amount</Badge>
														</div>
														<p className="text-xs text-muted-foreground">Enter your own amount</p>
													</div>
												</div>
											</CardContent>
										</Card>
									</div>
									<div className="absolute top-0 left-1/2 transform -translate-x-px h-full w-px bg-border"></div>
								</div>

								<div className="space-y-4 pt-4 border-t border-border">
									<div className="space-y-3">
										<Label htmlFor="custom-amount-desktop" className="text-foreground font-semibold">
											Custom Amount (if "Other" selected)
										</Label>
										<div className="relative">
											<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₦</span>
											<Input
												ref={customAmountDesktopRef}
												id="custom-amount-desktop"
												type="number"
												placeholder="Enter custom amount"
												value={customAmount}
												onChange={(e) => handleCustomAmount(e.target.value)}
												className="pl-8 text-lg"
												min="1000"
											/>
										</div>
									</div>
									<div className="space-y-3">
										<Label className="text-foreground font-semibold">Donation Type</Label>
										<RadioGroup value={donationType} onValueChange={handleDonationTypeChange} className="flex gap-6">
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="one-time" id="one-time-desktop" />
												<Label htmlFor="one-time-desktop" className="cursor-pointer">
													One-time
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="monthly" id="monthly-desktop" />
												<Label htmlFor="monthly-desktop" className="cursor-pointer">
													Monthly
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="quantity" id="quantity-desktop" />
												<Label htmlFor="quantity-desktop" className="cursor-pointer">
													Multiple (Quantity)
												</Label>
											</div>
										</RadioGroup>
										{donationType === "quantity" && (
											<div className="space-y-2">
												<Label htmlFor="quantity-input-desktop" className="text-sm text-muted-foreground">
													How many donations of this amount?
												</Label>
												<Input
													id="quantity-input-desktop"
													type="number"
													min="1"
													max="100"
													value={quantity}
													onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
													className="w-24"
												/>
											</div>
										)}
									</div>
									<div className="space-y-3 pt-4 border-t border-border">
										<div className="flex items-center space-x-2">
											<input
												type="checkbox"
												id="pledge-desktop"
												checked={isPledge}
												onChange={(e) => setIsPledge(e.target.checked)}
												className="rounded border-border"
											/>
											<Label htmlFor="pledge-desktop" className="cursor-pointer font-semibold text-foreground">
												Make this a pledge (donate later)
											</Label>
										</div>
										{isPledge && (
											<div className="space-y-2 pl-6">
												<Label htmlFor="pledge-date-desktop" className="text-sm text-muted-foreground">
													When do you plan to donate?
												</Label>
												<Input
													id="pledge-date-desktop"
													type="date"
													value={pledgeDate}
													onChange={(e) => setPledgeDate(e.target.value)}
													min={new Date().toISOString().split("T")[0]}
													className="w-48"
												/>
												<p className="text-xs text-muted-foreground">We'll send you a reminder closer to your pledge date.</p>
											</div>
										)}
									</div>
									<div className="space-y-4">
										<h3 className="font-serif font-bold text-foreground text-lg">Donor Information</h3>
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="donor-name-desktop">Full Name</Label>
												<Input
													id="donor-name-desktop"
													value={donorInfo.name}
													onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
													placeholder="Enter your name"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="donor-email-desktop">Email Address</Label>
												<Input
													id="donor-email-desktop"
													type="email"
													value={donorInfo.email}
													onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
													placeholder="Enter your email"
												/>
											</div>
										</div>
										<div className="space-y-2">
											<Label htmlFor="donor-phone-desktop">Phone Number (Optional)</Label>
											<Input
												id="donor-phone-desktop"
												type="tel"
												value={donorInfo.phone}
												onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
												placeholder="Enter your phone number"
											/>
										</div>
										<div className="flex items-center space-x-2">
											<input
												type="checkbox"
												id="anonymous-desktop"
												checked={donorInfo.anonymous}
												onChange={(e) => setDonorInfo({ ...donorInfo, anonymous: e.target.checked })}
												className="rounded border-border"
											/>
											<Label htmlFor="anonymous-desktop" className="cursor-pointer text-sm">
												Make this donation anonymous
											</Label>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="md:hidden space-y-6">
						<Card className="border-border bg-card">
							<CardHeader>
								<CardTitle className="text-foreground text-lg">Select Donation Amount</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<Label className="text-foreground font-semibold">Choose Amount</Label>
								<Select value={dropdownValue} onValueChange={handleDropdownSelect}>
									<SelectTrigger className="w-full text-base">
										<SelectValue placeholder="Select donation amount" />
									</SelectTrigger>
									<SelectContent>
										{donationAmounts.map((donation) => (
											<SelectItem key={donation.amount} value={donation.amount.toString()}>
												₦{donation.amount.toLocaleString()} - {donation.badge}
											</SelectItem>
										))}
										<SelectItem value="other">Other - Custom Amount</SelectItem>
									</SelectContent>
								</Select>
								<Label htmlFor="custom-amount" className="text-foreground font-semibold">
									Or enter a custom amount
								</Label>
								<div className="relative">
									<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₦</span>
									<Input
										ref={customAmountMobileRef}
										id="custom-amount"
										type="number"
										placeholder="Enter amount"
										value={customAmount}
										onChange={(e) => handleCustomAmount(e.target.value)}
										className="pl-8 text-lg"
										min="1000"
									/>
								</div>
							</CardContent>
						</Card>

						<Card className="border-border bg-card">
							<CardHeader>
								<CardTitle className="text-foreground text-lg sm:text-xl">Donation Details</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 sm:space-y-6">
								<div className="space-y-3">
									<Label className="text-foreground font-semibold">Donation Type</Label>
									<RadioGroup value={donationType} onValueChange={handleDonationTypeChange} className="flex flex-col gap-3">
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="one-time" id="one-time-mobile" />
											<Label htmlFor="one-time-mobile" className="cursor-pointer">
												One-time
											</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="monthly" id="monthly-mobile" />
											<Label htmlFor="monthly-mobile" className="cursor-pointer">
												Monthly
											</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="quantity" id="quantity-mobile" />
											<Label htmlFor="quantity-mobile" className="cursor-pointer">
												Multiple (Quantity)
											</Label>
										</div>
									</RadioGroup>
									{donationType === "quantity" && (
										<div className="space-y-2">
											<Label htmlFor="quantity-input-mobile" className="text-sm text-muted-foreground">
												How many donations of this amount?
											</Label>
											<Input
												id="quantity-input-mobile"
												type="number"
												min="1"
												max="100"
												value={quantity}
												onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
												className="w-24"
											/>
										</div>
									)}
								</div>
								<div className="space-y-3 pt-4 border-t border-border">
									<div className="flex items-center space-x-2">
										<input
											type="checkbox"
											id="pledge-mobile"
											checked={isPledge}
											onChange={(e) => setIsPledge(e.target.checked)}
											className="rounded border-border"
										/>
										<Label htmlFor="pledge-mobile" className="cursor-pointer font-semibold text-foreground">
											Make this a pledge (donate later)
										</Label>
									</div>
									{isPledge && (
										<div className="space-y-2 pl-6">
											<Label htmlFor="pledge-date-mobile" className="text-sm text-muted-foreground">
												When do you plan to donate?
											</Label>
											<Input
												id="pledge-date-mobile"
												type="date"
												value={pledgeDate}
												onChange={(e) => setPledgeDate(e.target.value)}
												min={new Date().toISOString().split("T")[0]}
												className="w-full"
											/>
											<p className="text-xs text-muted-foreground">We'll send you a reminder closer to your pledge date.</p>
										</div>
									)}
								</div>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="donor-name-mobile">Full Name</Label>
										<Input
											id="donor-name-mobile"
											value={donorInfo.name}
											onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
											placeholder="Enter your name"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="donor-email-mobile">Email Address</Label>
										<Input
											id="donor-email-mobile"
											type="email"
											value={donorInfo.email}
											onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
											placeholder="Enter your email"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="donor-phone-mobile">Phone Number (Optional)</Label>
										<Input
											id="donor-phone-mobile"
											type="tel"
											value={donorInfo.phone}
											onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
											placeholder="Enter your phone number"
										/>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="anonymous-mobile"
										checked={donorInfo.anonymous}
										onChange={(e) => setDonorInfo({ ...donorInfo, anonymous: e.target.checked })}
										className="rounded border-border"
									/>
									<Label htmlFor="anonymous-mobile" className="cursor-pointer text-sm">
										Make this donation anonymous
									</Label>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				<div className="lg:col-span-1">
					<div className="lg:sticky lg:top-20 lg:self-start">
						<Card className="border-border bg-card">
							<CardHeader>
								<CardTitle className="text-foreground text-lg sm:text-xl">Donation Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 sm:space-y-6">
								{finalAmount > 0 && baseTier && (
									<>
										<div className="text-center p-4 sm:p-6 bg-primary/5 rounded-lg border border-primary/20">
											<div className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-2">₦{finalAmount.toLocaleString()}</div>
											<div className="text-xs sm:text-sm text-muted-foreground mb-3">
												{donationType === "monthly"
													? "Monthly donation"
													: donationType === "quantity"
													? `${quantity}x donation`
													: "One-time donation"}
											</div>
											{donationType === "quantity" && quantity > 1 ? (
												<Badge className={`${baseTier.color} text-xs`}>
													{quantity}x {baseTier.badge}
												</Badge>
											) : (
												<Badge className={`${finalTier?.color || baseTier.color} text-xs`}>{finalTier?.badge || baseTier.badge}</Badge>
											)}
										</div>
										<div className="space-y-4">
											<div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
												<div className="p-2 rounded-full bg-primary/10 text-primary">
													{React.createElement(baseTier.icon, { className: "h-5 w-5" })}
												</div>
												<div>
													<h4 className="font-semibold text-foreground text-sm sm:text-base">
														{donationType === "quantity" && quantity > 1
															? `${quantity}x ${baseTier.label}`
															: finalTier?.label || baseTier.label}
													</h4>
													<p className="text-xs sm:text-sm text-muted-foreground">
														{donationType === "quantity" && quantity > 1
															? baseTier.description
															: finalTier?.description || baseTier.description}
													</p>
												</div>
											</div>
											<div className="space-y-2">
												<h4 className="font-semibold text-foreground text-sm sm:text-base">Your Impact:</h4>
												<p className="text-xs sm:text-sm text-muted-foreground">
													{donationType === "quantity" && quantity > 1
														? `${baseTier.description} (${quantity} times)`
														: finalTier?.description || baseTier.description}
												</p>
											</div>
										</div>
										<Button
											onClick={handleProceedToPayment}
											className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-sm sm:text-base"
											size="lg"
											disabled={!donorInfo.name || !donorInfo.email || isSubmitting}>
											<CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
											{isSubmitting ? "Processing..." : isPledge ? "Make Pledge" : "Proceed to Payment"}
										</Button>
										{/* <div>
											<p className="text-xs">Please make your transfers to this account</p>
											<div className="w-full flex flex-col p-4 space-y-2 bg-[#efeef3] hover:bg-primary/90 text-black-foreground font-semibold py-3 text-sm sm:text-base rounded-lg">
												<div className="flex justify-between">
													<p>Account number:</p>
													<p>1308190088</p>
												</div>
												<div className="flex justify-between">
													<p>Account name:</p>
													<p>Mauben Limited</p>
												</div>
												<div className="flex justify-between">
													<p>Bank:</p>
													<p>Providus Bank</p>
												</div>
											</div>
										</div> */}
										<div className="text-xs text-muted-foreground text-center">
											{isPledge
												? "Your pledge will be saved securely. We'll remind you when it's time to donate."
												: "Secure payment powered by multiple providers. Your information is protected."}
										</div>
									</>
								)}
								{finalAmount === 0 && (
									<div className="text-center p-4 sm:p-6 text-muted-foreground">
										<Heart className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 text-muted-foreground/50" />
										<p className="text-sm sm:text-base">Select an amount to see your impact</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
