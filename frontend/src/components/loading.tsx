export default function Loading() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<div className="flex flex-col items-center space-y-4">
				<div className="relative h-16 w-16">
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
