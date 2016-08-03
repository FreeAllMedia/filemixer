import FileMixer from "../../lib/fileMixer/fileMixer.js";
import temp from "temp";
import fileSystem from "fs";

temp.track();

describe("fileMixer.merge() (sync)", () => {
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

		mergeStrategy = (self, oldContents, newContents) => {
			const mergedContents = oldContents + newContents;
			return mergedContents;
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

	it("should catch thrown errors and bubble them up to the callback", done => {
		/* eslint-disable no-unused-vars */
		const expectedError = new Error("Something went wrong!");

		fileMixer = new FileMixer({ path, contents })
		.merge((self, oldContents, newContents) => {
			throw expectedError;
		})
		.render(error => {
			error.should.eql(expectedError);
			done();
		});
	});
});
