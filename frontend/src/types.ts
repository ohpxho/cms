export interface User {}

export interface Category {
	id: number;
	name: string;
	color: string;
	desc: string;
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
}
