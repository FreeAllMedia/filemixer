import FileMixer from "../../lib/fileMixer/fileMixer.js";
import intercept from "intercept-stdout";
import sinon from "sinon";
import util from "util";

let stdout,
		clock,
		endIntercept;

describe("fileMixer.log()", () => {
	let fileMixer,
			message,
			payload;

	beforeEach(() => {
		fileMixer = new FileMixer();

		message = "Something happened";
		payload = {
			id: 23,
			type: "error",
			code: "500"
		};
	});

	beforeEach(() => {
		stdout = "";
		endIntercept = intercept(data => {
			stdout += data.toString();
		});
		clock = sinon.useFakeTimers();
	});

	afterEach(() => {
		endIntercept();
		clock.restore();
	});

	it("should return `this` when setting to allow chaining", () => {
		fileMixer.log(process.stdout).should.eql(fileMixer);
	});

	it("should write log messages to the stream provided", () => {
		fileMixer.debug(process.stdout);

		fileMixer.log(message);

		const date = new Date().toISOString().slice(11, -5);

		stdout.should.eql(`[${date}] ${message}\n`);
	});

	it("should write the payload to the next lines if provided", () => {
		fileMixer.debug(process.stdout);

		fileMixer.log(message, payload);

		const date = new Date().toISOString().slice(11, -5);

		stdout.should.eql(`[${date}] ${message}\n${util.inspect(payload)}\n`);
	});

	it("should NOT write log messages when a debug stream is not provided", () => {
		fileMixer.log(message, payload);

		stdout.should.eql("");
	});
});
