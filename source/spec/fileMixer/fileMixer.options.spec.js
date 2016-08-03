import FileMixer from "../../lib/fileMixer/fileMixer.js";

describe("FileMixer(options)", () => {
	let fileMixer,
			options;

	beforeEach(() => {
		options = {
			path: "./hello<%= name %>.txt",
			contents: "Hello, <%= name %>!",
			engine: () => {},
			values: { name: "World" },
			merge: () => {}
		};
		fileMixer = new FileMixer(options);
	});

	it("should set contents through options", () => {
		fileMixer.contents().should.eql(options.contents);
	});

	it("should set values through options", () => {
		fileMixer.values().should.eql(options.values);
	});

	it("should set path through options", () => {
		fileMixer.path().should.eql(options.path);
	});

	it("should set engine through options", () => {
		fileMixer.engine().should.eql(options.engine);
	});

	it("should set merge through options", () => {
		fileMixer.merge().should.eql(options.merge);
	});
});
