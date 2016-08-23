import FileMixer from "../../../lib/fileMixer/fileMixer.js";
import temp from "temp";

describe("file.base()", () => {
	let path,
			base,
			renderedFile;

	beforeEach(done => {
		const temporaryDirectoryPath = temp.mkdirSync("fileMixer.base");
		path = `${temporaryDirectoryPath}/blah/helloWorld.txt`;
		base = `${temporaryDirectoryPath}/`;

		new FileMixer({ path, base })
		.render((error, file) => {
			renderedFile = file;
			done(error);
		});
	});

	it("should not change the path", () => {
		renderedFile.path.should.eql(path);
	});

	it("should set the base", () => {
		renderedFile.base.should.eql(base);
	});

	it("should change the file name to exclude the new base path", () => {
		const fileName = path.replace(base, "");
		renderedFile.name.should.eql(fileName);
	});
});
