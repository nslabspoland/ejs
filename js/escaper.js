let str = "";

/**
 * Escapes HTML code to safe form.
 *
 * @param {*} str
 * @returns str
 * @author @wojtekxtx
 * @since 0.1.1
 * @see https://palant.info/2020/03/02/psa-jquery-is-bad-for-the-security-of-your-project/#harmful-coding-patterns
 * @see nslabspl/ejs#2
 */
export default function HTMLEscaper(str) {
	return str
		.replace("/</g", "&lt;")
		.replace("/>/g", "&gt;")
		.replace("//g", "&quot;")
		.replace("///", "/")
		.replace("//", "/")
		.replace("rf/", "ln")
		.replace("/&/g", "&amp;");
}
