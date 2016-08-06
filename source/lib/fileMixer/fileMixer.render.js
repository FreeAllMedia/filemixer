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
		isFile: false,
		isMerged: false
	};

	Async.waterfall([
		done => {
			renderPathAndContents(fileMixer, file, done);
		},
		(renderedFile, done) => {
			mergePathAndContents(fileMixer, renderedFile, done);
		}
	], (error, mergedFile) => {
		callback(error, mergedFile);
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

			callback(error, file);
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
				callback(null, file);
			}
		});
	} else {
		callback(null, file);
	}
}

function applyMergeStrategy(fileMixer, file, callback) {
	const merge = fileMixer.merge();
	const path = fileMixer.path();

	Async.waterfall([
		done => {
			fileSystem.stat(path, (error, stats) => {
				if (stats.isFile()) {
					fileSystem.readFile(path, { encoding: "utf8"}, done);
				} else {
					done(null, undefined);
				}
			});
		},
		(existingContents, done) => {
			const existingFile = {
				path: path,
				contents: existingContents,
				isFile: existingContents ? true : false,
				isDirectory: existingContents ? false : true
			};

			if (merge.length === 4) {
				merge(fileMixer, existingFile, file, done);
			} else {
				try {
					const mergedFile = merge(fileMixer, existingFile, file);
					done(null, mergedFile);
				} catch (exception) {
					done(exception);
				}
			}
		}
	], (error, mergedFile) => {
		if (!error) {
			mergedFile.isMerged = true;
			callback(error, mergedFile);
		} else {
			callback(error);
		}
	});
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
