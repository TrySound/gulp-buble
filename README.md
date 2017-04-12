# gulp-buble [![Build Status](https://travis-ci.org/TrySound/gulp-buble.svg?branch=master)](https://travis-ci.org/TrySound/gulp-buble)

> Compile ES2015 with [buble](https://gitlab.com/Rich-Harris/buble)

*Issues with the output should be reported on the buble [issue tracker](https://gitlab.com/Rich-Harris/buble/issues).*


## Install

```
$ npm i gulp-buble -D
```


## Usage

```js
const gulp = require('gulp');
const buble = require('gulp-buble');

gulp.task('default', function () {
	return gulp.src('src/app.js')
		.pipe(buble())
		.pipe(gulp.dest('dist'));
});
```

It is possible to pass transforms option as the first argument to `buble()`, to tansform only some specific features of ES2015. For example:

```js
const gulp = require('gulp');
const buble = require('gulp-buble');

gulp.task('default', function () {
	return gulp.src('src/app.js')
		.pipe(buble({
			transforms: {
				arrow: true,
				generator: false
			}
		}))
		.pipe(gulp.dest('dist'));
});
```

For complete list of buble options, please consult [buble guide](https://buble.surge.sh/guide/#using-the-javascript-api)


## Source Maps

Use [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps) like this:

```js
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const buble = require('gulp-buble');
const concat = require('gulp-concat');

gulp.task('default', () =>
	gulp.src('src/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(buble())
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
);
```


## License

MIT © [Bogdan Chadkin](mailto:trysound@yandex.ru)
