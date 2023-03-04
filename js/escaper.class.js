/**
 * Escapes dangerous chars to safe form parsable without any risk.
 * 
 * @author @wojtekxtx
 * @since 0.0.2
 * @see https://palant.info/2020/03/02/psa-jquery-is-bad-for-the-security-of-your-project/#harmful-coding-patterns
 * @description Escapes dangerous chars to safe form parsable without any risk.
 */
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

	fromUrl() {
		return this.str
			.replace("//", "/")
	}
}