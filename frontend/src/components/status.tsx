import { Status as StatusEnum } from "@/enums";

export default function Status({ status }: { status: StatusEnum }) {
	switch (status) {
		case StatusEnum.EXPIRINGSOON:
			return (
				<span className="bg-orange-700 text-white text-xs p-1 rounded-sm">
					{StatusEnum.EXPIRINGSOON}
				</span>
			);
		case StatusEnum.EXPIRED:
			return (
				<span className="bg-red-700 text-white text-xs p-1 rounded-sm">
					{StatusEnum.EXPIRED}
				</span>
			);
		default:
			return (
				<span className="bg-blue-700 text-white text-xs p-1 rounded-sm">
					{StatusEnum.ACTIVE}
				</span>
			);
	}
}
