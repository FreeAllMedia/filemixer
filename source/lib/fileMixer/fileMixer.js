import ChainLink from "mrt";
import ejs from "ejs";
// import privateData from "incognito";
import path from "path";

const externalFunction = Symbol(),
			setDefaults = Symbol();

class File extends ChainLink {
	initialize(options = {}) {
		this.properties(
			"path",
			"contents",
			"engine",
			"debug",
			"merge",
			"base"
		);

		this.properties(
			"values"
		).merged;

		this[setDefaults](options);
	}

	render(callback) {
		return this[externalFunction](`${__dirname}/fileMixer.render.js`, callback);
	}

	write(callback) {
		return this[externalFunction](`${__dirname}/fileMixer.write.js`, callback);
	}

	log(message, payload) {
		return this[externalFunction](`${__dirname}/fileMixer.log.js`, message, payload);
	}

	[setDefaults](options) {
		this.path(options.path);
		this.contents(options.contents);
		this.values(options.values);
		this.merge(options.merge);

		const base = options.base || path.dirname(options.path) + "/";
		this.base(base);

		const defaultEngine = (string, values, complete) => {
			const rendered = ejs.render(string, values);
			complete(null, rendered);
		};

		this.engine(options.engine || defaultEngine);
	}

	[externalFunction](functionFilePath, ...options) {
		const returnValue = require(functionFilePath).default.call(this, ...options);

		return returnValue;
	}
}

export default File;
