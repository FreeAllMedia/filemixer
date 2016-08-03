import FileMixer from "../../lib/fileMixer/fileMixer.js";

describe("fileMixer.render() (without path)", () => {
	let contents,
			values,
			renderedFile;

	beforeEach(done => {
		contents = "Hello, <%= name %>!";
		values = { name: "World" };

		new FileMixer({ contents, values })
		.render((error, file) => {
			renderedFile = file;
			done(error);
		});
	});

	it("should not render a path", () => {
		(renderedFile.path === undefined).should.be.true;
	});

	it("should still render contents", () => {
		renderedFile.contents.should.eql("Hello, World!");
	});
});
