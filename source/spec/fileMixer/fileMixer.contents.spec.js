import FileMixer from "../../lib/fileMixer/fileMixer.js";

describe("fileMixer.contents()", () => {
	let fileMixer,
			contents;

	beforeEach(() => {
		contents = "Hello, World!";
		fileMixer = new FileMixer({ contents });
	});

	it("should be settable", () => {
		const newContents = "Hello, Universe!";
		fileMixer.contents(newContents);
		fileMixer.contents().should.eql(newContents);
	});

	it("should be settable by the constructor", () => {
		fileMixer.contents().should.eql(contents);
	});

	it("should return `this` when setting to allow chaining", () => {
		fileMixer.contents("Baz").should.eql(fileMixer);
	});
});
