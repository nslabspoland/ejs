let str = "";

export default function HTMLEscaper(str) {
	return str
		.replace("/</g", "&lt;")
		.replace("/>/g", "&gt;")
		.replace("//g", "&quot;")
		.replace("/&/g", "&amp;");
}