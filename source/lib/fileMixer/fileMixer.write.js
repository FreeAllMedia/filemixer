import fileSystem from "fs";
import Async from "flowsync";


export default function write(callback) {
	Async.waterfall([
		done => {
			this.render(done);
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
