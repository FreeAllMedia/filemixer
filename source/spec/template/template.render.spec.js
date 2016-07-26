import Template from "../../lib/template/template.js";
import temp from "temp";
import templateSystem from "fs";

temp.track();

describe("template.render()", () => {
	let template,
			path,
			content,
			renderedContent,
			temporaryDirectory;

	beforeEach(done => {
		temporaryDirectory = temp.mkdirSync("Template.render");
		path = `${temporaryDirectory}/template.txt`;
		content = "Hello, World!";
		template = new Template()
		.content(content)
		.render(path, error => {
			renderedContent = templateSystem.readFileSync(path, { encoding: "utf8" });
			done(error);
		});
	});

	it("should render the template contents to the designated path", () => {
		renderedContent.should.eql(content);
	});

	it("should return `this` to allow chaining", () => {
		template.render(path, () => {}).should.eql(template);
	});

	it("should not throw an error when called without a callback", () => {
		(() => {
			template.render(path);
		}).should.not.throw();
	});

	it("should not catch thrown errors", () => {
		(() => {
			template.render(path);
		}).should.not.throw();
	});
});
