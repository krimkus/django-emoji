/**
 * This class makes a textarea supporting emojis (WYSIWYG)
 * Copyright (c) 2015 LaCodon
 * 
 * Licensed under the MIT License.
 * 
 * @author Fabian Maier <fabian.maier@lacodon.de>
 */

/**
 * The default EmojiPicker settings.
 */
var EmojiPickerSettings = {
    path: '',
    prefix: ''
};

/* Find the cursor position */
function getCaret(el) { 
  if (el.selectionStart) { 
    return el.selectionStart; 
  } else if (document.selection) { 
    el.focus(); 

    var r = document.selection.createRange(); 
    if (r == null) { 
      return -1; 
    } 

    var re = el.createTextRange(), 
        rc = re.duplicate(); 
    re.moveToBookmark(r.getBookmark()); 
    rc.setEndPoint('EndToStart', re); 

    return rc.text.length; 
  }  
  return -1; 
}

/**
 * Create the EmojiPicker menu and prepare the WYSIWYG div.
 * @returns {EmojiPicker}
 */
var EmojiPicker = function (icons) {
    this.icons = icons;
    this.editor = document.getElementsByClassName('emojitextareawidget')[0];
    this.editor.id = 'emojiArea';
    this.editor.setAttributeNode(document.createAttribute('contenteditable'));

    if (EmojiPickerSettings.path.length && EmojiPickerSettings.path.charAt(EmojiPickerSettings.path.length - 1) !== '/') {
        EmojiPickerSettings.path += '/';
    }

    this.createMenu();

};

/**
 * Create and show the emoji menu.
 */
EmojiPicker.prototype.createMenu = function () {
    this.menu = document.createElement('div');
    this.iconContainer = document.createElement('div');
    this.menu.appendChild(this.iconContainer);
    this.addAttribute(this.menu, 'id', 'emojiMenu');
    this.hide(this.menu);
    this.menuDisplay = false;
    var parent = this.editor.parentNode;

    this.menuButton = document.createElement('button');
    this.addAttribute(this.menuButton, 'id', 'emojiMenuBtn');
    var buttonContainer = document.createElement('div');
    this.addAttribute(buttonContainer, 'id', 'emojiMenuBtnWrapper');
    buttonContainer.appendChild(this.menuButton);
    buttonContainer.appendChild(this.menu);

    parent.insertBefore(buttonContainer, this.editor);
    this.loadEmojisIntoMenu();

    this.menuButton.addEventListener('click', function (event) {
        EmojiPicker.prototype.show(document.getElementById('emojiMenu'));
        event.preventDefault();
    });

    this.editor.addEventListener('click', function (event) {
        EmojiPicker.prototype.hide(document.getElementById('emojiMenu'));
        event.preventDefault();
    });
};

EmojiPicker.prototype.loadEmojisIntoMenu = function () {
    for (var key in this.icons) {
        var icon = document.createElement('a');
        this.addAttribute(icon, 'href', 'javascript:void(EmojiPicker.prototype.emoji_click("' + key + '"))');
        this.addAttribute(icon, 'title', key);
        icon.appendChild(this.createIcon(key));
        this.iconContainer.appendChild(icon);
    }
};

EmojiPicker.prototype.emoji_click = function (emoji) {
    var editor = document.getElementById('emojiArea');
    var caretPositition = getCaret(editor);
    if (caretPositition == -1) {
        editor.value += " :"+emoji+": ";
    } else {
        editor.value = editor.value.substring(0, caretPositition) + " :"+emoji+": " + editor.value.substring(caretPositition);
    }
};

EmojiPicker.prototype.getCaretPosition = function (editableDiv) {
    var caretPos = 0,
            sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode === editableDiv) {
                caretPos = range.endOffset;
            }
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() === editableDiv) {
            var tempEl = document.createElement('span');
            editableDiv.insertBefore(tempEl, editableDiv.firstChild);
            var tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint('EndToEnd', range);
            caretPos = tempRange.text.length;
        }
    }
    return caretPos;
};

EmojiPicker.prototype.addAttribute = function (el, name, value) {
    var attr = document.createAttribute(name);
    attr.value = value;
    el.setAttributeNode(attr);
};

EmojiPicker.prototype.show = function (el) {
    this.removeClass(el, 'hidden');
    this.addClass(el, 'visible');
};

EmojiPicker.prototype.hide = function (el) {
    this.removeClass(el, 'visible');
    this.addClass(el, 'hidden');
};

EmojiPicker.prototype.addClass = function (el, cls) {
    el.classList.add(cls);
};

EmojiPicker.prototype.removeClass = function (el, cls) {
    el.classList.remove(cls);
};

/**
 * Get img tag for given emoji.
 * @param {String} emoji The emoji identifier
 * @returns {Element} The img tag
 */
EmojiPicker.prototype.createIcon = function (emoji) {
    var filename = this.icons[emoji];
    var path = EmojiPickerSettings.path;
    var imgTag = document.createElement('img');
    imgTag.innerHTML = ':' + emoji + ':';
    this.addAttribute(imgTag, 'src', path + filename);
    this.addAttribute(imgTag, 'alt', emoji);
    return imgTag;
};

/**
 * This function returns the editor's content.
 * @returns {String} The text without HTML tags
 */
EmojiPicker.prototype.getValue = function () {
    return document.getElementById('emojiArea').textContent;
};

/**
 * Reconverts a text from getValue() into HTML useable code.
 * @param {String} text The string with :emoji: elements
 * @returns {String} The HTML code
 */
EmojiPicker.prototype.render = function (text) {
    return text.replace(/:([^{\s::}]*):/g, function (a, b) {
        var r = this.icons[b];
        return typeof r === 'string' ? '<img src="' + r + '" alt="emoji">' : a;
    });
};


if($) {
    $.getJSON('/emoji/all.json', function(data) {
        var ep = new EmojiPicker(data);
    });
}