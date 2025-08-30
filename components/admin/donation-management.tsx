"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Search, Download, Eye, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";

interface Donation {
	id: string;
	donorName: string;
	donorEmail: string;
	donorPhone?: string;
	amount: number;
	quantity: number;
	donationType: "one-time" | "monthly" | "quantity";
	tierBadge: string;
	message?: string;
	isAnonymous: boolean;
	status: "completed" | "pending" | "failed";
	payment_status?: "pending" | "confirmed" | "failed";
	createdAt: string;
	paymentMethod?: string;
	transactionId?: string;
}

interface DonationStats {
	totalRaised: number;
	totalDonors: number;
	totalDonations: number;
	goalAmount: number;
}

export default function DonationManagement() {
	const [donations, setDonations] = useState<Donation[]>([]);
	const [stats, setStats] = useState<DonationStats>({
		totalRaised: 0,
		totalDonors: 0,
		totalDonations: 0,
		goalAmount: 20000000,
	});
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [newDonation, setNewDonation] = useState({
		donorName: "",
		donorEmail: "",
		donorPhone: "",
		amount: "",
		quantity: 1,
		donationType: "one-time" as "one-time" | "monthly" | "quantity",
		message: "",
		isAnonymous: false,
		paymentMethod: "manual",
		transactionId: "",
	});

	const fetchDonations = async () => {
		try {
			const response = await fetch("/api/admin/donations");
			if (response.ok) {
				const data = await response.json();
				setDonations(data.donations);
			}
		} catch (error) {
			console.error("[v0] Error fetching donations:", error);
		}
	};

	const fetchStats = async () => {
		try {
			const response = await fetch("/api/donations/stats");
			if (response.ok) {
				const data = await response.json();
				setStats(data.stats);
			}
		} catch (error) {
			console.error("[v0] Error fetching stats:", error);
		}
	};

	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true);
			await Promise.all([fetchDonations(), fetchStats()]);
			setIsLoading(false);
		};
		loadData();
	}, []);

	const handleAddDonation = async () => {
		if (!newDonation.donorName || !newDonation.donorEmail || !newDonation.amount) {
			alert("Please fill in all required fields");
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await fetch("/api/admin/donations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...newDonation,
					amount: Number(newDonation.amount),
					status: "completed", // Admin donations are completed by default
				}),
			});

			if (response.ok) {
				await fetchDonations();
				await fetchStats();
				setIsAddDialogOpen(false);
				setNewDonation({
					donorName: "",
					donorEmail: "",
					donorPhone: "",
					amount: "",
					quantity: 1,
					donationType: "one-time",
					message: "",
					isAnonymous: false,
					paymentMethod: "manual",
					transactionId: "",
				});
				alert("Donation added successfully!");
			} else {
				throw new Error("Failed to add donation");
			}
		} catch (error) {
			console.error("[v0] Error adding donation:", error);
			alert("Failed to add donation. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteDonation = async (id: string) => {
		if (!confirm("Are you sure you want to delete this donation?")) return;

		try {
			const response = await fetch(`/api/donations/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				await fetchDonations();
				await fetchStats();
				alert("Donation deleted successfully!");
			} else {
				throw new Error("Failed to delete donation");
			}
		} catch (error) {
			console.error("[v0] Error deleting donation:", error);
			alert("Failed to delete donation. Please try again.");
		}
	};

	const handleConfirmPayment = async (id: string) => {
		if (!confirm("Are you sure you want to confirm this payment?")) return;

		try {
			const response = await fetch(`/api/donations/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					payment_status: "confirmed",
					status: "completed",
				}),
			});

			if (response.ok) {
				await fetchDonations();
				await fetchStats();
				alert("Payment confirmed successfully!");
			} else {
				throw new Error("Failed to confirm payment");
			}
		} catch (error) {
			console.error("[v0] Error confirming payment:", error);
			alert("Failed to confirm payment. Please try again.");
		}
	};

	const handleRejectPayment = async (id: string) => {
		if (!confirm("Are you sure you want to reject this payment?")) return;

		try {
			const response = await fetch(`/api/donations/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					payment_status: "failed",
					status: "failed",
				}),
			});

			if (response.ok) {
				await fetchDonations();
				await fetchStats();
				alert("Payment rejected successfully!");
			} else {
				throw new Error("Failed to reject payment");
			}
		} catch (error) {
			console.error("[v0] Error rejecting payment:", error);
			alert("Failed to reject payment. Please try again.");
		}
	};

	const filteredDonations = donations.filter((donation) => {
		const matchesSearch =
			donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
			donation.id.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus = statusFilter === "all" || donation.status === statusFilter;
		const matchesType = typeFilter === "all" || donation.donationType === typeFilter;

		return matchesSearch && matchesStatus && matchesType;
	});

	const getStatusColor = (status: string, paymentStatus?: string) => {
		if (paymentStatus === "pending") {
			return "bg-orange-100 text-orange-800 border-orange-200";
		}
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800 border-green-200";
			case "pending":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "failed":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getStatusText = (status: string, paymentStatus?: string) => {
		if (paymentStatus === "pending") {
			return "Awaiting Confirmation";
		}
		return status;
	};

	const getBadgeColor = (badge: string) => {
		switch (badge) {
			case "Spark Starter":
				return "bg-yellow-100 text-yellow-800";
			case "Dream Builder":
				return "bg-pink-100 text-pink-800";
			case "Innovation Catalyst":
			case "Training Catalyst":
				return "bg-blue-100 text-blue-800";
			case "Future Architect":
				return "bg-purple-100 text-purple-800";
			case "Life Transformer":
				return "bg-green-100 text-green-800";
			case "Change Champion":
				return "bg-orange-100 text-orange-800";
			case "Legacy Builder":
				return "bg-red-100 text-red-800";
			case "Visionary Patron":
				return "bg-indigo-100 text-indigo-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-muted-foreground">Loading donations...</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card className="border-border bg-card">
					<CardContent className="p-4">
						<div className="text-2xl font-bold text-foreground">₦{stats.totalRaised.toLocaleString()}</div>
						<p className="text-sm text-muted-foreground">Total Donations</p>
					</CardContent>
				</Card>
				<Card className="border-border bg-card">
					<CardContent className="p-4">
						<div className="text-2xl font-bold text-foreground">{stats.totalDonors.toLocaleString()}</div>
						<p className="text-sm text-muted-foreground">Total Donors</p>
					</CardContent>
				</Card>
				<Card className="border-border bg-card">
					<CardContent className="p-4">
						<div className="text-2xl font-bold text-foreground">
							₦{stats.totalDonors > 0 ? Math.round(stats.totalRaised / stats.totalDonors).toLocaleString() : "0"}
						</div>
						<p className="text-sm text-muted-foreground">Average Donation</p>
					</CardContent>
				</Card>
				<Card className="border-border bg-card">
					<CardContent className="p-4">
						<div className="text-2xl font-bold text-foreground">{stats.totalDonations.toLocaleString()}</div>
						<p className="text-sm text-muted-foreground">Total Transactions</p>
					</CardContent>
				</Card>
			</div>

			{filteredDonations.some((d) => d.payment_status === "pending") && (
				<Card className="border-orange-200 bg-orange-50">
					<CardContent className="p-4">
						<div className="flex items-center gap-2 text-orange-800">
							<CheckCircle className="h-5 w-5" />
							<span className="font-semibold">
								{filteredDonations.filter((d) => d.payment_status === "pending").length} payment(s) awaiting confirmation
							</span>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Filters and Search */}
			<Card className="border-border bg-card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-foreground">Donation Management</CardTitle>
						<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
							<DialogTrigger asChild>
								<Button className="flex items-center gap-2">
									<Plus className="h-4 w-4" />
									Add Manual Donation
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-2xl">
								<DialogHeader>
									<DialogTitle>Add Manual Donation</DialogTitle>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="donor-name">Donor Name *</Label>
											<Input
												id="donor-name"
												value={newDonation.donorName}
												onChange={(e) => setNewDonation({ ...newDonation, donorName: e.target.value })}
												placeholder="Enter donor name"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="donor-email">Email Address *</Label>
											<Input
												id="donor-email"
												type="email"
												value={newDonation.donorEmail}
												onChange={(e) => setNewDonation({ ...newDonation, donorEmail: e.target.value })}
												placeholder="Enter email address"
											/>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="donor-phone">Phone Number</Label>
											<Input
												id="donor-phone"
												value={newDonation.donorPhone}
												onChange={(e) => setNewDonation({ ...newDonation, donorPhone: e.target.value })}
												placeholder="Enter phone number"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="amount">Amount (₦) *</Label>
											<Input
												id="amount"
												type="number"
												value={newDonation.amount}
												onChange={(e) => setNewDonation({ ...newDonation, amount: e.target.value })}
												placeholder="Enter amount"
												min="1000"
											/>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label>Donation Type</Label>
											<RadioGroup
												value={newDonation.donationType}
												onValueChange={(value: "one-time" | "monthly" | "quantity") =>
													setNewDonation({ ...newDonation, donationType: value })
												}>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="one-time" id="one-time" />
													<Label htmlFor="one-time">One-time</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="monthly" id="monthly" />
													<Label htmlFor="monthly">Monthly</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="quantity" id="quantity" />
													<Label htmlFor="quantity">Multiple (Quantity)</Label>
												</div>
											</RadioGroup>
										</div>
										{newDonation.donationType === "quantity" && (
											<div className="space-y-2">
												<Label htmlFor="quantity">Quantity</Label>
												<Input
													id="quantity"
													type="number"
													value={newDonation.quantity}
													onChange={(e) => setNewDonation({ ...newDonation, quantity: Math.max(1, Number(e.target.value) || 1) })}
													min="1"
													max="100"
												/>
											</div>
										)}
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="payment-method">Payment Method</Label>
											<Select
												value={newDonation.paymentMethod}
												onValueChange={(value) => setNewDonation({ ...newDonation, paymentMethod: value })}>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="manual">Manual Entry</SelectItem>
													<SelectItem value="cash">Cash</SelectItem>
													<SelectItem value="bank-transfer">Bank Transfer</SelectItem>
													<SelectItem value="check">Check</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-2">
											<Label htmlFor="transaction-id">Transaction ID</Label>
											<Input
												id="transaction-id"
												value={newDonation.transactionId}
												onChange={(e) => setNewDonation({ ...newDonation, transactionId: e.target.value })}
												placeholder="Enter transaction ID"
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="message">Message (Optional)</Label>
										<Textarea
											id="message"
											value={newDonation.message}
											onChange={(e) => setNewDonation({ ...newDonation, message: e.target.value })}
											placeholder="Enter any additional notes"
											rows={3}
										/>
									</div>
									<div className="flex items-center space-x-2">
										<input
											type="checkbox"
											id="anonymous"
											checked={newDonation.isAnonymous}
											onChange={(e) => setNewDonation({ ...newDonation, isAnonymous: e.target.checked })}
										/>
										<Label htmlFor="anonymous">Make this donation anonymous</Label>
									</div>
									<div className="flex justify-end space-x-2 pt-4">
										<Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
											Cancel
										</Button>
										<Button onClick={handleAddDonation} disabled={isSubmitting}>
											{isSubmitting ? "Adding..." : "Add Donation"}
										</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input placeholder="Search donations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full md:w-[180px]">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="failed">Failed</SelectItem>
							</SelectContent>
						</Select>
						<Select value={typeFilter} onValueChange={setTypeFilter}>
							<SelectTrigger className="w-full md:w-[180px]">
								<SelectValue placeholder="Filter by type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="one-time">One-time</SelectItem>
								<SelectItem value="monthly">Monthly</SelectItem>
								<SelectItem value="quantity">Multiple</SelectItem>
							</SelectContent>
						</Select>
						<Button variant="outline" className="flex items-center gap-2 bg-transparent">
							<Download className="h-4 w-4" />
							Export
						</Button>
					</div>

					{/* Donations Table */}
					<div className="rounded-md border border-border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Donation ID</TableHead>
									<TableHead>Donor</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Badge</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredDonations.map((donation) => (
									<TableRow key={donation.id}>
										<TableCell className="font-mono text-sm">{donation.id}</TableCell>
										<TableCell>
											<div>
												<div className="font-semibold text-foreground">{donation.isAnonymous ? "Anonymous" : donation.donorName}</div>
												<div className="text-sm text-muted-foreground">{donation.donorEmail}</div>
											</div>
										</TableCell>
										<TableCell className="font-semibold text-foreground">
											₦{(donation.amount * donation.quantity).toLocaleString()}
											{donation.quantity > 1 && (
												<div className="text-xs text-muted-foreground">
													{donation.quantity}x ₦{donation.amount.toLocaleString()}
												</div>
											)}
										</TableCell>
										<TableCell>
											<Badge variant="outline" className="capitalize">
												{donation.donationType}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge className={getStatusColor(donation.status, donation.payment_status)} variant="outline">
												{getStatusText(donation.status, donation.payment_status)}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge className={getBadgeColor(donation.tierBadge)}>
												{donation.quantity > 1 ? `${donation.quantity}x ${donation.tierBadge}` : donation.tierBadge}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground">{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{donation.payment_status === "pending" && (
													<>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleConfirmPayment(donation.id)}
															className="text-green-600 hover:text-green-700"
															title="Confirm Payment">
															<CheckCircle className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleRejectPayment(donation.id)}
															className="text-red-600 hover:text-red-700"
															title="Reject Payment">
															<XCircle className="h-4 w-4" />
														</Button>
													</>
												)}
												<Button variant="ghost" size="sm">
													<Eye className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleDeleteDonation(donation.id)}
													className="text-red-600 hover:text-red-700">
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{filteredDonations.length === 0 && <div className="text-center py-8 text-muted-foreground">No donations found matching your criteria.</div>}
				</CardContent>
			</Card>
		</div>
	);
}
