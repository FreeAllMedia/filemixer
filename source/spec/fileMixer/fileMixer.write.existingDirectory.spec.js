import FileMixer from "../../lib/fileMixer/fileMixer.js";
import temp from "temp";
import fileSystem from "fs";

temp.track();

describe("fileMixer.write() (existing directory)", () => {
	let fileMixer,
			path,
			virtualFile,
			writtenDirectoryStats,
			temporaryDirectory;

	beforeEach(done => {
		temporaryDirectory = temp.mkdirSync("fileMixer.write.directory");
		path = `${temporaryDirectory}/directory`;

		fileSystem.mkdirSync(path);

		fileMixer = new FileMixer({ path })
		.write((error, file) => {
			writtenDirectoryStats = fileSystem.statSync(file.path);

			virtualFile = file;
			done(error);
		});
	});

	it("should write a directory at the designated path", () => {
		writtenDirectoryStats.isDirectory().should.be.true;
	});

	it("should not set contents", () => {
		(virtualFile.contents === undefined).should.be.true;
	});

	it("should return the rendered file path", () => {
		virtualFile.path.should.eql(path);
	});

	it("should set isFile to false", () => {
		virtualFile.isFile.should.be.false;
	});

	it("should set isDirectory to true", () => {
		virtualFile.isDirectory.should.be.true;
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
