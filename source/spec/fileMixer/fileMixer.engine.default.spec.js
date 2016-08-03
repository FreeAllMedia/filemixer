import FileMixer from "../../lib/fileMixer/fileMixer.js";

describe("fileMixer.engine() (default)", () => {
	let fileMixer,
			path,
			contents,
			values,
			renderedFile;

	beforeEach(done => {
		path = "./hello<%= name %>.txt";
		contents = "Hello, <%= name %>!";
		values = {
			"name": "World"
		};

		fileMixer = new FileMixer({ path, contents, values })
		.render((error, file) => {
			renderedFile = file;
			done(error);
		});
	});

	it("should render the fileMixer contents using the designated engine", () => {
		renderedFile.contents.should.eql("Hello, World!");
	});

	it("should return `this` to allow chaining", () => {
		fileMixer.engine(() => {}).should.eql(fileMixer);
	});
});
