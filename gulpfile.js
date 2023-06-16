const { series, src, dest } = require('gulp');

const ts = require('gulp-typescript');
const path = require('path');
const flatmap = require('gulp-flatmap');
const replace = require('gulp-replace');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint-new');

function capture() {
    return build('./src/Common.ts', './src/AdvancedCapture.ts', './dist');
}

function csv() {
    return build('./src/Common.ts', './src/AdvancedCaptureCsv.ts', './dist');
}

// gulp.task('build-capture', build('./src/Common.ts', './src/AdvancedCapture.ts', './dist'));
// gulp.task('build-csv', build('./src/Common.ts', './src/AdvancedCaptureCsv.ts', './dist'));

function build(common, source, outDir) {
    return src(source)
        .pipe(flatmap((stream, file) => {
            const outFile = path.join(path.dirname(file.relative), `${path.basename(file.relative, '.ts')}.js`);
            const tsProject = ts.createProject('tsconfig.json');
            return stream
                .pipe(src(common))
                .pipe(eslint())
                .pipe(eslint.format())
                .pipe(tsProject())
                .pipe(replace(/^\s*import .+;$\s*/gm, ''))
                .pipe(replace(/^\s*export .+;$\s*/gm, ''))
                .pipe(replace(/^\s*export /gm, ''))
                .pipe(concat(outFile))
                .pipe(dest(outDir));
        }));
}

exports.default = series(capture, csv);

// gulp.task('default', gulp.series('build-capture'));
