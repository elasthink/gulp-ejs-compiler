// TODO: NO FUNCIONA! hay que resolver la dependencia con "vinyl-file" o buscar una alternativa.
'use strict';

const
    assert      = require('assert'),
    ejsCompiler = require('./'),
    fs          = require('fs'),
    path        = require('path'),
    vinylFile   = require('vinyl-file');

function escape(str) {
    return str;
}

it('Hello World', async callback => {
    const stream = ejsCompiler({
        escape: escape,
        localsName: 'data',
        namespace: 'myTemplates',
        _with: false
    });

    stream.on('data', function(data) {
        let myTemplates = [];
        eval(data.contents.toString());
        let out = myTemplates['samples/hello']({
            name: 'World'
        });
        assert.strictEqual(out, '<h1>Hello World!</h1>');
    });
    stream.on('end', callback);
    stream.write(vinylFile.readSync('samples/hello.ejs'));
    stream.end();
});
