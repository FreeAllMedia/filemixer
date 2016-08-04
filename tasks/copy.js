import gulp from "gulp";
import paths from "../paths.json";

gulp.task("copy", () => gulp
	.src(paths.source.lib.all)
	.pipe(gulp.dest(paths.destination.es5.directory))
);
