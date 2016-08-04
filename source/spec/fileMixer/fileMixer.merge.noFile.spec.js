import FileMixer from "../../lib/fileMixer/fileMixer.js";
import temp from "temp";

temp.track();

describe("fileMixer.merge() (no existing file)", () => {
	let path,
			contents,
			mergeStrategy,
			renderedFile,
			temporaryDirectory;

	beforeEach(done => {
		temporaryDirectory = temp.mkdirSync("FileMixer.render");

		path = `${temporaryDirectory}/fileMixer.txt`;
		contents = "Hello, Bob!";

		mergeStrategy = (self, oldContents, newContents, mergeComplete) => {
			const mergedContents = oldContents + newContents;
			mergeComplete(null, mergedContents);
		};

		new FileMixer({ path, contents })
		.merge(mergeStrategy)
		.render((error, file) => {
			renderedFile = file;
			done(error);
		});
	});

	it("should render the fileMixer contentss to the designated path", () => {
		renderedFile.contents.should.eql(contents);
	});
});
