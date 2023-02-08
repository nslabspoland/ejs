import { lockOutMessage } from "../../../config/dev-env";

/**
 * @author @wojtekxtx
 * @description Class for handling errors
 * @since 0.2-alpha
 */

export const noDbCredentials = "You have no mongo username/password setup!";

class errorHandler {
	super()

	ctxStatusOk() {
		return ctxStatusOK = "200, OK";
	}

	ctxRedirected() {
		return ctxStatusRedirected = "301, Redirected";
	}

	ctxPageNotFound() {
		return ctxStatusPageNotFound = "404, Page noty found";
	}

	loggedUserIsNotAdmin() {
		return "Logged user is: "+userLoggedIn;
	}

	tmpNotParseable() {
		return errTemplateNotParseable = "This template is not parseable";
	}

	typeNotParseable() {
		return elementNotParseable = "This element/object is not parseable.";
	}

	accountLockedMessage() {
		return console.log(lockOutMessage);
	}

	noDbCredentialsSetup() {
		return console.log(noDbCredentials);
	}

	noDefaultDbName() {
		return noDefaultDbName = "'You have no database name, using \"nodebb";
	}
}