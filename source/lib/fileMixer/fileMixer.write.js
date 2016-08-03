import fileSystem from "fs";
import Async from "flowsync";


export default function render(callback = () => {}) {
	fileSystem.exists(path, exists => {
		const nextStep = exists ? fileExists : fileDoesntExist;
		nextStep(this, path, callback);
	});

	return this;
}

function fileDoesntExist(template, path, callback) {
	renderTemplate(template, (error, renderedTemplate) => {
		writeFile(path, renderedTemplate, callback);
	});
}

function fileExists(template, path, callback) {
	Async.waterfall([
		done => {
			renderTemplate(template, done);
		},
		(renderedTemplate, done) => {
			readExistingFile(path, (error, existingContent) => {
				done(error, renderedTemplate, existingContent);
			});
		},
		(renderedTemplate, existingContent, done) => {
			mergeContent(template, existingContent, renderedTemplate, done);
		},
		(mergedContent, done) => {
			writeFile(path, mergedContent, done);
		}
	], callback);
}

function readExistingFile(path, done) {
	fileSystem.readFile(
		path,
		{ encoding: "utf8" },
		done
	);
}

function renderTemplate(template, callback) {
	const templateEngine = template.engine();

	switch (templateEngine.length) {
		case 0:
		case 1: {
			try {
				const renderedTemplate = templateEngine(template);
				callback(null, renderedTemplate);
			} catch (exception) {
				callback(exception);
			}
			break;
		}
		case 2:
			templateEngine(template, callback);
			break;
	}
}

function writeFile(path, content, done) {
	fileSystem.writeFile(path, content, done);
}

function mergeContent(template, existingContent, newContent, done) {
	const mergeStrategy = template.merge();
	if (mergeStrategy) {
		switch (mergeStrategy.length) {
			case 4:
				mergeStrategy(template, existingContent, newContent, done);
				break;
			case 3:
				try {
					const mergedContent = mergeStrategy(template, existingContent, newContent);
					done(null, mergedContent);
				} catch (exception) {
					done(exception);
				}
				break;
			default:
				done(new Error("Merge stategies must have either 3 or 4 arguments."));
		}
	} else {
		done(null, newContent);
	}
}
