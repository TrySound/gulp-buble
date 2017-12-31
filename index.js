var Transform = require('readable-stream').Transform;
var applySourceMap = require('vinyl-sourcemaps-apply');
var buble = require('buble').transform;
var PluginError = require('plugin-error');

module.exports = function (options) {
    return new Transform({
        objectMode: true,
        transform: function (file, enc, cb) {
            if (file.isNull()) {
                cb(null, file);
                return;
            }
            if (file.isStream()) {
                cb(new PluginError('gulp-buble', 'Streaming not supported'));
                return;
            }

            options = options || {};
            options.file = file.path;
            options.source = file.path;
            options.includeContent = true;

            var result;
            try {
                result = buble(file.contents.toString(), options);
            } catch (e) {
                cb(new PluginError('gulp-buble', e.toString()));
                return;
            }

            file.contents = new Buffer(result.code);

            if (file.sourceMap) {
                applySourceMap(file, result.map);
            }

            cb(null, file);
        }
    });
};
