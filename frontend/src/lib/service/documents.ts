import {
	getDateDiff,
	convertMsToDays,
	getNoOfYearsfromMs,
	getNoOfDaysfromMs,
	getNoOfMonthsfromMs,
	getNoOfHoursfromMs,
} from "../date";
import { Status } from "@/enums";

export function getStatusOfDocumentByEXpiration(expiration: Date) {
	const now = new Date();
	const exp = new Date(expiration);
	const diff = getDateDiff(exp, now);
	const day = convertMsToDays(diff);

	if (day <= 0) {
		return Status.EXPIRED;
	} else if (day <= 7) {
		return Status.EXPIRINGSOON;
	} else {
		return Status.ACTIVE;
	}
}

export function getDueOnByExpiration(expiration: Date) {
	const now = new Date();
	const exp = new Date(expiration);
	const diff = getDateDiff(exp, now);

	const years = getNoOfYearsfromMs(diff);
	const months = getNoOfMonthsfromMs(years.remainder);
	const days = getNoOfDaysfromMs(months.remainder);
	const hours = getNoOfHoursfromMs(days.remainder);

	let due = "";
	if (years.years > 0) {
		due += `${years.years}y `;
		return due;
	}

	if (months.months > 0) {
		due += `${months.months}m `;
		return due;
	}

	if (days.days > 0) {
		due += `${days.days}d `;
		return due;
	}

	return "today";
}
