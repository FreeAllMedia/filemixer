import FileMixer from "../../lib/fileMixer/fileMixer.js";
import temp from "temp";
import fileSystem from "fs";

temp.track();

describe("fileMixer.write() (with missing directory in path)", () => {
	let fileMixer,
			path,
			contents,
			virtualFile,
			writtenFileContents,
			temporaryDirectory;

	beforeEach(done => {
		temporaryDirectory = temp.mkdirSync("fileMixer.write");
		path = `${temporaryDirectory}/someDirectory/file.txt`;
		contents = "Hello, Bob!";

		fileMixer = new FileMixer({ path, contents })
		.write((error, file) => {
			writtenFileContents = fileSystem.readFileSync(path, { encoding: "utf8" });

			virtualFile = file;
			done(error);
		});
	});

	it("should write the file contents to disk at the designated path", () => {
		writtenFileContents.should.eql(contents);
	});

	it("should return the rendered file contents", () => {
		virtualFile.contents.should.eql(contents);
	});

	it("should return the rendered file path", () => {
		virtualFile.path.should.eql(path);
	});

	it("should set isFile to true", () => {
		virtualFile.isFile.should.be.true;
	});

	it("should set isDirectory to false", () => {
		virtualFile.isDirectory.should.be.false;
	});

	it("should return `this` to allow chaining", () => {
		fileMixer.write(() => {}).should.eql(fileMixer);
	});

	it("should work without a callback", () => {
		(() => {
			fileMixer.write();
		}).should.not.throw();
	});
});
