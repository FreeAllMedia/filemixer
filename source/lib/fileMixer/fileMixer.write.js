import fileSystem from "fs-extra";
import Async from "flowsync";
import path from "path";

export default function write(callback) {
	Async.waterfall([
		done => {
			this.render(done);
		},
		(file, done) => {
			const directoryPath = path.dirname(file.path);
			fileSystem.mkdirs(directoryPath, error => {
				done(error, file);
			});
		},
		(file, done) => {
			if (file.isFile) {
				fileSystem.writeFile(file.path, file.contents, error => {
					done(error, file);
				});
			} else {
				fileSystem.exists(file.path, directoryExists => {
					if (!directoryExists) {
						fileSystem.mkdir(file.path, error => {
							done(error, file);
						});
					} else {
						done(null, file);
					}
				});
			}

		}
	], callback);

	return this;
}
