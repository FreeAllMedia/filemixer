import FileMixer from "../../lib/fileMixer/fileMixer.js";

describe("FileMixer()", () => {
	let fileMixer;

	beforeEach(() => {
		fileMixer = new FileMixer();
	});

	it("should return an instance of FileMixer", () => {
		fileMixer.should.be.instanceOf(FileMixer);
	});
});
