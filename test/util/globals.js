/**
 * Resolves namespace
 * @param {string} namespace
 * @returns {Object} recursive namespace
 */
var use = function(namespace) {

  var segments = namespace.split('.');

  for (var i = 0, len = segments.length, obj = window; i < len; ++i) {
    var segment = segments[i];
    if (!obj[segment]) {
      obj[segment] = {};
    }
    obj = obj[segment];
  }

  return obj;
};


/**
 * Check if namespace exists
 * @param {String} namespace (example spirit.model.fixture)
 * @returns {Boolean}
 */
var exist = function(namespace) {
  if (typeof namespace !== 'string') {
    return false;
  }
  var segments = namespace.split('.');
  var doesExist = true;

  for (var i = 0, len = segments.length, obj = window; i < len; ++i) {
    var segment = segments[i];

    if (!obj[segment]) {
      doesExist = false;
      break;
    }
    obj = obj[segment];
  }

  return doesExist;
};
