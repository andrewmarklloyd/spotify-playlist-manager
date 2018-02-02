import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import runSequence from 'run-sequence';

const plugins = gulpLoadPlugins();

const paths = {
  js: ['./**/*.js', '!static/**', '!dist/**', '!node_modules/**', '!coverage/**', '!./server/docs/**', '!front-end/**'],
  nonJs: ['./package.json', './.gitignore', './.env'],
  frontEnd: ['./static/*'],
  docs: ['./server/docs/**'],
  tests: './server/tests/*.js'
};

// Clean up dist and coverage directory
gulp.task('clean', () =>
  del.sync(['dist/**', 'dist/.*', 'coverage/**', '!dist', '!coverage']));

// Copy non-js files to dist{}
gulp.task('copy', function() {
  gulp.src(paths.nonJs)
    .pipe(plugins.newer('dist'))
    .pipe(gulp.dest('dist'));
  gulp.src(paths.frontEnd)
    .pipe(plugins.newer('dist/static'))
    .pipe(gulp.dest('dist/static'));
})

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', () =>
  gulp.src([...paths.js, '!gulpfile.babel.js'], { base: '.' })
    .pipe(plugins.newer('dist'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.', {
      includeContent: false,
      sourceRoot(file) {
        return path.relative(file.path, __dirname);
      }
    }))
    .pipe(gulp.dest('dist')));

// Start server with restart on file changes
gulp.task('nodemon', ['copy', 'babel'], () =>
  plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['copy', 'babel'],
    legacyWatch: true
  }));

// gulp serve for development
gulp.task('serve', ['clean'], () => runSequence('nodemon'));

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', ['clean'], () => {
  runSequence(['copy', 'babel']);
});
