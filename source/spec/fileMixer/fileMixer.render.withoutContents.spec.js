import FileMixer from "../../lib/fileMixer/fileMixer.js";

describe("fileMixer.render() (without contents)", () => {
	let fileMixer,
			path,
			values,
			renderedFile;

	beforeEach(done => {
		path = "./hello<%= name %>.txt";
		values = { name: "World" };

		fileMixer = new FileMixer({ path, values })
		.render((error, file) => {
			renderedFile = file;
			done(error);
		});
	});

	it("should render the path", () => {
		renderedFile.path.should.eql(`./hello${values.name}.txt`);
	});

	it("should set isFile to false", () => {
		renderedFile.isFile.should.be.false;
	});

	it("should set isDirectory to true", () => {
		renderedFile.isDirectory.should.be.true;
	});

	it("should set isMerged to false", () => {
		renderedFile.isMerged.should.be.false;
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
