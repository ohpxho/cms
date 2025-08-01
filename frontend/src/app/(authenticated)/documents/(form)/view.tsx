import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document } from "@/types";
import { SetStateAction } from "react";
import {
	FileMinus,
	RefreshCcw,
	Pencil,
	ClockArrowDown,
	ClockAlert,
	MailWarning,
} from "lucide-react";
import { getFileNameFromAttachment } from "@/lib/file";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface PropTypes {
	id: number | null;
	setId: React.Dispatch<SetStateAction<number | null>>;
	data: Document | null;
}

export default function ViewDocument({ id, setId, data }: PropTypes) {
	return (
		<Dialog open={id != null ? true : false} onOpenChange={() => setId(null)}>
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle className="flex gap-2 items-center">
						{/* <FileMinus strokeWidth={2} className="" />{" "} */}
						<div className="flex flex-col gap-1">
							<div className="flex gap-2">
								<span className="text-2xl">{data?.name}</span>
							</div>
							<span className=" font-normal">{data?.issuing_authority}</span>
						</div>
					</DialogTitle>
					<DialogDescription>
						{/* <div className="flex gap-2 mt-4">
							<Button className="text-xs bg-transparent text-green-700 rounded-sm">
								<RefreshCcw />
								<span>Renew</span>
							</Button>
							<Button className="bg-gray-200 text-black">
								<Pencil />
								<span>Edit</span>
							</Button>
						</div> */}

						<div className="mt-4 flex flex-col gap-8">
							<div className="flex">
								<div className="flex w-1/2 flex-col gap-2 text-black">
									<span className="text-gray-400">Issued on</span>
									<div className="flex gap-2 items-center">
										<span>{`${data?.date_issued}`}</span>
										<ClockArrowDown strokeWidth={1} className="h-5 w-5" />
									</div>
								</div>
								<div className="flex w-1/2 flex-col gap-2 text-black">
									<span className="text-gray-400">Expired on</span>
									<div className="flex gap-2 items-center">
										<span>{`${data?.date_expired}`}</span>
										<ClockAlert strokeWidth={1} className="h-5 w-5" />
									</div>
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<span className="text-gray-400">Attachment</span>
								{data?.attachment ? (
									<a
										href={data.attachment}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 text-blue-600 hover:underline"
									>
										<FileMinus className="w-5 h-5" />
										<span>{getFileNameFromAttachment(data?.attachment)}</span>
									</a>
								) : (
									<span className="text-gray-500">No attachment</span>
								)}
							</div>

							<div className="flex flex-col gap-2">
								<div className="overflow-x-auto rounded border border-gray-100">
									<div className="w-full rounded">
										<div className="flex bg-gray-200 justify-center py-2 mb-4">
											<span className="font-semibold text-gray-700">
												Previous Records
											</span>
										</div>
										<ul className="divide-y divide-gray-200">
											<li className="py-4 text-center text-gray-400">
												No previous records found.
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
						{/* Created By Avatar in Footer */}
						<DialogFooter className="flex justify-between items-center mt-4 border-t pt-4">
							<div className="flex items-center w-full gap-2">
								{data?.created_by && (
									<div className="flex items-center gap-2">
										<span className="inline-block p-2 rounded-full bg-blue-300 overflow-hidden">
											<span className="flex items-center justify-center text-xs font-semibold text-blue-700 rounded-sm">
												{data?.created_by?.name
													? data.created_by.name
															.split(" ")
															.map((n: string) => n[0])
															.join("")
															.slice(0, 2)
															.toUpperCase()
													: "U"}
											</span>
										</span>
										<span className="text-sm text-gray-600">
											{data.created_by.name}
										</span>
									</div>
								)}
							</div>
							<div className="flex gap-2 w-full  items-center justify-end">
								<MailWarning strokeWidth={1} className="h-5 w-5" />
								<span>No email notification sent yet</span>
							</div>
						</DialogFooter>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
