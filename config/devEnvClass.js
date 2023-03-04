import { cookiesNotEnabled, paths } from "../components/constants";
import { worker } from "../js/setup_worker";
import { ctxStatusOK, ctxStatusRequestBypassed, ctxStatusRequestException, ctxStatusRequestStarted, ctxStatusRequestUnhandled } from "./dev-env";

/**
 * @author @wojtekxtx
 * @class Config
 * @since 0.2
 */
export default class devConfig {
	super(
		getCtxStatus = this.getCtxStatus,
		getLocalDate = this.getCurrentLocalisedDate,
		workerStatus = this.isWorkerReady,
		currentTemplate = this.getTemplate,
		keyId = this.getKeyByID,
		userAdminStatus = this.getUserAdminStatus,
		repoaddress = this.repoaddress,
		appName = this.thisAppName,
		instType = this.instanceType
	)

	getCurrentLocalisedDate() {
		let currentLocalisedDate = Date.now().toLocaleString();
		return currentLocalisedDate;
	}

	getEnviromentMetaData() {
		return [
			repoaddress = process.env.REPOADDRESS,
			appName = process.env.APPNAME,
			instType = process.env.INSTTYPE
		]
	}
	
	getCtxStatus() {
		let ctxStatus;
		
		switch (ctxStatus) {
			case ctxStatusOK:
				worker.events.on('request:end').emit(ctxStatusOK);
				break;
			
			case ctxStatusRequestUnhandled:
				worker.events.on('request:unhandled').emit(ctxStatusRequestUnhandled);
				break;
			
			case ctxStatusRequestException:
				worker.events.on('unhandledException').emit(ctxStatusRequestException);
				break;
			
			case ctxStatusRequestStarted:
				worker.events.on('request:start').emit(ctxStatusRequestStarted);
				break;
			
			case ctxStatusRequestBypassed:
				worker.events.on('response:bypass').emit(ctxStatusRequestBypassed);
				break;
			
			default:
				worker.events.on('request:start').emit(ctxStatusRequestStarted);
				break;
		}
	}

	isWorkerReady() {
		return navigator.serviceWorker.ready();
	}

	getTemplate(template, specialTags, pipeBeforeTags) {
		specialTags = specialTags || ["fragment"];
		pipeBeforeTags = pipeBeforeTags || [];
		return parseTemplate(specialTags, pipeBeforeTags)(template);
	}

	getWorkingDir() {
		return paths.app.toString();
	}

	getKeyByID(key, run = Promise.resolve(), time) {
		time = 500; // ms
		if (this.keys[key] && Date.now() < this.keys[key].expire) {
			return Promise.resolve(this.keys[key].value);
		}

		this.keys[key] = {
			fetching: true
		};

		return run().then((value) => {
			this.keys[key] = {
				value: value,
				expire: Date.now() + time,
			};
			return value;
		})
	}

	getUserLoginState() {
		return process.env.loggedInUserId;
	}

	getInstanceName() {
		return process.env.envName;
	}

	getUserAdminStatus() {
		return process.env.isAdmin;
	}

	getUserCookies() {
		let cookies = document.cookie;
		return [
			document.createElement('div').className('cookieInfoDiv') = cookies
		]
	}

	setEnvCookies() {
		if (navigator.cookieEnabled) {
			document.cookie("Instance name", this.getInstanceName());
		} else {
			console.log(cookiesNotEnabled);
		}
	}
}

export { devConfig };
