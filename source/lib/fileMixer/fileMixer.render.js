import Async from "flowsync";
import fileSystem from "fs";

export default function render(callback = () => {}) {
	renderFileObject(this, callback);

	return this;
}

function renderFileObject(fileMixer, callback) {
	const file = {
		path: null,
		contents: null,
		isDirectory: false,
		isFile: false
	};

	Async.series([
		done => {
			renderPathAndContents(fileMixer, file, done);
		},
		done => {
			mergePathAndContents(fileMixer, file, done);
		}
	], error => {
		callback(error, file);
	});
}

function renderPathAndContents(fileMixer, file, callback) {
	const path = fileMixer.path();
	const contents = fileMixer.contents();
	const stringsToRender = [path, contents];

	if (path || contents) {
		if (contents) {
			file.isFile = true;
		} else {
			file.isDirectory = true;
		}
	}

	Async.mapSeries(
		stringsToRender,
		(string, done) => {
			renderString(fileMixer, string, done);
		},
		(error, renderedStrings) => {
			const renderedPath = renderedStrings[0];
			const renderedContents = renderedStrings[1];

			file.path = renderedPath;
			file.contents = renderedContents;

			callback(error);
		}
	);
}

function mergePathAndContents(fileMixer, file, callback) {
	const merge = fileMixer.merge();
	if (merge) {
		fileSystem.exists(fileMixer.path(), exists => {
			if (exists) {
				applyMergeStrategy(fileMixer, file, callback);
			} else {
				callback();
			}
		});
	} else {
		callback();
	}
}

function applyMergeStrategy(fileMixer, file, callback) {
	const merge = fileMixer.merge();
	const path = fileMixer.path();

	Async.waterfall([
		done => {
			fileSystem.readFile(path, { encoding: "utf8"}, done);
		},
		(existingContents, done) => {
			if (merge.length === 4) {
				merge(fileMixer, existingContents, file.contents, done);
			} else {
				try {
					const mergedContents = merge(fileMixer, existingContents, file.contents);
					done(null, mergedContents);
				} catch (exception) {
					done(exception);
				}
			}
		},
		(mergedContents, done) => {
			file.contents = mergedContents;
			done();
		}
	], callback);
}

function renderString(fileMixer, string, callback) {
	const templateEngine = fileMixer.engine();
	if (string) {
		switch (templateEngine.length) {
			case 0:
			case 1:
			case 2: {
				try {
					const renderedString = templateEngine(string, fileMixer.values());
					callback(null, renderedString);
				} catch (exception) {
					callback(exception);
				}
				break;
			}
			case 3:
				templateEngine(string, fileMixer.values(), (error, renderedString) => {
					callback(error, renderedString);
				});
				break;
		}
	} else {
		callback(null, string);
	}
}
