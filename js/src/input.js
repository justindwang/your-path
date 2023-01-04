(function(root) {
    'use strict';

    /**
    * Helper for binding user key input to actions.
    * @class Input
    * @constructor
    * @param {Function} onKeyAction - Function called when a key bound to an action is pressed (function(action){}).
    * @param {Object} bindings - An object of key val pairs mapping an action to an array of keys that trigger it. Input.Keys is used to convert input key string names to key codes.
    * @param bindings.action1 {Array} Input keys mapped to action1. ['A', 'B', ...]
    * @param bindings.action2 {Array} Input keys mapped to action2. ['X', 'Y', ...]
    * @param bindings....
    * @example
        //bindings param example:
        {
            up: ['UP_ARROW'],
            down: ['DOWN_ARROW'],
            left: ['LEFT_ARROW'],
            right: ['RIGHT_ARROW'],
        }
    */
    var Input = function Input(onKeyAction, bindings) {
        this.bindings = {};
        if (onKeyAction !== void 0) {
            this.onKeyAction = onKeyAction;
        }
        if (bindings !== void 0) {
            this.addBindings(bindings);
        }
        this.startListening();
    };

    Input.prototype = {
        constructor: Input,

        /**
        * An object of key val pairs mapping keyCode to action
        * @property bindings
        * @type Object
        */
        bindings: null,

        /**
        * Function called when a key bound to an action is pressed (function(action){}).
        * @property onKeyAction
        * @type Function
        */
        onKeyAction: null,

        /**
        * Bind a user action to a key input
        * @method bindAction
        * @param {String} action - The action to bind the key to.
        * @param {String} keyName - The keyname to bind the action to. @see Input.Keys
        */
        bindAction: function(action, keyName) {
            var keyCode = Input.Keys[keyName];
            this.bindings[keyCode] = action;
        },

        unbindAction: function(keyName) {
            var keyCode = Input.Keys[keyName];
            delete this.bindings[keyCode];
        },

        /**
        * Converts a user input key code to an action bound to that key or false if none is bound.
        * @method getActionFromKeyCode
        * @param {String} keyCode - The key code to retrieve an action bound to.
        * @return String|bool The action bound to the keyCode or false.
        */
        getActionFromKeyCode: function(keyCode) {
            if (keyCode in this.bindings) {
                return this.bindings[keyCode];
            }
            return false;
        },


        /**
        * Loads multiple action key bindings
        * @method addBindings
        * @param {Object} bindings - An object of key val pairs mapping an action to an array of keys that trigger it. Input.Keys is used to convert input key string names to key codes.
        * @param bindings.action1 {Array} Input keys mapped to action1. ['A', 'B', ...]
        * @param bindings.action2 {Array} Input keys mapped to action2. ['X', 'Y', ...]
        * @param bindings....
        * @example
            //bindings param example:
            {
                up: ['UP_ARROW'],
                down: ['DOWN_ARROW'],
                left: ['LEFT_ARROW'],
                right: ['RIGHT_ARROW'],
            }
        */
        addBindings: function(bindings) {
            for (var action in bindings) {
                var keys = bindings[action];
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var keyCode = Input.Keys[key];
                    if(!this.bindings.hasOwnProperty(keyCode))
                        this.bindAction(action, key);
                }
            }
        },

        removeBindings: function(bindings) {
            for (var action in bindings) {
                var keys = bindings[action];
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var keyCode = Input.Keys[key];
                    if(this.bindings.hasOwnProperty(keyCode))
                        this.unbindAction(key);
                }
            }
        },

        /**
        * Event handler for document.addEventListener('keydown', this). Triggered when a key is pressed.
        * If an action is bound to the key pressed, false is returned to cancel the default browser behavior of the keypress.
        * If an action is not bound to the key pressed, true is returned allowing the default browser behavior of the keypress to function.
        * @method handleEvent
        * @param {Object} event - The onkeydown event.
        * @return bool
        */
        handleEvent: function(event) {
            // ignore if modifer keys pressed
            if(event.ctrlKey || event.shiftKey || event.altKey || event.metaKey){
                return true;
            }
            var keyCode = event.keyCode;
            var action = this.getActionFromKeyCode(keyCode);
            // if no action bound to this keycode resolve the keydown event normally
            if (action === false) {
                return true;
            }
            // call onKeyAction callback with the action matched
            this.onKeyAction(action);

            // cancel default browser keypress behavior
            event.preventDefault();
            return false;
        },

        /**
        * Binds event listener for document keydown event.
        * @method startListening
        */
        startListening: function(){
            document.addEventListener('keydown', this);
        },

        /**
        * Unbinds document keydown event listener
        * @method stopListening
        */
        stopListening: function(){
            document.removeEventListener('keydown', this);
        },

        // added by rio
        prInventoryClicked: function() {
            var inv = document.getElementById("inventory-window");
            var shop = document.getElementById("shop-window");
            var stats = document.getElementById("stats-window");
            inv.style.display = "block";
            shop.style.display = "none";
            stats.style.display = "none";
            console.log('bruh');
        },

        prShopClicked: function() {
            var inv = document.getElementById("inventory-window");
            var shop = document.getElementById("shop-window");
            var stats = document.getElementById("stats-window");
            inv.style.display = "none";
            shop.style.display = "block";
            stats.style.display = "none";
            console.log('bruh');
        },

        prStatsClicked: function() {
            var inv = document.getElementById("inventory-window");
            var shop = document.getElementById("shop-window");
            var stats = document.getElementById("stats-window");
            inv.style.display = "none";
            shop.style.display = "none";
            stats.style.display = "block";
            console.log('bruh');
        },
    };

    /**
    * @static
    * @property Keys
    * @type {Object}
    */
    Input.Keys = {
        'BACKSPACE': 8,
        'tab': 9,
        'ENTER': 13,
        'PAUSE': 19,
        'CAPS': 20,
        'ESC': 27,
        'space': 32,
        'PAGE_UP': 33,
        'PAGE_DOWN': 34,
        'END': 35,
        'HOME': 36,
        '←': 37,
        '↑': 38,
        '→': 39,
        '↓': 40,
        'INSERT': 45,
        'DELETE': 46,
        '0': 48,
        '1': 49,
        '2': 50,
        '3': 51,
        '4': 52,
        '5': 53,
        '6': 54,
        '7': 55,
        '8': 56,
        '9': 57,
        'A': 65,
        'B': 66,
        'C': 67,
        'D': 68,
        'E': 69,
        'F': 70,
        'G': 71,
        'H': 72,
        'I': 73,
        'J': 74,
        'K': 75,
        'L': 76,
        'M': 77,
        'N': 78,
        'O': 79,
        'P': 80,
        'Q': 81,
        'R': 82,
        'S': 83,
        'T': 84,
        'U': 85,
        'V': 86,
        'W': 87,
        'X': 88,
        'Y': 89,
        'Z': 90,
        'NUMPAD_0': 96,
        'NUMPAD_1': 97,
        'NUMPAD_2': 98,
        'NUMPAD_3': 99,
        'NUMPAD_4': 100,
        'NUMPAD_5': 101,
        'NUMPAD_6': 102,
        'NUMPAD_7': 103,
        'NUMPAD_8': 104,
        'NUMPAD_9': 105,
        'MULTIPLY': 106,
        'ADD': 107,
        'SUBSTRACT': 109,
        'DECIMAL': 110,
        'DIVIDE': 111,
        'F1': 112,
        'F2': 113,
        'F3': 114,
        'F4': 115,
        'F5': 116,
        'F6': 117,
        'F7': 118,
        'F8': 119,
        'F9': 120,
        'F10': 121,
        'F11': 122,
        'F12': 123,
        'SHIFT': 16,
        'CTRL': 17,
        'ALT': 18,
        'PLUS': 187,
        'COMMA': 188,
        'MINUS': 189,
        'PERIOD': 190,
        'BACK_TICK': 192,
        'LEFT_BRACKET': 219,
        'RIGHT_BRACKET': 221
    };

    root.RL.Input = Input;

}(this));
