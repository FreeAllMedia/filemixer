import FileMixer from "../../lib/fileMixer/fileMixer.js";
import temp from "temp";
import fileSystem from "fs";

temp.track();

describe("fileMixer.merge() (async)", () => {
	let fileMixer,
			name,
			base,
			path,
			contents,
			existingContents,
			mergeStrategy,
			renderedFile,
			temporaryDirectory,
			results;

	beforeEach(done => {
		temporaryDirectory = temp.mkdirSync("FileMixer.render");

		path = `${temporaryDirectory}/fileMixer.txt`;
		existingContents = "Hello, World!";
		contents = "Hello, Bob!";
		base = `${temporaryDirectory}/`;
		name = "fileMixer.txt";


		fileSystem.writeFileSync(path, existingContents);

		mergeStrategy = (self, existingFile, newFile, mergeComplete) => {
			results = { existingFile, newFile };

			const mergedFile = Object.assign({}, existingFile);
			mergedFile.path = newFile.path.replace("fileMixer", "mixerFile");
			mergedFile.contents = existingFile.contents + newFile.contents;
			mergeComplete(null, mergedFile);
		};

		fileMixer = new FileMixer({ path, contents })
		.merge(mergeStrategy)
		.render((error, file) => {
			renderedFile = file;
			done(error);
		});
	});

	it("should provide the merge strategy with the existing virtual file object", () => {
		results.existingFile.should.eql({
			name,
			base,
			contents: existingContents,
			path,
			isFile: true,
			isDirectory: false,
			isMerged: false
		});
	});

	it("should provide the merge strategy with the existing virtual file object", () => {
		results.newFile.should.eql({
			name,
			base,
			contents: contents,
			path: path,
			isFile: true,
			isDirectory: false,
			isMerged: false
		});
	});

	it("should render the file name", () => {
		renderedFile.name.should.eql("mixerFile.txt");
	});

	it("should render the file name", () => {
		renderedFile.path.should.eql(base + "mixerFile.txt");
	});

	it("should render the fileMixer contents to the designated path", () => {
		renderedFile.contents.should.eql(existingContents + contents);
	});

	it("should set isMerged to true", () => {
		renderedFile.isMerged.should.be.true;
	});

	it("should return `this` to allow chaining", () => {
		fileMixer.merge(mergeStrategy).should.eql(fileMixer);
	});

	it("should overwrite the previous strategy when a new strategy is provided", () => {
		const newStrategy = () => {};
		fileMixer.merge(newStrategy);
		fileMixer.merge().should.eql(newStrategy);
	});

	it("should return errors to the render callback", done => {
		const expectedError = new Error("Something went wrong!");

		new FileMixer({ path, contents })
		.merge((self, existingFile, newFile, mergeComplete) => {
			mergeComplete(expectedError);
		})
		.render(error => {
			error.should.eql(expectedError);
			done();
		});
	});
});
