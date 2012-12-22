var wrench = require('wrench');
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var util = require('util');

var COVERAGE_FOLDER = 'lib-cov';
var REPORTS_FOLDER = 'reports';

var run = function () {

    wrench.rmdirSyncRecursive(REPORTS_FOLDER, true);
    console.log("Deleted folder %s", REPORTS_FOLDER);

    var modules = path.resolve(__dirname, '../node_modules/');
    var jasminLib = modules + '/jasmine-node/lib/jasmine-node';

    wrench.copyDirSyncRecursive(modules + '/jscoverage-reporter/template/', REPORTS_FOLDER);

    console.log("Copied coverage template into %s folder", REPORTS_FOLDER);

    require(jasminLib + '/index.js');

    require('jscoverage-reporter');

    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.addReporter(new jasmine.JSCoverageReporter('./reports'));
    require(jasminLib + '/cli.js');
};

wrench.rmdirSyncRecursive(COVERAGE_FOLDER, true);
console.log("Deleted folder %s", COVERAGE_FOLDER);

process.env.ENGINE_COVERAGE = 1;

var command = util.format('jscoverage lib %s', COVERAGE_FOLDER);

exec(command, function (err, stdout, stderr) {
    if (stdout) {
        console.log(stdout);
    }
    if (stderr) {
        console.error(stderr);
    }
    if (err) {
        console.error('exec error', err);
        process.exit(1);
    }
    run();
});