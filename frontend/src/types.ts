export interface User {
	id: number;
	name: string;
	email: string;
}

export interface Category {
	id: number;
	name: string;
	color: string;
	desc: string | null;
}

export interface NotificationRules {
	frequency: string;
	notify_before: number;
	time_unit: string;
}

export interface Document {
	id: number;
	name: string;
	issuing_authority: string;
	date_issued: Date;
	date_expired: Date;
	category: Category;
	attachment: string;
	created_by: User;
	updated_by: User;
	last_sent_email?: Date;
	desc?: string;
	formatted_date_issued?: string;
	formatted_date_expired?: string;
	notification_rules?: NotificationRules;
}
