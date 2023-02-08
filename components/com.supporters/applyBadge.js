import { userLoggedIn } from "../../config/dev-env";
import { badgeFilePath, badgeSettingError, payingSupporters } from "./supporters";

/**
 * @author @wojtekxtx
 * @description Applies badge if user is active supporter
 * @version 0.1 alpha
 * @class supportBadge
 */
class supportBadge {
	super(
		badgeId = this.getBadgeId()
	)

	displaySupportBadge() {
	}

	// Admin-only method below
	uploadBadge() {
		const badgeContainer = document.createElement('div').id('supportBadge');
		let badgeToUpload = badgePath.normalize(badgeFilePath + __filename);
		let formData = new FormData();
		formData.append("badgeFile.svg", badge);
		fetch(badgeToUpload, {
			method: "POST",
			body: formData
		});
		document.getElementById('supportBadge').append(formData);
		if (payingSupporters.includes(userLoggedIn)) {
			document.getElementById('userPostBitData').appendChild(badgeContainer);
		} else {
			document.getElementById('warmingPane').textContent = badgeSettingError;
		}
	}

	cropBadge() {
	}

	/**
	 * @deprecated
	 * @description No code within method
	 */
	readBadge() {
	}

	getBadgeId() {
		return badgeId;
	}
}
