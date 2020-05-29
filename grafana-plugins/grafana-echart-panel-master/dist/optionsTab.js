'use strict';

System.register(['./aceEditorCtrl'], function (_export, _context) {
  "use strict";

  var AceEditorCtrl, _createClass, OptionsTabCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_aceEditorCtrl) {
      AceEditorCtrl = _aceEditorCtrl.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      OptionsTabCtrl = function (_AceEditorCtrl) {
        _inherits(OptionsTabCtrl, _AceEditorCtrl);

        function OptionsTabCtrl($scope, $injector, $rootScope, templateSrv) {
          _classCallCheck(this, OptionsTabCtrl);

          return _possibleConstructorReturn(this, (OptionsTabCtrl.__proto__ || Object.getPrototypeOf(OptionsTabCtrl)).call(this, $scope, $injector, $rootScope, templateSrv));
        }

        _createClass(OptionsTabCtrl, [{
          key: 'setValue',
          value: function setValue(val) {
            this.panel.eoptions = val;
          }
        }, {
          key: 'getValue',
          value: function getValue() {
            return this.panel.eoptions;
          }
        }], [{
          key: 'buildDirective',
          value: function buildDirective() {
            return function () {
              return {
                restrict: 'E',
                scope: true,
                templateUrl: 'public/plugins/grafana-echart-panel/optionsTab.html',
                controller: OptionsTabCtrl
              };
            };
          }
        }]);

        return OptionsTabCtrl;
      }(AceEditorCtrl);

      _export('default', OptionsTabCtrl);
    }
  };
});
//# sourceMappingURL=optionsTab.js.map
