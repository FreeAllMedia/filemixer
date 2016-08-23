"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = write;

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function write(callback) {
	var _this = this;

	_flowsync2.default.waterfall([function (done) {
		_this.render(done);
	}, function (file, done) {
		var directoryPath = _path2.default.dirname(file.path);
		_fsExtra2.default.mkdirs(directoryPath, function (error) {
			done(error, file);
		});
	}, function (file, done) {
		if (file.isFile) {
			_fsExtra2.default.writeFile(file.path, file.contents, function (error) {
				done(error, file);
			});
		} else {
			_fsExtra2.default.exists(file.path, function (directoryExists) {
				if (!directoryExists) {
					_fsExtra2.default.mkdir(file.path, function (error) {
						done(error, file);
					});
				} else {
					done(null, file);
				}
			});
		}
	}], callback);

	return this;
}