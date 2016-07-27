import gulp from "gulp";
import runSequence from "run-sequence";

gulp.task("build", callback => {
	runSequence(
		"copy",
		"build-es5",
		callback
	);
});
