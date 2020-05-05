'use strict';

const
    ejs     = require('ejs'),
    path    = require('path'),
    util    = require('gulp-util'),
    through = require('through2');

const
    PLUGIN_NAME = 'gulp-ejs-compiler2';

module.exports = function (ops = {}) {
    return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            callback(null, file);
            return;
        }

        if (file.isStream()) {
            callback(new util.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return;
        }

        ops = Object.assign({
            client: true,
            compileDebug: false
        }, ops);

        ops.filename = file.path;

        try {
            let code = ejs.compile(file.contents.toString(), ops).toString();
            if (ops.namespace && file.path) {
                let name = ((path.sep === '\\') ? file.relative.replace(/\\/g, '/')
                    : file.relative).slice(0, -path.extname(file.path).length);
                if (typeof ops.namespace === 'function') {
                    code = ops.namespace(name, code);
                } else {
                    code = `${ops.namespace}["${name}"]=${code};`;
                }
            }
            file.contents = new Buffer(code);
            this.push(file);
        } catch (err) {
            this.emit('error', new util.PluginError(PLUGIN_NAME, err, {
                fileName: file.path
            }));
        }
        callback();
    });
}
