var gulp = require("gulp"),
	interpolate = require("mout/string/interpolate"),
    jshint = require("gulp-jshint"),
    babel = require("gulp-babel");

var jshintReporter = {
	reporter: function (errors) {
		errors.forEach(function (error) {
			var err = error.error;
			err.filePath = error.file.replace(/components\/[^/]+\.js$/, "$&x");
			console.log(interpolate("{{filePath}}: line {{line}}, col {{character}}, {{reason}}", err));
		});
	}
};

gulp.task("default", function () {
	gulp.src("src/*.js")
	.pipe(babel({presets: ["es2015"], plugins: ["add-module-exports"]}))
	.pipe(gulp.dest("dist/"));
});

gulp.task("jshint", function () {
	gulp.src("src/*.js")
	.pipe(jshint())
	.pipe(jshint.reporter(jshintReporter));
});

gulp.task("watch", function(){
	gulp.watch("*.js", ["default"])
});
