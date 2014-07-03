var q = require('q');

exports.create = function(app) {
    var deferred = q.defer();
    deferred.resolve({});
    return deferred.promise;
};