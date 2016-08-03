import FileMixer from "../../lib/fileMixer/fileMixer.js";
import intercept from "intercept-stdout";
import sinon from "sinon";

let stdout,
		clock,
		endIntercept;

describe("fileMixer.debug()", () => {
	let fileMixer;

	beforeEach(() => {
		stdout = "";
		endIntercept = intercept(data => {
			stdout += data.toString();
		});
		clock = sinon.useFakeTimers();

		fileMixer = new FileMixer();
	});

	afterEach(() => {
		endIntercept();
		clock.restore();
	});

	it("should be writable", () => {
		fileMixer.debug(process.stdout);
		fileMixer.debug().should.eql(process.stdout);
	});

	it("should return null by default", () => {
		(fileMixer.debug() === null).should.be.true;
	});

	it("should return `this` when setting to allow chaining", () => {
		fileMixer.debug(process.stdout).should.eql(fileMixer);
	});
});
