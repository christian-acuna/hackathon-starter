module.exports = function() {
    var config = {
        alljs: ['*.js', 'src/**/*.js'],
        /*
        * Node Settings
        */
        defaultPort: 7203,
        nodeServer: 'app.js'
    };

    return config;
};
