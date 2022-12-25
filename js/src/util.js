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
         * Randomly samples from normally distributed array given a mean and sd
         * @param {Array} array 
         * @param {Number} mean 
         * @param {Number} stddev 
         * @returns 
         */
         random_norm: function(array, mean, stddev) {
            // Generate a random number from a normal distribution
            // using the Box-Muller transform
            function randn_bm() {
              let u = 0, v = 0;
              while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
              while(v === 0) v = Math.random();
              return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
            }
          
            // Find the index of the character to sample
            let index = Math.floor(mean + stddev * randn_bm());
          
            // Make sure the index is within the bounds of the array
            index = Math.max(0, Math.min(index, array.length - 1));
          
            // Return the character at the randomly chosen index
            return array[index];
          },

        apply2D: function(array, fn) {
            for (let i = 0; i < array.length; i++) {
              for (let j = 0; j < array[i].length; j++) {
                array[i][j] = fn(array[i][j]);
              }
            }
          },
        
        exptoNextLevel: function(level){
            return Math.floor(5*((level+1)**3)/4 - 5*(level**3)/4);
        },
        mapRankToColor: function(rank){
            switch(rank){
                case 'S': return RL.Util.COLORS.S_brown;
                case 'A': return RL.Util.COLORS.A_orchid;
                case 'B': return RL.Util.COLORS.B_darkolivegreen;
                case 'C': return RL.Util.COLORS.C_cadetblue;
                case 'D': return RL.Util.COLORS.D_paleturquoise;
                case 'E': return RL.Util.COLORS.E_goldenrod;
                case 'F': return RL.Util.COLORS.F_peachpuff;
                default: return RL.Util.COLORS.F_peachpuff;
            }
        },
    };

    root.RL.Util = Util;

}(this));
