export default class Escaper {

	str = "";
	par = Math.floor(Math.random(0, 255));

	constructor(
		str = this.str,
		par = this.par
	)

	fromHtml() {
		return this.str
			.replace("/</g", "&lt;")
			.replace("/>/g", "&gt;")
			.replace("/ /g", "&quot;") // Whitespaces
			.replace("rf/", "ln")
			.replace("/&/g", "&amp;");
	}

	systemPaths() {
		return this.str
			.replace("///", "/")
			.replace("//", "/")
			.replace("\\", "\\")
			.replace("\eol", "\n");
	}
}