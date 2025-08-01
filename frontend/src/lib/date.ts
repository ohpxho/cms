export function getDateDiff(d1: Date, d2: Date) {
	return d1.getTime() - d2.getTime();
}

export function convertMsToDays(ms: number) {
	const DAYSINMS = 86400000;
	return ms / DAYSINMS;
}

export function formatDateToStandardForm(date: Date) {
	const dt = new Date(date);
	const year = dt.getFullYear();
	const month = dt.toLocaleString("default", { month: "short" });
	const day = dt.getDate().toString().padStart(2, "0");

	const formattedDate = `${day} ${month} ${year}`;
	return formattedDate;
}

export function getNoOfYearsfromMs(ms: number) {
	const msInYear = 1000 * 60 * 60 * 24 * 365.25;
	const years = Math.floor(ms / msInYear);
	const remainder = ms % msInYear;
	return { years, remainder };
}

export function getNoOfMonthsfromMs(ms: number) {
	const msInMonth = 1000 * 60 * 60 * 24 * 30.4375;
	const months = Math.floor(ms / msInMonth);
	const remainder = ms % msInMonth;
	return { months, remainder };
}

export function getNoOfDaysfromMs(ms: number) {
	const msInDay = 1000 * 60 * 60 * 24;
	const days = Math.floor(ms / msInDay);
	const remainder = ms % days;
	return { days, remainder };
}

export function getNoOfHoursfromMs(ms: number) {
	const msInHour = 1000 * 60 * 60;
	const hours = Math.floor(ms / msInHour);
	const remainder = ms % hours;
	return { hours, remainder };
}
