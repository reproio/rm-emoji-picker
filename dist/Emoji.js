"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Converters = require("./Converters");

var _Converters2 = _interopRequireDefault(_Converters);

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _defaults = require("./defaults");

var _defaults2 = _interopRequireDefault(_defaults);

require("./polyfills");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Emoji = function () {
  _createClass(Emoji, null, [{
    key: "factory",
    value: function factory(data, category, callback) {
      var emoji = new Emoji(data, category);
      emoji.setCallback(callback);
      return emoji;
    }
  }, {
    key: "randomIntFromInterval",


    /**
     * @link http://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
     * @param min
     * @param max
     * @returns {number}
     */
    value: function randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  }, {
    key: "random_color",
    get: function get() {
      var colors = ["blue", "yellow", "green", "orange", "indigo", "pink"];
      return colors[Emoji.randomIntFromInterval(0, colors.length - 1)];
    }
  }]);

  function Emoji(data, category) {
    _classCallCheck(this, Emoji);

    /**
     * @type {Boolean}
     */
    this.has_apple_img = data['has_img_apple'];

    /**
     * @type {Boolean}
     */
    this.has_google_img = data['has_img_google'];

    /**
     * @type {Boolean}
     */
    this.has_twitter_img = data['has_img_twitter'];

    /**
     * @type {Boolean}
     */
    this.has_emojione_img = data['has_img_emojione'];

    /**
     * @type {String} - the name of the category
     */
    this.category = category;

    /**
     * @type {String}
     */
    this.full_name = data['name'];

    /**
     * @type {String}
     */
    this.short_name = data['short_name'];

    /**
     * @type {String[]}
     */
    this.short_names = data['short_names'];

    /**
     * @type {Number}
     */
    this.sort_order = data['sort_order'];

    /**
     * @type {String}
     */
    this.hover_color = Emoji.random_color;

    /**
     * Gets the emoji for the
     * @type {string}
     */
    this.$emoji = this.getEmojiForPlatform();

    /**
     * Callback executed when the emoji was clicked
     *
     * @type {Function|undefined}
     * @private
     */
    this._bubble = undefined;
    //Set a click listener on the emoji
    this._onClick()._onHover();
  }

  /**
   * Getter for the emoji's colon syntax
   *
   * @returns {string}
   */


  _createClass(Emoji, [{
    key: "getColons",
    value: function getColons() {
      return ":" + this.short_name + ":";
    }

    /**
     * Getter for the unicode emoji
     *
     * @returns {string}
     */

  }, {
    key: "getUnified",
    value: function getUnified() {
      return _Converters2.default.withUnified().replace_colons(this.getColons());
    }

    /**
     * Gets the image representation of an emoji
     *
     * @returns {string}
     */

  }, {
    key: "getImage",
    value: function getImage() {
      return _Converters2.default.withImage().replace_colons(this.getColons());
    }

    /**
     * @return {String} Codepoints for the emoji
     */

  }, {
    key: "getCodepoints",
    value: function getCodepoints() {
      var $image = (0, _jquery2.default)(this.getImage());
      if ($image.hasClass('emoji-inner')) {
        return $image.data('codepoints');
      }

      return $image.find('.emoji-inner').data('codepoints');
    }

    /**
     * Getter for the emoji character regardless of the platform.
     *
     * @returns {string}
     */

  }, {
    key: "getCharacter",
    value: function getCharacter() {
      var codepoints = this.getCodepoints();
      if (/-/g.test(codepoints)) {
        var arr = codepoints.split("-");
        var one = "0x" + arr[0];
        var two = "0x" + arr[1];
        return String.fromCodePoint(one, two);
      }
      return String.fromCodePoint("0x" + codepoints);
    }

    /**
     * Determines if the environment supports unified unicode.
     *
     * @returns {boolean}
     */

  }, {
    key: "getEmojiForPlatform",


    /**
     * Gets the platform-appropriate representation of the emoji.
     *
     * @return {string|jQuery}
     */
    value: function getEmojiForPlatform() {

      var emote = _Converters2.default.withEnvironment().replace_colons(this.getColons());

      return this._getWrapper().append(this.getCharacter());
    }

    /**
     *
     * @returns {*}
     */

  }, {
    key: "getPreview",
    value: function getPreview() {
      var emote = _Converters2.default.withEnvironment().replace_colons(this.getColons());

      return this._getPreviewWrapper().append(emote);
    }

    /**
     * Getter for the class' markup
     *
     * @returns {string}
     */

  }, {
    key: "getMarkup",
    value: function getMarkup() {
      return this.$emoji;
    }

    /**
     * Gets the html of an emoji for things like pasting
     * raw html into the contenteditable.
     *
     * @return {String}
     */

  }, {
    key: "getHtml",
    value: function getHtml() {
      return this.$emoji.get(0).innerHTML;
    }

    /**
     * Sets the callback that gets executed when the emoji gets clicked
     *
     * @param {Function} callback
     * @returns {Emoji}
     */

  }, {
    key: "setCallback",
    value: function setCallback(callback) {
      this._bubble = callback;
      return this;
    }

    /**
     *
     * @param regexp
     * @returns {undefined|String}
     */

  }, {
    key: "matchesSearchTerm",
    value: function matchesSearchTerm(regexp) {
      return this.short_names.find(function (name) {
        return regexp.test(name);
      });
    }

    /**
     * Gets the wrapper for the emoji
     *
     * @returns {jQuery|HTMLElement}
     * @private
     */

  }, {
    key: "_getWrapper",
    value: function _getWrapper() {
      return (0, _jquery2.default)("<span class = \"emoji-char-wrapper " + this.hover_color + "\" data-name=\"" + this.full_name + "\" data-category=\"" + this.category + "\"></span>");
    }

    /**
     * Gets the wrapper for the preview
     *
     * @returns {jQuery|HTMLElement}
     * @private
     */

  }, {
    key: "_getPreviewWrapper",
    value: function _getPreviewWrapper() {
      return (0, _jquery2.default)("<span class = \"emoji-preview-wrapper " + this.hover_color + "\" data-name=\"" + this.full_name + "\" data-category=\"" + this.category + "\"></span>");
    }

    /**
     *
     * @returns {Emoji}
     * @private
     */

  }, {
    key: "_onClick",
    value: function _onClick() {
      var _this = this;

      (0, _jquery2.default)(this.$emoji).off('click.emoji').on('click.emoji', function (event) {
        if (_this._bubble) {
          _this._bubble(_defaults2.default.events.SELECTED, _this);
        }
      });

      return this;
    }

    /**
     *
     * @returns {Emoji}
     * @private
     */

  }, {
    key: "_onHover",
    value: function _onHover() {
      var _this2 = this;

      (0, _jquery2.default)(this.$emoji).off('mouseenter.emoji').on('mouseenter.emoji', function () {
        _this2._bubble(_defaults2.default.events.EMOJI_MOUSEENTER, _this2);
      }).off('mouseleave.emoji').on('mouseleave.emoji', function () {
        _this2._bubble(_defaults2.default.events.EMOJI_MOUSELEAVE, _this2);
      });

      return this;
    }
  }], [{
    key: "supportsUnified",
    value: function supportsUnified() {
      return _Converters2.default.withEnvironment().replace_mode === "unified";
    }
  }]);

  return Emoji;
}();

exports.default = Emoji;
//# sourceMappingURL=Emoji.js.map