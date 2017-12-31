/* eslint-env mocha */
var path = require('path');
var assert = require('assert');
var File = require('vinyl');
var sourceMaps = require('gulp-sourcemaps');
var buble = require('./');

it('should compile es2015', function (cb) {
    var stream = buble();

    stream.on('data', function (file) {
        var contents = file.contents.toString();
        assert(/function/.test(contents));
        assert.equal(file.relative, 'fixture.js');
        cb();
    });

    stream.write(new File({
        cwd: __dirname,
        base: path.resolve('fixture'),
        path: path.resolve('fixture/fixture.js'),
        contents: new Buffer('() => {}')
    }));

    stream.end();
});

it('should fail on syntax error', function (cb) {
    var stream = buble();

    stream.on('error', function (err) {
        assert.equal(err.message, [
            'SyntaxError: Unexpected token (1:7)',
            '1 : () => {',
            '           ^'
        ].join('\n'));
        cb();
    });

    stream.write(new File({
        cwd: __dirname,
        base: path.resolve('fixture'),
        path: path.resolve('fixture/fixture.js'),
        contents: new Buffer('() => {')
    }));

    stream.end();
});

it('should generate source maps', function (cb) {
    var init = sourceMaps.init();
    var write = sourceMaps.write();

    init
        .pipe(buble())
        .pipe(write);

    write.on('data', function (file) {
        assert.equal(file.sourceMap.mappings, 'SAAA,GAAG,AAAG');
        var contents = file.contents.toString();
        assert(/function/.test(contents));
        assert(/sourceMappingURL=data:application\/json;/.test(contents));
        cb();
    });

    init.write(new File({
        cwd: __dirname,
        base: path.resolve('fixture'),
        path: path.resolve('fixture/fixture.js'),
        contents: new Buffer('() => {}'),
        sourceMap: ''
    }));

    init.end();
});

it('should read upstream source maps', function (cb) {
    var testFile;
    var stream = buble();
    var write = sourceMaps.write();
    var sourcesContent = [
        '() => {}',
        '() => {\n\treturn true;\n}'
    ];

    stream.pipe(write);

    write.on('data', function (file) {
        assert.equal(file.sourceMap.sourcesContent[0], sourcesContent[0]);
        assert.equal(file.sourceMap.sourcesContent[1], sourcesContent[1]);
        cb();
    });

    testFile = new File({
        cwd: __dirname,
        base: path.resolve('fixture'),
        path: path.resolve('fixture/fixture.js'),
        contents: new Buffer(sourcesContent[1])
    });
    testFile.sourceMap = {
        version: 3,
        file: 'fixture.js',
        sources: ['prev.js'],
        names: [],
        mappings: 'AAAA,YAAM',
        sourcesContent: [sourcesContent[0]]
    };
    stream.write(testFile, testFile.sourceMap);

    stream.end();
});
