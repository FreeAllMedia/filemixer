import FileMixer from "../../lib/fileMixer/fileMixer.js";
import temp from "temp";
import fileSystem from "fs";

temp.track();

describe("fileMixer.merge() (async)", () => {
	let fileMixer,
			path,
			contents,
			existingContents,
			mergeStrategy,
			renderedFile,
			temporaryDirectory;

	beforeEach(done => {
		temporaryDirectory = temp.mkdirSync("FileMixer.render");

		path = `${temporaryDirectory}/fileMixer.txt`;
		existingContents = "Hello, World!";
		contents = "Hello, Bob!";


		fileSystem.writeFileSync(path, existingContents);

		mergeStrategy = (self, oldContents, newContents, mergeComplete) => {
			const mergedContents = oldContents + newContents;
			mergeComplete(null, mergedContents);
		};

		fileMixer = new FileMixer({ path, contents })
		.merge(mergeStrategy)
		.render((error, file) => {
			renderedFile = file;
			done(error);
		});
	});

	it("should render the fileMixer contentss to the designated path", () => {
		renderedFile.contents.should.eql(existingContents + contents);
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
		.merge((self, oldContents, newContents, mergeComplete) => {
			mergeComplete(expectedError);
		})
		.render(error => {
			error.should.eql(expectedError);
			done();
		});
	});
});
