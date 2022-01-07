#! /usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

if (process.argv.length < 3) {
	console.log("You have to provide a name to your module.");
	console.log("For example :");
	console.log("  npx https://github.com/gongdongho12/npx-ts-module my-module");
	process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const GIT_REPO = "https://github.com/gongdongho12/npx-ts-module";

if (projectName !== ".") {
	try {
		fs.mkdirSync(projectPath);
	} catch (err) {
		if (err.code === "EEXIST") {
			console.log(projectName);
			console.log(
				`The file ${projectName} already exist in the current directory, please give it another name.`
			);
		} else {
			console.log(error);
		}
		process.exit(1);
	}
}

function searchReplaceFile(regexpFind, replace, fileName) {
	var file = fs.createReadStream(fileName, "utf8");
	var text = "";

	file.on("data", function (chunk) {
		text += chunk.toString().replace(regexpFind, replace);
	});

	file.on("end", function () {
		fs.writeFile(fileName, text, function (err) {
			if (err) {
				return console.log(err);
			} else {
				console.log("Updated!");
			}
		});
	});
}

async function main() {
	try {
		console.log("Downloading files...");
		execSync(`git clone --depth 1 ${GIT_REPO} ${projectPath}`);

		if (projectName !== ".") {
			process.chdir(projectPath);
		}

		console.log("Installing dependencies...");
		execSync("npm install");

		console.log("Removing useless files");
		execSync("npx rimraf ./.git");

		searchReplaceFile(
			`"name": "typescript-npm-module"`,
			`"name": "${projectName}"`,
			"package.json"
		);

		console.log("The installation is done, this is ready to use !");
	} catch (error) {
		console.log(error);
	}
}

main();
