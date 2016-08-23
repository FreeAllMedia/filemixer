import FileMixer from "../../lib/fileMixer/fileMixer.js";
import temp from "temp";

describe("fileMixer.render() (directory)", () => {
	let path,
			temporaryDirectoryPath,
			renderedFile;

	beforeEach(done => {
		temporaryDirectoryPath = temp.mkdirSync("fileMixer.render.directory");
		path = `${temporaryDirectoryPath}/directory`;

		new FileMixer({ path })
		.render((error, file) => {
			renderedFile = file;
			done(error);
		});
	});

	it("should render the directory without error", () => {
		renderedFile.isDirectory.should.be.true;
	});
});
