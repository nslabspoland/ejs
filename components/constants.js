"use strict";

import { join } from "path";
const baseDir = join(__dirname, "../");
const tmpPath = join(baseDir, "tmp/");
const loader = join(baseDir, "loader.js");
const app = join(baseDir, "app.js");
const pidfile = join(baseDir, "pidfile");
const config = join(baseDir, "config/devEnvClass.js");
const currentPackage = join(baseDir, "package.json");
const nodeModules = join(baseDir, "node_modules");
const dbPath = join(baseDir, "database");
const pluginNamePattern =
	/^(@[\w-]+\/)?nodebb-(theme|plugin|widget|rewards)-[\w-]+$/;
const themeNamePattern = /^(@[\w-]+\/)?nodebb-theme-[\w-]+$/;
const paths = {
	baseDir,
	loader,
	app,
	pidfile,
	config,
	currentPackage,
	installPackage,
	nodeModules,
	tmpPath,
	dbPath,
};
const errDisplayingValues = "Unable to display values";
const cookiesNotEnabled = "Cookies not supported/enabled";
const dataValid = "User data have required length and format";
const userRegistrationError = "There was an error while registering";
const passwordEmpty = "Password is empty!";

export { app, paths, errDisplayingValues, cookiesNotEnabled, dataValid, userRegistrationError, passwordEmpty };