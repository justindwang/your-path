(function(root) {
    'use strict';

    var DIRECTIONS_TO_OFFSETS = {
        up:           {x:  0, y: -1},
        up_right:     {x:  1, y: -1},
        right:        {x:  1, y:  0},
        down_right:   {x:  1, y:  1},
        down:         {x:  0, y:  1},
        down_left:    {x: -1, y:  1},
        left:         {x: -1, y:  0},
        up_left:      {x: -1, y: -1}
    };

    var DIRECTIONS_4 = [
        'up',
        'down',
        'left',
        'right'
    ];

    var DIRECTIONS_8 = [
        'up',
        'up_right',
        'right',
        'down_right',
        'down',
        'down_left',
        'left',
        'up_left'
    ];

    /**
    * Utility functions.
    * @class Util
    * @static
    */
    var Util = {

        /**
         * List of 4 directions as strings.
         * Used to match property keys of `Util.DIRECTIONS_TO_OFFSETS`.
         * @property DIRECTIONS_4
         * @type {Array}
         * @static
         * @final
         * @example
         *     [
         *         'up',
         *         'right',
         *         'down',
         *         'left',
         *     ]
         */
        DIRECTIONS_4: DIRECTIONS_4,

        /**
         * List of 8 directions as strings.
         * Used to match property keys of `Util.DIRECTIONS_TO_OFFSETS`.
         * @property DIRECTIONS_8
         * @type {Array}
         * @static
         * @final
         * @example
         *     [
         *         'up',
         *         'up_right',
         *         'right',
         *         'down_right',
         *         'down',
         *         'down_left',
         *         'left',
         *         'up_left',
         *     ]
         */
        DIRECTIONS_8: DIRECTIONS_8,

        /**
         * Maps direction names to coord offsets.
         * @property DIRECTIONS_TO_OFFSETS
         * @type {Object}
         * @static
         * @final
         * @example
         *     {
         *        up:           {x:  0, y: -1},
         *        up_right:     {x:  1, y: -1},
         *        right:        {x:  1, y:  0},
         *        down_right:   {x:  1, y:  1},
         *        down:         {x:  0, y:  1},
         *        down_left:    {x: -1, y:  1},
         *        left:         {x: -1, y:  0},
         *        up_left:      {x: -1, y: -1}
         *     }
         */
        DIRECTIONS_TO_OFFSETS: DIRECTIONS_TO_OFFSETS,

        /**
        * Merges settings with default values.
        * @method mergeDefaults
        * @static
        * @param {Object} defaults - Default values to merge with.
        * @param {Object} settings - Settings to merge with default values.
        * @return {Object} A new object with settings replacing defaults.
        */
        mergeDefaults: function(defaults, settings) {
            var out = {};
            for (var key in defaults) {
                if (key in settings) {
                    out[key] = settings[key];
                } else {
                    out[key] = defaults[key];
                }
            }
            return out;
        },

        /**
        * Copy all of the properties in the source objects over to the destination object, and return the destination object.
        * It's in-order, so the last source will override properties of the same name in previous arguments.
        * @method merge
        * @static
        * @param {Object} destination - The object to copy properties to.
        * @param {Object} source* - The object to copy properties from.
        * @return {Object} The `destination` object.
        */
        merge: function(destination){
            var sources = Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < sources.length; i++) {
                var source = sources[i];
                for(var key in source){
                    destination[key] = source[key];
                }
            }
            return destination;
        },

        /**
        * Gets the offset coords of a given direction.
        * @method getOffsetCoordsFromDirection
        * @static
        * @param {String} direction - valid directions: [`up`, `down`, `left`, `right`, `up_left`, `up_right`, `down_left`, `down_right`];.
        * @return {Object} `{x: 0, y: 0}`
        */
        getOffsetCoordsFromDirection: function(direction){
            return {
                x: this.DIRECTIONS_TO_OFFSETS[direction].x,
                y: this.DIRECTIONS_TO_OFFSETS[direction].y
            };
        },

        /**
         * Gets the distance in tile moves from point 1 to point 2.
         * @method getTileMoveDistance
         * @param {Number} x1
         * @param {Number} y1
         * @param {Number} x2
         * @param {Number} y2
         * @param {Bool} [diagonalMovement=false]if true, calculate the distance taking into account diagonal movement.
         * @return {Number}
         */
        getTileMoveDistance: function(x1, y1, x2, y2, diagonalMovement){
            if(!diagonalMovement){
                return Math.abs(x2 - x1) + Math.abs(y2 - y1);
            } else {
                return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
            }
        },

        /**
         * Gets the distance from point 1 to point 2.
         * @method getDistance
         * @static
         * @param {Number} x1
         * @param {Number} y1
         * @param {Number} x2
         * @param {Number} y2
         * @return {Number}
         */
        getDistance: function(x1, y1, x2, y2){
            var dx = x2 - x1;
            var dy = y2 - y1;
            return Math.sqrt(dx*dx + dy*dy);
        },
        
        /**
         * Returns a random number from uniformly distributed x to y inclusive
         * @param {Number} min 
         * @param {Number} max 
         * @return {Number}
         */
        random: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min)
        },

        /**
         * Returns a random number from normally distributed x to y inclusive,
         * with optional skew factor (larger number, eg 3, skews right, number closer to
         * 0, eg 0.25, will skew left)
         * https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
         * @param {Number} min 
         * @param {Number} max 
         * @param {Number} skew 
         * @return {Number}
         */
        randn_bm: function (min, max, skew) {
            let u = 0, v = 0;
            while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
            while(v === 0) v = Math.random()
            let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
            
            num = num / 10.0 + 0.5 // Translate to 0 -> 1
            if (num > 1 || num < 0) 
              num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
            
            else{
              num = Math.pow(num, skew) // Skew
              num *= max - min // Stretch to fill range
              num += min // offset to min
            }
            return num
        },
    };

    root.RL.Util = Util;

}(this));
