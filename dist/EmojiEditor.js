"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _Converters = require("./Converters");

var _Converters2 = _interopRequireDefault(_Converters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

"use strict";

var EmojiEditor = function () {

    /**
     *
     * @param {HTMLElement|HTMLTextAreaElement|HTMLInputElement} input
     * @param {Boolean} prevent_new_line
     */
    function EmojiEditor(input) {
        var prevent_new_line = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, EmojiEditor);

        /**
         *
         * @type {HTMLElement|HTMLTextAreaElement|HTMLInputElement}
         * @private
         */
        this._input = input;

        /**
         * @type {Boolean}
         * @private
         */
        this._is_content_editable = this.isContentEditable(input);

        /**
         *
         * @type {Range|undefined}
         */
        this.cursor_position = undefined;

        /**
         *
         * @type {boolean}
         */
        this.prevent_new_line = prevent_new_line;

        this._trackCursor();
        this._onPaste();
    }

    /**
     * Check if an input element is contenteditable.
     *
     * (IE11 marks textareas as contenteditable (!))
     * @param {HTMLElement|HTMLTextAreaElement|HTMLInputElement} element
     */


    _createClass(EmojiEditor, [{
        key: "isContentEditable",
        value: function isContentEditable(element) {
            var tag = element.nodeName;
            return element.isContentEditable && tag !== "INPUT" && tag !== "TEXTAREA";
        }

        /**
         * Pastes an emoji at the caret taking into account whether the element
         * is contenteditable or not.
         *
         * @param {Emoji} emoji
         */

    }, {
        key: "placeEmoji",
        value: function placeEmoji(emoji) {
            this._input.focus();
            if (this.cursor_position) {
                EmojiEditor.restoreSelection(this.cursor_position);
            }
            if (this._is_content_editable) {
                var node = void 0;
                if (EmojiEditor.supportsUnified()) {
                    node = EmojiEditor.pasteTextAtCaret(emoji.getCharacter());
                    EmojiEditor.selectElement(node);
                } else {
                    node = EmojiEditor.pasteHtml(emoji.getHtml());
                }
                (0, _jquery2.default)(this._input).trigger('change', [true]).trigger('input', [true]);
                return node;
            } else {
                var text = emoji.getCharacter();
                var ret = this.pasteInputText(text);
                (0, _jquery2.default)(this._input).trigger('change', [true]).trigger('input', [true]);
                return ret;
            }
        }

        /**
         * Pastes text at the cursor while preserving cursor position.
         *
         * @param text
         * @return {String}
         */

    }, {
        key: "pasteInputText",
        value: function pasteInputText(text) {
            var cursor_position = this._input.selectionStart;
            var current_length = this._input.value.length;
            this._input.value = this._input.value.substr(0, cursor_position) + text + this._input.value.substr(cursor_position);

            this.setInputCaretPosition(cursor_position + this._input.value.length - current_length);
            return text;
        }

        /**
         * Sets the caret position on a textarea or input[type=text] field
         *
         *
         * @param position
         * @returns {boolean}
         */

    }, {
        key: "setInputCaretPosition",
        value: function setInputCaretPosition(position) {
            if (this._input.createTextRange) {
                var range = this._input.createTextRange();
                range.move('character', position);
                range.select();
                return true;
            } else {
                if (this._input.selectionStart || this._input.selectionStart === 0) {
                    this._input.focus();
                    this._input.setSelectionRange(position, position);
                    return true;
                }
                //Otherwise this method failed (browser not supported)
                else {
                        this._input.focus();
                        return false;
                    }
            }
        }

        /**
         * Gets the text from the input
         *
         * @returns {*}
         */

    }, {
        key: "getText",
        value: function getText() {
            if (this._is_content_editable) {
                return this._mapElement(this._input).replace(/[\u200B-\u200D\uFEFF]/g, '');
            }

            return _Converters2.default.withUnified().replace_colons(this._input.value);
        }

        /**
         * Empty the input's contents.
         */

    }, {
        key: "empty",
        value: function empty() {
            if (this._is_content_editable) {
                this._input.innerHTML = "";
            } else {
                this._input.value = "";
            }
        }
        /**
         * Intercepts paste events for contenteditable divs so that we don't get
         * any of the special html that gets inserted automatically.
         *
         * @returns {EmojiEditor}
         * @private
         */

    }, {
        key: "_onPaste",
        value: function _onPaste() {
            if (this._is_content_editable) {
                (0, _jquery2.default)(this._input).off('paste.editable').on('paste.editable', function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    var clipboard_data = event.originalEvent.clipboardData || window.clipboardData;
                    var pasted_data = clipboard_data.getData('text');
                    var text = EmojiEditor.pasteTextAtCaret(pasted_data);
                    EmojiEditor.selectElement(text);
                });
            }

            return this;
        }

        /**
         * Get all of the child nodes in an input
         *
         * @returns {Array<Node>}
         */

    }, {
        key: "getNodes",
        value: function getNodes() {
            return Array.prototype.slice.call(this._input.childNodes);
        }

        /**
         * Selects the last node in the input.
         */

    }, {
        key: "selectLastNode",
        value: function selectLastNode() {
            var nodes = this.getNodes();
            if (nodes.length) {
                EmojiEditor.selectElement(nodes[nodes.length - 1]);
                this.cursor_position = EmojiEditor.saveSelection();
            }
        }

        /**
         * Extracts just text and emojis from a contenteditable element
         *
         * @param {HTMLElement} el
         * @private
         */

    }, {
        key: "_mapElement",
        value: function _mapElement(el) {
            var _this = this;

            var children = Array.prototype.slice.call(el.childNodes);

            return children.map( /**Text|HTMLElement*/function (node) {

                var is_text = node instanceof Text;
                var is_html = node instanceof HTMLElement;

                //Return all text from text nodes
                if (is_text) {
                    return node.textContent;
                }
                //Extract codepoints from span
                else if (is_html && node.tagName === "SPAN") {
                        return EmojiEditor._extractSpan(node);
                    }

                    //Extract codepoints from an image if it was supplied
                    else if (is_html && node.tagName === "IMG") {
                            return EmojiEditor._extractImage(node);
                        }

                        //Convert br tags to line breaks
                        else if (is_html && node.tagName === "BR") {
                                return "\n";
                            }

                            //if the element is not html we're accounting for run it back through this function
                            else if (is_html) {
                                    return _this._mapElement(node);
                                } else {
                                    //Unaccounted for situation - just return a blank string
                                    return "";
                                }
            }).join("");
        }

        /**
         * Tracks the cursor position and monitors the enter button in case prevent_new_line is true
         *
         * @returns {EmojiEditor}
         * @private
         */

    }, {
        key: "_trackCursor",
        value: function _trackCursor() {
            var _this2 = this;

            if (this._is_content_editable) {
                (0, _jquery2.default)(this._input).off('keyup.emoji mouseup.emoji').on('keyup.emoji mouseup.emoji', function () {
                    _this2.cursor_position = EmojiEditor.saveSelection();
                });

                (0, _jquery2.default)(this._input).off('keydown.emoji').on('keydown.emoji', function (event) {
                    if (event.which === 13 && _this2.prevent_new_line) {
                        event.preventDefault();
                    }
                });
            }

            return this;
        }
        /**
         * Extracts the text content from a contenteditable and extracts any spans.
         *
         * @param span
         * @returns {String}
         * @private
         */

    }, {
        key: "replaceUnified",


        /**
         * Replaces unified unicode inside of a contenteditable element with
         * platform appropriate content.
         *
         */
        value: function replaceUnified() {

            if (this._is_content_editable) {
                var converter = _Converters2.default.withEnvironment();
                var html = converter.replace_unified(this._input.innerHTML);
                EmojiEditor.selectElementContents(this._input);
                var node = EmojiEditor.pasteHtml(html);
                if (node) {
                    EmojiEditor.selectElement(node);
                }
            } else {
                throw new Error("The replaceUnified method should only be called on contenteditable elements.");
            }
        }

        /**
         * Determines if the environment supports unified unicode.
         *
         * @returns {boolean}
         */

    }], [{
        key: "_extractSpan",
        value: function _extractSpan(span) {
            var $span = (0, _jquery2.default)(span);
            var $inner = $span.find('.emoji-inner');
            //If the span was not inserted by the emoji picker
            if (!$inner.length) {
                return "";
            }
            //If the span was inserted by the emoji picker, get the codepoints and return the corresponding character
            try {
                var codepoint = $inner.data('codepoints');
                return EmojiEditor.parseCodepoints(codepoint);
            } catch (err) {
                return "";
            }
        }

        /**
         * Extracts codepoints from an image if it exists.
         *
         * @param {HTMLElement} img
         * @private
         */

    }, {
        key: "_extractImage",
        value: function _extractImage(img) {
            if (img.hasAttribute('data-codepoints')) {
                return EmojiEditor.parseCodepoints(img.getAttribute('data-codepoints'));
            }

            return "";
        }

        /**
         * Parses codepoints that may come in the format
         * `hex`-`hex` rather than just `hex`
         *
         * @param codepoints
         * @returns {string}
         */

    }, {
        key: "parseCodepoints",
        value: function parseCodepoints(codepoints) {

            if (/-/g.test(codepoints)) {
                var arr = codepoints.split("-");
                var one = "0x" + arr[0];
                var two = "0x" + arr[1];
                return String.fromCodePoint(one, two);
            }

            return String.fromCodePoint("0x" + codepoints);
        }
    }, {
        key: "supportsUnified",
        value: function supportsUnified() {
            return _Converters2.default.withEnvironment().replace_mode === "unified";
        }

        /**
         * Shortcut to paste html at the caret with a dummy unicode character.
         *
         * @param html
         */

    }, {
        key: "pasteHtml",
        value: function pasteHtml(html) {
            return EmojiEditor.pasteHtmlAtCaret(html + "&#8203;");
        }
        /**
         * saves the position of the cursor in a contenteditable div
         *
         * Credit goes to Tim Down here
         *
         * @returns {Range|null}
         */

    }, {
        key: "saveSelection",
        value: function saveSelection() {
            if (window.getSelection) {
                var sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    return sel.getRangeAt(0);
                }
            } else if (document.selection && document.selection.createRange) {
                return document.selection.createRange();
            }
            return null;
        }

        /**
         * Restores the selection using a Range object
         *
         * Credit goes to Tim Down here
         *
         * @param {Range} range
         */

    }, {
        key: "restoreSelection",
        value: function restoreSelection(range) {
            if (range) {
                if (window.getSelection) {
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.selection && range.select) {
                    range.select();
                }
            }
        }

        /**
         * Pastes text at the caret position
         *
         * Credit goes to Tim Down here
         *
         * @param text
         * @returns {Text}
         */

    }, {
        key: "pasteTextAtCaret",
        value: function pasteTextAtCaret(text) {
            var sel = void 0,
                range = void 0;
            var node = document.createTextNode(text);
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(node);
                }
            } else if (document.selection && document.selection.createRange) {
                document.selection.createRange().text = node.textContent;
            }

            return node;
        }

        /**
         * Selects an element an optionally highlights it. If it doesn't highlight,
         * it just drops the cursor at the end of the element.
         *
         *
         * Credit goes to Tim Down here
         *
         * @param element
         * @param highlight
         */

    }, {
        key: "selectElement",
        value: function selectElement(element) {
            var highlight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
                var range = document.createRange();
                range.selectNodeContents(element);
                if (!highlight) {
                    range.collapse(false);
                }
                sel.addRange(range);
            } else if (document.selection) {
                var text_range = document.body.createTextRange();
                text_range.moveToElementText(element);
                text_range.select();
            }
        }

        /**
         * Pastes html at the caret. Note that to do this without placing the
         * cursor inside of the html you need to add a dummy unicode character.
         * For our purposes we'll add the 0-width space and then strip it out when we parse the output
         *
         * Credit goes to Tim Down here
         *
         * @param html
         * @param select_pasted_content
         * @returns {*}
         */

    }, {
        key: "pasteHtmlAtCaret",
        value: function pasteHtmlAtCaret(html, select_pasted_content) {
            var sel = void 0,
                range = void 0;
            if (window.getSelection) {
                //IE9+ and non-IE
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();

                    var el = document.createElement("div");
                    el.innerHTML = html;
                    var frag = document.createDocumentFragment(),
                        node = void 0,
                        last_node = void 0;
                    while (node = el.firstChild) {
                        last_node = frag.appendChild(node);
                    }

                    var first_node = frag.firstChild;
                    range.insertNode(frag);

                    //Preserve the selection
                    if (last_node) {
                        range = range.cloneRange();
                        range.setStartAfter(last_node);
                        if (select_pasted_content) {
                            range.setStartBefore(first_node);
                        } else {
                            range.collapse(false);
                        }
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }

                    return first_node;
                }
            } else if ((sel = document.selection) && sel.type != "Control") {
                // IE < 9
                var original_range = sel.createRange();
                original_range.collapse(true);
                sel.createRange().pasteHTML(html);
                if (select_pasted_content) {
                    range = sel.createRange();
                    range.setEndPoint("StartToStart", original_range);
                    range.select();
                }
            }
        }

        /**
         * Selects the contents of an element.
         *
         *
         * Credit goes to Tim Down here
         *
         * @param el
         */

    }, {
        key: "selectElementContents",
        value: function selectElementContents(el) {
            var range = document.createRange();
            range.selectNodeContents(el);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }]);

    return EmojiEditor;
}();

exports.default = EmojiEditor;
//# sourceMappingURL=EmojiEditor.js.map