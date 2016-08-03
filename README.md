# FileMixer.js

[![npm version](https://img.shields.io/npm/v/filemixer.svg)](https://www.npmjs.com/package/filemixer) [![license type](https://img.shields.io/npm/l/filemixer.svg)](https://github.com/FreeAllMedia/filemixer.git/blob/master/LICENSE)  [![Build Status](https://travis-ci.org/FreeAllMedia/filemixer.png?branch=master)](https://travis-ci.org/FreeAllMedia/filemixer) [![Coverage Status](https://coveralls.io/repos/github/FreeAllMedia/filemixer/badge.svg?branch=master)](https://coveralls.io/github/FreeAllMedia/filemixer?branch=master) [![bitHound Score](https://www.bithound.io/github/FreeAllMedia/filemixer/badges/score.svg)](https://www.bithound.io/github/FreeAllMedia/filemixer) [![bitHound Dependencies](https://www.bithound.io/github/FreeAllMedia/filemixer/badges/dependencies.svg)](https://www.bithound.io/github/FreeAllMedia/filemixer/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/FreeAllMedia/filemixer/badges/devDependencies.svg)](https://www.bithound.io/github/FreeAllMedia/filemixer/dependencies/npm) [![npm downloads](https://img.shields.io/npm/dm/filemixer.svg)](https://www.npmjs.com/package/filemixer) ![Source: ECMAScript 6](https://img.shields.io/badge/Source-ECMAScript_2015-green.svg)

# What does it do?

* render a file from template using provided values
* write the rendered templates to the file system
* merge or overwrite existing file contents using a provided strategy
* can use any template engine to render (uses EJS by default)

# Render a File to Object

The file `path` and `contents` are rendered using the designated template rendering engine.

Files are rendered into a simple virtual file object containing properties that match the inputs provided:

``` javascript
import FileMixer from "filemixer";

const path = `someDir/hello<%= name %>.txt`;
const contents = "Hello, <%= name %>!<% if (greeting) { %> <%= greeting %><% } %>";
const values = {
	name: "World"
};

new FileMixer({ path, contents, values })
	.render((error, file) => {
		if (error) { throw error; }
		file.isDirectory; // false
		file.path; // "./helloWorld.txt"
		file.contents; // "Hello, World!"
	})
	.values({ greeting: "How are you?" })
	.render((error, file) => {
		if (error) { throw error; }
		file.isDirectory; // false
		file.path; // "someDir/helloWorld.txt"
		file.contents; // "Hello, World! How are you?"
	})
	.path("my<%= name %>")
	.content(null)
	.render((error, file) => {
		if (error) { throw error; }
		file.isDirectory; // true
		file.path; // "./myWorld"
		file.contents; // null
	})
```

## Render a Directory to Object

``` javascript
import FileMixer from "filemixer";

const path = `${__dirname}/hello<%= name %>.txt`;

const values = {
	name: "World"
};

const fileMixer = new FileMixer({ path, values });

fileMixer
.render((error, file) => {
	if (error) { throw error; }
	file.isDirectory; // true
	file.path; // "./helloWorld.txt"
	file.contents; // "Hello, World!"
});

fileMixer
.values({ greeting: "How are you?" })
.render((error, file) => {
	if (error) { throw error; }
	file.path; // "./helloWorld.txt"
	file.contents; // "Hello, World! How are you?"
});
```

# Write to Disk

If you want to write the rendered file to disk, use the `.write` method instead of `.render`.

``` javascript
import FileMixer from "filemixer";

const path = `${__dirname}/hello<%= name %>.txt`;
const contents = "Hello, <%= name %>!<% if (greeting) { %> <%= greeting %><% } %>";

const values = {
	name: "World"
};

const fileMixer = new FileMixer({ path, contents, values });

fileMixer.write((error, file) => {
	if (error) { throw error; }
	file.contents;
});
```

``` shell
$ cat ./helloWorld.txt
Hello, World! How are you?
```

# Merge With an Existing File

If there is an existing file at the rendered `path`, FileMixer will see if a merging strategy is provided.

* If no merge strategy is provided, the existing file is overwritten.
*

``` shell
$ cat ./helloWorld.txt
Hello, World! How are you?
```

``` javascript
import FileMixer from "filemixer";
import jsdiff from "diff";

const path = `${__dirname}/helloWorld.txt`;
const contents = "Hello, <%= name %>! <%= greeting %>";
const values = {
	name: "Bob",
	greeting: "How goes?"
};

const fileMixer = new FileMixer({
	contents,
	values
})

fileMixer
.merge((self, oldContent, newContent) => {
	const differences = jsdiff.diffWords(oldContent, newContent);
	const mergedContent = differences.map(difference=>difference.value).join("");

	return mergedContent;
})
.render(path, (error, file) => {
	file.contentss;
});
```

``` shell
$ cat helloWorld.txt
Hello, WorldBob! How are yougoes?
```

## How to Contribute

We *love* pull requests and issue reports! **Really!**

If you find a bug or have a feature suggestion, please feel free to [submit an issue here](https://github.com/FreeAllMedia/filemixer/issues).

For more information on *how* to submit a pull request, please [read this guide on contributing to open-source projects](https://guides.github.com/activities/contributing-to-open-source/).
