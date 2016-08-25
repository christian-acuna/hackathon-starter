module.exports = function() {
    var config = {
        alljs: ['*.js', 'src/**/*.js'],
        /*
        * Node Settings
        */
        defaultPort: 7203,
        nodeServer: 'app.js',
        /**
         * Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './public/lib',
            ignorePath: '../public/'
        },
    };
    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };
    return config;
};
