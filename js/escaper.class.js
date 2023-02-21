export default class Escaper {

	str = "";

	constructor(
		str = this.str
	)

	fromHtml() {
		return this.str
			.replace("/</g", "&lt;")
			.replace("/>/g", "&gt;")
			.replace("//g", "&quot;")
			.replace("rf/", "ln")
			.replace("/&/g", "&amp;");
	}

	systemPaths() {
		return this.str
			.replace("///", "/")
			.replace("//", "/");
	}
}