export function getFileNameFromAttachment(attachment: string) {
	const paths = attachment.split("/");
	return paths[paths.length - 1];
}
