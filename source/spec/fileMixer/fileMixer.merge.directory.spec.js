import FileMixer from "../../lib/fileMixer/fileMixer.js";
import temp from "temp";
import fileSystem from "fs";

describe("fileMixer.render() (directory)", () => {
	let path,
			temporaryDirectoryPath,
			renderedFile;

	beforeEach(done => {
		temporaryDirectoryPath = temp.mkdirSync("fileMixer.render.directory");

		path = `${temporaryDirectoryPath}/existingDirectory`;

		fileSystem.mkdirSync(path);

		new FileMixer({ path })
		.merge((fileMixer, existingFile) => {
			path = `${temporaryDirectoryPath}/someDirectory`;
			existingFile.path = path;
			return existingFile;
		})
		.render((error, file) => {
			renderedFile = file;
			done(error);
		});
	});

	it("should render the directory without error", () => {
		renderedFile.isDirectory.should.be.true;
	});

	it("should set isMerged to true", () => {
		renderedFile.isMerged.should.be.true;
	});

	it("should render the file name", () => {
		renderedFile.name.should.eql("someDirectory");
	});
});
