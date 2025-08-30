export interface DonationRequest {
	amount: number;
	donorName: string;
	donorEmail: string;
	donorPhone?: string;
	donationType: "one-time" | "monthly" | "quantity";
	quantity?: number;
	message?: string;
	isAnonymous?: boolean;
	paymentMethod?: string;
}

export interface PledgeRequest {
	amount: number;
	donorName: string;
	donorEmail: string;
	donorPhone?: string;
	donationType: "one-time" | "monthly" | "quantity";
	quantity?: number;
	pledgeDate: string;
	message?: string;
	isAnonymous?: boolean;
}

export interface PaymentRequest {
	amount: number;
	currency: string;
	paymentMethod: string;
	donor: {
		name: string;
		email: string;
		anonymous: boolean;
	};
	donationType: "one-time" | "monthly";
}

export interface PaymentResult {
	status: "success" | "pending" | "failed";
	transactionId: string;
	provider: string;
}

export interface WebhookPayload {
	event?: string;
	type?: string;
	data: PaymentData;
}

export interface PaymentData {
	id: string;
	amount: number;
	currency: string;
	status: string;
	customer: {
		email: string;
		name: string;
	};
	metadata?: Record<string, any>;
}

export interface DonationRecord {
	id: string;
	donor_name: string;
	donor_email: string;
	donor_phone?: string;
	amount: number;
	quantity: number;
	donation_type: string;
	tier_name: string;
	tier_badge: string;
	tier_description: string;
	payment_method?: string;
	payment_status: string;
	transaction_id?: string;
	message?: string;
	is_anonymous: boolean;
	created_at: string;
	updated_at: string;
}

export interface PledgeRecord {
	id: string;
	donor_name: string;
	donor_email: string;
	donor_phone?: string;
	amount: number;
	quantity: number;
	donation_type: string;
	tier_name: string;
	tier_badge: string;
	tier_description: string;
	pledge_date: string;
	message?: string;
	is_anonymous: boolean;
	status: "active" | "fulfilled" | "cancelled";
	created_at: string;
	updated_at: string;
}
