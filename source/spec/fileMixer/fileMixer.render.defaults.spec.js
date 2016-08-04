import FileMixer from "../../lib/fileMixer/fileMixer.js";

describe("fileMixer.render() (defaults)", () => {
	let fileMixer,
			renderedFile;

	beforeEach(done => {
		fileMixer = new FileMixer()
		.render((error, file) => {
			renderedFile = file;
			done(error);
		});
	});

	it("should set .contents to undefined by default", () => {
		(renderedFile.contents === undefined).should.be.true;
	});

	it("should set .path to undefined by default", () => {
		(renderedFile.path === undefined).should.be.true;
	});

	it("should set isFile to true", () => {
		renderedFile.isFile.should.be.false;
	});

	it("should set isDirectory to false", () => {
		renderedFile.isDirectory.should.be.false;
	});

	it("should return `this` to allow chaining", () => {
		fileMixer.render(() => {}).should.eql(fileMixer);
	});

	it("should work without a callback", () => {
		(() => {
			fileMixer.render();
		}).should.not.throw();
	});
});
