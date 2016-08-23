import FileMixer from "../../lib/fileMixer/fileMixer.js";

describe("fileMixer.render() (defaults)", () => {
	let renderError;

	beforeEach(done => {
		new FileMixer()
		.contents("<% throw new Error('Doh!'); %>")
		.render((error) => {
			renderError = error;
			done();
		});
	});

	it("should bubble up engine errors to the callback", () => {
		renderError.message.should.contain("Doh!");
	});
});
