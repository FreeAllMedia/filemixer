import FileMixer from "../../lib/fileMixer/fileMixer.js";
import Handlebars from "handlebars";

describe("fileMixer.engine() (async)", () => {
	let fileMixer,
			path,
			contents,
			values,
			engine,
			renderedFile;

	beforeEach(done => {
		path = "./file{{name}}.txt";
		contents = "Hello, {{name}}!";
		values = {
			"name": "World"
		};

		engine = (string, stringValues, complete) => {
			const handleBarsFileMixer = Handlebars.compile(string);
			const renderedString = handleBarsFileMixer(stringValues);
			complete(null, renderedString);
		};

		fileMixer = new FileMixer({ path, contents, values, engine })
		.render((error, file) => {
			renderedFile = file;
			done(error);
		});
	});

	it("should render the fileMixer contents using the designated engine", () => {
		renderedFile.contents.should.eql(`Hello, ${values.name}!`);
	});

	it("should pass errors from the engine callback to the render callback", done => {
		const expectedError = new Error();

		fileMixer = new FileMixer({ path })
		.engine((string, stringValues, callback) => {
			callback(expectedError);
		})
		.render(error => {
			error.should.eql(expectedError);
			done();
		});
	});
});
