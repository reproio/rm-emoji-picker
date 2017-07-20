"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Emoji = require("./Emoji");

var _Emoji2 = _interopRequireDefault(_Emoji);

var _category = require("./../views/category.mustache");

var _category2 = _interopRequireDefault(_category);

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EmojiCategory = function () {
    _createClass(EmojiCategory, null, [{
        key: "factory",


        /**
         * Factory function that initializes the class with a callback
         *
         * @param {Object} cat
         * @param {Object} data
         * @param {Function} callback
         * @returns {EmojiCategory}
         */
        value: function factory(cat, data, callback) {
            var category = new EmojiCategory(cat, data);
            category.setCallback(callback);
            return category;
        }
    }]);

    function EmojiCategory(category, data) {
        var _this = this;

        _classCallCheck(this, EmojiCategory);

        /**
         * @type {string}
         */
        this.title = category.title;

        /**
         *
         * @type {string}
         */
        this.icon = category.icon;

        /**
         * @type {Array<Emoji>}
         */
        this.emojis = data.map(function (emote) {
            return _Emoji2.default.factory(emote, _this.title, _this._onEvent.bind(_this));
        }).sort(function (a, b) {
            return a.sort_order - b.sort_order;
        });

        /**
         * Markup for the
         */
        this.$category = this.getMarkup();

        /**
         * @type {jQuery}
         */
        this.$title = this.$category.find('.category-title');

        /**
         * Callback that executes when an emoji gets selected
         *
         * @type {Function|undefined}
         * @private
         */
        this._callback = undefined;

        var _search_term = "";
        Object.defineProperty(this, 'search_term', {
            get: function get() {
                return _search_term;
            },
            set: function set(value) {
                if (_search_term !== value) {
                    _search_term = value;
                    _this._search();
                }
            }
        });

        this._clearSearch();
    }

    _createClass(EmojiCategory, [{
        key: "exportContents",


        /**
         * Exports the main contents for the category
         *
         * @returns {{title: string, icon: string}}
         */
        value: function exportContents() {
            return {
                title: this.title,
                icon: this.icon
            };
        }
    }, {
        key: "getMarkup",
        value: function getMarkup() {
            if (this.$category) {
                return this.$category;
            }

            var $category = (0, _jquery2.default)((0, _category2.default)({
                title: this.title
            }));

            var $content = $category.find('.category-content');

            this.emojis.forEach(function (emoji) {
                $content.append(emoji.getMarkup());
            });

            return $category;
        }

        /**
         * Carries an event from the Emoji to the EmojiPicker instance.
         *
         * @param action
         * @param emoji
         * @private
         */

    }, {
        key: "_onEvent",
        value: function _onEvent(action, emoji) {
            if (this._callback) {
                this._callback(action, emoji, this);
            }
        }

        /**
         *
         * @param {Function} callback
         * @returns {EmojiCategory}
         */

    }, {
        key: "setCallback",
        value: function setCallback(callback) {
            this._callback = callback;
            return this;
        }

        /**
         * Show/hide emojis based on a search term
         * @private
         */

    }, {
        key: "_search",
        value: function _search() {
            var _this2 = this;

            if (this.search_term.trim().length === 0) {
                this._clearSearch();
            } else {
                this.$title.addClass('inactive');
                var regexp = new RegExp(this.search_term.toLowerCase());
                this.emojis.forEach(function (emoji) {
                    if (_this2._canShowEmoji(emoji) && emoji.matchesSearchTerm(regexp)) {
                        emoji.$emoji.show();
                    } else {
                        emoji.$emoji.hide();
                    }
                });
            }
        }

        /**
         * Clear the effects of the search
         *
         * @returns {EmojiCategory}
         * @private
         */

    }, {
        key: "_clearSearch",
        value: function _clearSearch() {
            var _this3 = this;

            this.$title.removeClass('inactive');
            this.emojis.forEach(function (emoji) {
                if (_this3._canShowEmoji(emoji)) {
                    emoji.$emoji.hide();
                } else {
                    emoji.$emoji.show();
                }
            });

            return this;
        }
    }, {
        key: "_canShowEmoji",
        value: function _canShowEmoji(emoji) {
            return emoji.getUnified().length > 4;
        }
    }, {
        key: "offset_top",
        get: function get() {
            return this.$category.get(0).offsetTop;
        }
    }]);

    return EmojiCategory;
}();

exports.default = EmojiCategory;
//# sourceMappingURL=EmojiCategory.js.map