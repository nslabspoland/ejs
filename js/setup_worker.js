import { homeUrl, toHome } from "./redirect";

const { setupWorker, rest } = require("msw");
const { repoaddress, ctxStatusOK } = require("../config/dev-env");

export const worker = setupWorker(
	rest.get(repoaddress, (res, ctx) => {
		return res(
			ctx.delay(1000),
			ctx.status(ctxStatusOK),
			ctx.json({
				message: "Request OK"
			})
		)
	})
)

// Redirect to URL
toHome(homeUrl);

// Run worker
worker.start();