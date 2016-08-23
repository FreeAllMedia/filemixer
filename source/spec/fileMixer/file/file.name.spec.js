import FileMixer from "../../../lib/fileMixer/fileMixer.js";
import temp from "temp";

describe("fileMixer.name()", () => {
	let path,
			renderedFile;

	beforeEach(done => {
		const temporaryDirectoryPath = temp.mkdirSync("fileMixer.name");
		path = `${temporaryDirectoryPath}/blah/helloWorld.txt`;

		new FileMixer({ path })
		.render((error, file) => {
			renderedFile = file;
			done(error);
		});
	});

	it("should use the file's directory as a default base", () => {
		renderedFile.name.should.eql("helloWorld.txt");
	});
});
