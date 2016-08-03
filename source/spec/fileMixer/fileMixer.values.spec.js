import FileMixer from "../../lib/fileMixer/fileMixer.js";

describe("fileMixer.values()", () => {
	let fileMixer,
			contents,
			values;

	beforeEach(() => {
		contents = "Hello, World!";
		values = {
			"one": 1,
			2: "two"
		};
		fileMixer = new FileMixer({ contents, values });
	});

	it("should aggregate new values", () => {
		const newValues = {
			"one": "uno",
			"three": "tres"
		};
		fileMixer.values(newValues);
		fileMixer.values().should.eql({
			"one": "uno",
			2: "two",
			"three": "tres"
		});
	});

	it("should be settable by the constructor", () => {
		fileMixer.values().should.eql(values);
	});

	it("should return `this` when setting to allow chaining", () => {
		fileMixer.values({ something: "one" }).should.eql(fileMixer);
	});
});
