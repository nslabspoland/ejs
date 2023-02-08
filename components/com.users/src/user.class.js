import devConfig from "../../../config/devEnvClass";
import { dataValid, passwordEmpty, userRegistrationError } from "../../constants";

/**
 * @classdescription This class lets you manipulate User Object.
 * @author @wojtekxtx
 * @author @emabrey
 * @access public
 * @class User
 * @module User.class
 * @since 1.0
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
 * @default true
 */
export default class User {
	constructor(username, pass, mail, web) {
		username = this.username = "";
		pass = this.pass = "";
		mail = this.mail = "";
		web = this.web = "";
	}

	/**
	 * @author @emabrey @wojtekxtx
	 * @todo #15 Add bofy to IF condition
	 * @class User
	 */
	auth() {
		const dc = new devConfig();
		if (username !== null && pass !== null) {
		}
	}

	/**
	 * @author @emabrey
	 * @description Checks if fields satisfies requirements
	 * @returns (string)username
	 * @returns (string)pass
	 * @returns (string)mail
	 * @class User
	 */
	checkConditions() {
		if (
			typeof this.username !== "string" ||
			typeof this.pass !== "string" ||
			typeof this.mail !== "string" ||
			this.username.length <= 25 ||
			this.pass.length <= 25 ||
			this.mail.length <= 25
		) {
			return this.username || this.pass || this.mail;
		}
	}
	createUser(username, pass) {}

	/**
	 * @author @wojtekxtx
	 * @method
	 * @class User
	 */
	showValidationResults() {
		if (this.checkConditions()) {
			document.getElementById("userdata-validation-field").innerHTML =
				dataValid;
			document.getElementById("submitBtn").removeAttribute("disabled");
		} else {
			// @ts-nocheck
			console.error(userRegistrationError);
			process.exitCode(1);
		}
	}

	/**
	 * @class User
	 * @returns (string) passwordEmpty
	 * @returns (int) hash
	 */
	getPasswdHash() {
		let hash = 0;
		let i, chr;
		if (this.pass === 0) {
			this.pass = hash;
			return passwordEmpty;
		} else {
			for (let i = 0; i < this.length; i++){
				chr = this.charCodeAt(i);
				hash = ((hash << 5) - hash) + chr;
				hash |= 0;
			}
			return hash;
		}
	}

	/**
	 * @class User
	 * @returns (string) username
	 */
	getUserName() {
		return this.username;
	}

	/**
	 * @class User
	 */
	getUserPass() {
		const dc = new devConfig();
		if (dc.getUserAdminStatus()) {
			document.createElement('admin-pass-field').innerHTML = this.pass;
		} else {
			this.getPasswdHash();
		}
	}
}