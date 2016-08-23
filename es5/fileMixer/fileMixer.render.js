"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = render;

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render() {
	var callback = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

	renderFileObject(this, callback);

	return this;
}

function renderFileObject(fileMixer, callback) {

	var file = {
		path: null,
		base: null,
		name: null,
		contents: null,
		isDirectory: false,
		isFile: false,
		isMerged: false
	};

	_async2.default.waterfall([function (done) {
		renderPathAndContents(fileMixer, file, done);
	}, function (renderedFile, done) {
		mergePathAndContents(fileMixer, renderedFile, done);
	}], function (error, mergedFile) {
		callback(error, mergedFile);
	});
}

function renderPathAndContents(fileMixer, file, callback) {
	var path = fileMixer.path();
	var contents = fileMixer.contents();
	var base = fileMixer.base();

	var stringsToRender = [path, contents];

	if (path || contents) {
		if (contents) {
			file.isFile = true;
		} else {
			file.isDirectory = true;
		}
	}

	_async2.default.mapSeries(stringsToRender, _async2.default.apply(renderString, fileMixer), function (error, renderedStrings) {
		var renderedPath = renderedStrings[0];
		var renderedContents = renderedStrings[1];

		if (renderedPath) {
			var fileName = renderedPath.replace(new RegExp(base, "g"), "");
			file.name = fileName;
		}

		file.base = base;
		file.path = renderedPath;
		file.contents = renderedContents;

		callback(error, file);
	});
}

function mergePathAndContents(fileMixer, file, callback) {
	var merge = fileMixer.merge();
	if (merge) {
		_fs2.default.exists(fileMixer.path(), function (exists) {
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
	var merge = fileMixer.merge();
	var path = fileMixer.path();

	_async2.default.waterfall([function (done) {
		_fs2.default.stat(path, function (error, stats) {
			if (stats.isFile()) {
				_fs2.default.readFile(path, { encoding: "utf8" }, done);
			} else {
				done(null, undefined);
			}
		});
	}, function (existingContents, done) {
		var existingFile = {
			name: file.name,
			base: file.base,
			path: path,
			contents: existingContents,
			isFile: existingContents ? true : false,
			isDirectory: existingContents ? false : true,
			isMerged: false
		};

		if (merge.length === 4) {
			merge(fileMixer, existingFile, file, done);
		} else {
			try {
				var mergedFile = merge(fileMixer, existingFile, file);
				done(null, mergedFile);
			} catch (exception) {
				done(exception);
			}
		}
	}], function (error, mergedFile) {
		if (!error) {

			mergedFile.isMerged = true;
			mergedFile.name = mergedFile.path.replace(new RegExp(mergedFile.base, "g"), "");
			//console.log({ mergedFile });
			callback(error, mergedFile);
		} else {
			callback(error);
		}
	});
}

function renderString(fileMixer, string, callback) {
	var templateEngine = fileMixer.engine();
	if (string) {
		switch (templateEngine.length) {
			case 0:
			case 1:
			case 2:
				{
					try {
						var renderedString = templateEngine(string, fileMixer.values());
						callback(null, renderedString);
					} catch (exception) {
						callback(exception);
					}
					break;
				}
			case 3:
				try {
					templateEngine(string, fileMixer.values(), function (error, renderedString) {
						callback(error, renderedString);
					});
				} catch (exception) {
					callback(exception);
				}
				break;
		}
	} else {
		callback(null, string);
	}
}