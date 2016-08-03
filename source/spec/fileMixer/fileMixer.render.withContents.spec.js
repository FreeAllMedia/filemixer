import FileMixer from "../../lib/fileMixer/fileMixer.js";

describe("fileMixer.render() (with contents)", () => {
	let fileMixer,
			path,
			contents,
			values,
			renderedFile;

	beforeEach(done => {
		path = "./hello<%= name %>.txt";
		contents = "Hello, <%= name %>!";
		values = { name: "World" };

		fileMixer = new FileMixer({ path, contents, values })
		.render((error, file) => {
			renderedFile = file;
			done(error);
		});
	});

	it("should render the path", () => {
		renderedFile.path.should.eql(`./hello${values.name}.txt`);
	});

	it("should render the contents", () => {
		renderedFile.contents.should.eql(`Hello, ${values.name}!`);
	});

	it("should set isFile to true", () => {
		renderedFile.isFile.should.be.true;
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
