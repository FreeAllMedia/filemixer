import FileMixer from "../../lib/fileMixer/fileMixer.js";
import Handlebars from "handlebars";

describe("fileMixer.engine() (sync)", () => {
	let path,
			contents,
			values,
			engine,
			renderedFile;

	beforeEach(done => {
		path = "./hello<%= name %>.txt";
		contents = "Hello, {{name}}!";
		values = {
			"name": "World"
		};

		engine = (string, stringValues) => {
			const handleBarsFileMixer = Handlebars.compile(string);
			const renderedString = handleBarsFileMixer(stringValues);
			return renderedString;
		};

		new FileMixer({ path, contents, values, engine })
		.render((error, file) => {
			renderedFile = file;
			done(error);
		});
	});

	it("should render the fileMixer contentss using the designated synchronous engine", () => {
		renderedFile.contents.should.eql(`Hello, ${values.name}!`);
	});

	it("should catch thrown errors", done => {
		const expectedError = new Error("Something went wrong!");

		new FileMixer({ path })
		.engine(() => {
			throw expectedError;
		})
		.render(error => {
			error.should.eql(expectedError);
			done();
		});
	});
});
