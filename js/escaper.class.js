class Escaper {

	str = "";

	constructor(
		str = this.str
	)

	fromHtml() {
		return this.str
			.replace("/</g", "&lt;")
			.replace("/>/g", "&gt;")
			.replace("//g", "&quot;")
			.replace("///", "/")
			.replace("//", "/")
			.replace("rf/", "ln")
			.replace("/&/g", "&amp;");
	}
}