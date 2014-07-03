var yaml = require('js-yaml');
var q = require('q');
var os = require('os');
var path = require('path');
var fs = require('fs');
var childProcess = require('child_process');

var envDir = path.join(process.cwd(), 'envs');
fs.mkdirSync(envDir);

exports.list = function(req, res, next) {
    fs.readdir(envDir, function(err, files) {
        if (err) return next(err);
        res.send(files);
        return next();
    });
};

exports.create = function(req, res, next) {
    var log = req.log;
    if (!req.is('text/yaml')) {
        res.send(405);
        return next();
    } else {
        var fig_yml;
        var projectName = req.params.name;
        try {
            fig_yml = yaml.safeDump(yaml.safeLoad(req.body));
        } catch (err) {
            log.error(err);
            res.send(400);
            return next();
        }
        var workdir = path.join(envDir, projectName);
        var figFile = path.join(workdir, 'fig.yml');
        fs.mkdir(workdir, function() {
            console.log(workdir);
            fs.writeFile(figFile, fig_yml, function () {
                var fig = childProcess.spawn('/usr/local/bin/fig', ['-f', figFile, '-p', projectName, 'up', '-d']);
                fig.on('error', function (err) {
                    log.error(err);
                    return next(err);
                });

                fig.on('exit', function () {
                    log.info('Successfully started environment ' + projectName);
                    res.send(204);
                    return next();
                });
            });
        });
    }
};