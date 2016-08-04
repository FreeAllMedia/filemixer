# FileMixer.js

[![npm version](https://img.shields.io/npm/v/filemixer.svg)](https://www.npmjs.com/package/filemixer) [![license type](https://img.shields.io/npm/l/filemixer.svg)](https://github.com/FreeAllMedia/filemixer.git/blob/master/LICENSE)  [![Build Status](https://travis-ci.org/FreeAllMedia/filemixer.png?branch=master)](https://travis-ci.org/FreeAllMedia/filemixer) [![Coverage Status](https://coveralls.io/repos/github/FreeAllMedia/filemixer/badge.svg?branch=master)](https://coveralls.io/github/FreeAllMedia/filemixer?branch=master) [![bitHound Score](https://www.bithound.io/github/FreeAllMedia/filemixer/badges/score.svg)](https://www.bithound.io/github/FreeAllMedia/filemixer) [![bitHound Dependencies](https://www.bithound.io/github/FreeAllMedia/filemixer/badges/dependencies.svg)](https://www.bithound.io/github/FreeAllMedia/filemixer/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/FreeAllMedia/filemixer/badges/devDependencies.svg)](https://www.bithound.io/github/FreeAllMedia/filemixer/dependencies/npm) [![npm downloads](https://img.shields.io/npm/dm/filemixer.svg)](https://www.npmjs.com/package/filemixer) ![Source: ECMAScript 6](https://img.shields.io/badge/Source-ECMAScript_2015-green.svg)

Create new and merged virtual files from templates.

* Provide a template for a file's path and/or contents, render them with a template engine.
* Use [EJS](http://www.embeddedjs.com/) templates by default, or choose your own rendering engine.
* Render to a virtual file object, or to disk.
* Merge or overwrite existing file contents using a provided strategy.

``` javascript
import FileMixer from "filemixer";

const path = "./hello<= name %>.txt";
const contents = "Hello, <%= name %>!";
const values = {
	name: "World"
};

/**
 * If contents is not set, the rendered VirtualFile will be a directory.
 * If contents is set, the rendered VirtualFile will be a file.
 */
new FileMixer({ path, contents, values })

/**
 * Optionally set a custom template engine instead of the default EJS.
 */
.engine((string, stringValues, done) => {
	const handleBarsFileMixer = Handlebars.compile(string);
	const renderedString = handleBarsFileMixer(stringValues);
	done(null, renderedString);
})

/**
 * Optionally set a merging strategy that will run if there's an existing file.
 */
.merge((self, existingFileContents, newFileContents, done) => {
	const mergedContents = existingFileContents + newFileContents;
	done(null, mergedContents);
})

/**
 * Render the path and contents with the designated template engine then run
 * the merge strategy if it exists and there's an existing file then call back
 * with a rendered `VirtualFile` object.
 */
.render((error, file) => {
  file.isFile; // true
  file.isDirectory; // false
  file.path; // ./helloWorld.txt
  file.contents; // Hello, World!
})

/**
 * First `.render` the VirtualFile, then write/overwrite the file to disk.
 */
.write((error, file) => {
  // File was written to disk. The virtual file object is provided here so we
  // don't `.render` twice.
});
```

## How to Contribute

We *love* pull requests and issue reports! **Really!**

If you find a bug or have a feature suggestion, please feel free to [submit an issue here](https://github.com/FreeAllMedia/filemixer/issues).

For more information on *how* to submit a pull request, please [read this guide on contributing to open-source projects](https://guides.github.com/activities/contributing-to-open-source/).
