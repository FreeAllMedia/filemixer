"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = write;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function write(callback) {
	var _this = this;

	_flowsync2.default.waterfall([function (done) {
		_this.render(done);
	}, function (file, done) {
		if (file.isFile) {
			_fs2.default.writeFile(file.path, file.contents, function (error) {
				done(error, file);
			});
		} else {
			_fs2.default.exists(file.path, function (directoryExists) {
				if (!directoryExists) {
					_fs2.default.mkdir(file.path, function (error) {
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