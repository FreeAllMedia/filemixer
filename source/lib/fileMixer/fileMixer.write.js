import fileSystem from "fs";
import Async from "flowsync";


export default function write(callback) {
	Async.waterfall([
		done => {
			this.render(done);
		},
		(file, done) => {
			fileSystem.writeFile(file.path, file.contents, error => {
				done(error, file);
			});
		}
	], callback);

	return this;
}
