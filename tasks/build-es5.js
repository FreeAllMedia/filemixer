import gulp from "gulp";
import babel from "gulp-babel";

import paths from "../paths.json";

gulp.task("build-es5", () => {
	return gulp.src(paths.source.lib.js)
		.pipe(babel())
		.pipe(gulp.dest(paths.destination.es5.directory));
});
