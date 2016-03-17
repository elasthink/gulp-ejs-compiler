'use strict';

var ejs     = require('ejs'),
    path    = require('path'),
    gutil   = require('gulp-util'),
    through = require('through2');

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
            var codeString = ejs.compile(file.contents.toString(), options).toString();
            if (settings.namespace) {
                var templateName = ((path.sep === '/') ? file.relative : file.relative.replace(path.sep, '/'))
                    .slice(0, -path.extname(file.path).length);
                if (typeof(settings.namespace) === 'function') {
                    codeString = settings.namespace(templateName, codeString);
                } else {
                    codeString = settings.namespace + '["' + templateName + '"]=' + out + ';';
                }
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


