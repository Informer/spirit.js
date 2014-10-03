/**
 * Helper init
 * @type {Object}
 */
var jasmine = window.jasmine || {};


(function() {
  'use strict';

  /**
   * Extend with spirit helpers (lodash etc)
   */
  var _ = spirit._helpers;
  jasmine._helpers = jasmine._helpers || _.extend({}, _);

  (function(ns) {

    'use strict';

    /**
     * Loads fixture sync
     * @param path
     * @returns {{}} JSON data
     */
    ns.loadFixture = function(path) {
      var fixture;
      $.ajax({
        async: false, // must be synchronous to guarantee that no tests are run before fixture is loaded
        dataType: 'json',
        url: 'base/test/fixtures/' + path,
        success: function(data) {
          fixture = (typeof data === 'string') ? JSON.parse(data) : data;
        }
      });
      return fixture;
    };

  })(jasmine._helpers);
})();





