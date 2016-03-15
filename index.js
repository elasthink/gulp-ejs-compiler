'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var ejs = require('ejs');

module.exports = function (options, settings) {
    options = options || {};
    settings = settings || {};

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit(
                'error',
                new gutil.PluginError('gulp-ejs', 'Streaming not supported')
            );
        }

        options = file.data || options;
        options.filename = file.path;

        try {
            var out = ejs.compile(file.contents.toString(), options).toString();
            if (settings.namespace) {
                var templateName = ((path.sep === '/') ? file.relative : file.relative.replace(path.sep, '/'))
                    .slice(0, -path.extname(file.path).length);
                out = settings.namespace + '[' + templateName + ']=' + out + ';';
            }
            file.contents = new Buffer(out);

            if (typeof settings.ext !== 'undefined') {
                file.path = gutil.replaceExtension(file.path, settings.ext);
            }
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-ejs', err.toString()));
        }

        this.push(file);
        cb();
    });
};


