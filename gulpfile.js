var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var del = require('del');
var config = require('./gulp.config')(); //require and execute it
var port = process.env.PORT || config.defaultPort;

var $ = require('gulp-load-plugins')({
    lazy: true
});

gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');
    return gulp
      .src(config.alljs)
      .pipe($.if(args.verbose, $.print()))
      .pipe($.jscs())
      .pipe($.jscs.reporter())
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish', {
        verbose: true
    }))
      .pipe($.jshint.reporter('fail'));
});

gulp.task('serve-dev', function() {
    var isDev = true;
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: config.alljs
    };
    return $.nodemon(nodeOptions)
        .on('restart', ['vet'], function(ev) {
            log('*** nodemon restarted');
            log('files changed on restart: \n' + ev);
        })
        .on('start', function() {
            log('*** nodemon started');
            startBrowserSync();
        })
        .on('crash', function() {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function() {
            log('*** nodemon exited cleanly');
        });
});

gulp.task('inject', function() {
    log('Wire up the bower css and our app js into the html');
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');

    var injectSrc = gulp.src(['./public/css/*.css', './public/js/*.js'], {read: false});

    var injectOptions = {
        ignorePath: '/public'
    };

    var options = config.getWiredepDefaultOptions();
    return gulp.src('./views/*.jade')
        .pipe(wiredep(options))
        .pipe($.inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./views/'));
});

///////
function startBrowserSync() {
    if (browserSync.active) {
        return;
    }

    log('Starting browser-sync on port ' + port);
    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: ['**/*.*'],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 1000
    };
    browserSync(options);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
