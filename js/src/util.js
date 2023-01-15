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

        colorDictionary: {},

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

        //color library
        loadColorBounds () {

            this.defineColor(
              'monochrome',
              null,
              [[0,0],[100,0]]
            );
          
            this.defineColor(
              'red',
              [-26,18],
              [[20,100],[30,92],[40,89],[50,85],[60,78],[70,70],[80,60],[90,55],[100,50]]
            );
          
            this.defineColor(
              'orange',
              [18,46],
              [[20,100],[30,93],[40,88],[50,86],[60,85],[70,70],[100,70]]
            );
          
            this.defineColor(
              'yellow',
              [46,62],
              [[25,100],[40,94],[50,89],[60,86],[70,84],[80,82],[90,80],[100,75]]
            );
          
            this.defineColor(
              'green',
              [62,178],
              [[30,100],[40,90],[50,85],[60,81],[70,74],[80,64],[90,50],[100,40]]
            );
          
            this.defineColor(
              'blue',
              [178, 257],
              [[20,100],[30,86],[40,80],[50,74],[60,60],[70,52],[80,44],[90,39],[100,35]]
            );
          
            this.defineColor(
              'purple',
              [257, 282],
              [[20,100],[30,87],[40,79],[50,70],[60,65],[70,59],[80,52],[90,45],[100,42]]
            );
          
            this.defineColor(
              'pink',
              [282, 334],
              [[20,100],[30,90],[40,86],[60,84],[80,80],[90,75],[100,73]]
            );
          
        },

        defineColor (name, hueRange, lowerBounds) {

            var sMin = lowerBounds[0][0],
                sMax = lowerBounds[lowerBounds.length - 1][0],
          
                bMin = lowerBounds[lowerBounds.length - 1][1],
                bMax = lowerBounds[0][1];
          
            this.colorDictionary[name] = {
              hueRange: hueRange,
              lowerBounds: lowerBounds,
              saturationRange: [sMin, sMax],
              brightnessRange: [bMin, bMax]
            };
          
        },

        randomColor :function(hue) {
            var H,S,B;
            H = this.pickHue(hue);
            S = this.pickSaturation(H, hue);
            B = this.pickBrightness(H, S, hue);
          
            // Then we return the HSB color in the desired format
            return this.HSVtoHex([H,S,B]);
        },

        pickHue(hue) {
            var hueRange = this.getHueRange(hue);

            var h = this.randomWithin(hueRange);
    
            if (h < 0) 
                h = 360 + h;
            return h;
        },

        pickSaturation (hue, H) {

            if (H === 'monochrome') 
              return 0;
            
            var saturationRange = this.getSaturationRange(hue);
          
            var sMin = saturationRange[0],
                sMax = saturationRange[1];
        
            return this.randomWithin([sMin, sMax]);
        },

        getSaturationRange (hue) {
            return this.getColorInfo(hue).saturationRange;
        },
          
        pickBrightness (H, S, hue) {
            var bMin = this.getMinimumBrightness(H, S),
                bMax = 100;
          
            return this.randomWithin([bMin, bMax]);
        },

        getMinimumBrightness(H, S) {
            var lowerBounds = this.getColorInfo(H).lowerBounds;
          
            for (var i = 0; i < lowerBounds.length - 1; i++) {
          
              var s1 = lowerBounds[i][0],
                  v1 = lowerBounds[i][1];
          
              var s2 = lowerBounds[i+1][0],
                  v2 = lowerBounds[i+1][1];
          
              if (S >= s1 && S <= s2) {
          
                 var m = (v2 - v1)/(s2 - s1),
                     b = v1 - m*s1;
          
                 return m*S + b;
              }
          
            }
          
            return 0;
        },

        randomWithin (range) {
              //generate random evenly destinct number from : https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
              var golden_ratio = 0.618033988749895
              var r=Math.random()
              r += golden_ratio
              r %= 1
              return Math.floor(range[0] + r*(range[1] + 1 - range[0]));
        },

        getHueRange (colorInput) {

            if (typeof parseInt(colorInput) === 'number') {
          
              var number = parseInt(colorInput);
          
              if (number < 360 && number > 0) {
                return [number, number];
              }
          
            }
          
            if (typeof colorInput === 'string') {
          
              if (this.colorDictionary[colorInput]) {
                var color = this.colorDictionary[colorInput];
                if (color.hueRange) {return color.hueRange;}
              } else if (colorInput.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
                var hue = this.HexToHSB(colorInput)[0];
                return [ hue, hue ];
              }
            }
          
            return [0,360];
          
        },

        getMinimumBrightness(H, S) {

            var lowerBounds = this.getColorInfo(H).lowerBounds;
          
            for (var i = 0; i < lowerBounds.length - 1; i++) {
          
              var s1 = lowerBounds[i][0],
                  v1 = lowerBounds[i][1];
          
              var s2 = lowerBounds[i+1][0],
                  v2 = lowerBounds[i+1][1];
          
              if (S >= s1 && S <= s2) {
          
                 var m = (v2 - v1)/(s2 - s1),
                     b = v1 - m*s1;
          
                 return m*S + b;
              }
          
            }
          
            return 0;
        },

        getColorInfo (hue) {

            // Maps red colors to make picking hue easier
            if (hue >= 334 && hue <= 360) {
              hue-= 360;
            }
          
            for (var colorName in this.colorDictionary) {
               var color = this.colorDictionary[colorName];
               if (color.hueRange &&
                   hue >= color.hueRange[0] &&
                   hue <= color.hueRange[1]) {
                  return this.colorDictionary[colorName];
               }
            } return 'Color not found';
        },

        HSVtoHex (hsv){
            var rgb = this.HSVtoRGB(hsv);
            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? '0' + hex : hex;
            }
            var hex = '#' + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
            return hex;
        },

        HSVtoRGB (hsv) {
            // this doesn't work for the values of 0 and 360
            // here's the hacky fix
            var h = hsv[0];
            if (h === 0) {h = 1;}
            if (h === 360) {h = 359;}
          
            // Rebase the h,s,v values
            h = h/360;
            var s = hsv[1]/100,
                v = hsv[2]/100;
          
            var h_i = Math.floor(h*6),
              f = h * 6 - h_i,
              p = v * (1 - s),
              q = v * (1 - f*s),
              t = v * (1 - (1 - f)*s),
              r = 256,
              g = 256,
              b = 256;
          
            switch(h_i) {
              case 0: r = v; g = t; b = p;  break;
              case 1: r = q; g = v; b = p;  break;
              case 2: r = p; g = v; b = t;  break;
              case 3: r = p; g = q; b = v;  break;
              case 4: r = t; g = p; b = v;  break;
              case 5: r = v; g = p; b = q;  break;
            }
          
            var result = [Math.floor(r*255), Math.floor(g*255), Math.floor(b*255)];
            return result;
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
            return Math.floor(5*(level**3 + 10));
        },
        mapRankToColor: function(rank){
            switch(rank){
                case 'S': return RL.Util.COLORS.S_brown;
                case 'A': return RL.Util.COLORS.A_orchid;
                case 'B': return RL.Util.COLORS.B_aero;
                case 'C': return RL.Util.COLORS.C_cadetblue;
                case 'D': return RL.Util.COLORS.D_pastelgreen;
                case 'E': return RL.Util.COLORS.E_goldenrod;
                case 'F': return RL.Util.COLORS.F_peachpuff;
                default: return RL.Util.COLORS.F_peachpuff;
            }
        },
        sortArrayOfObjects: function(arr, key) {
            return arr.sort((a, b) => (a[key] > b[key] ? 1 : -1));
        },
        sortInventoryByKey: function(arr, key) {
            return arr.sort((a, b) => (a[0][key] > b[0][key] ? 1 : -1));
        },
        mapAbbrToStat: function(abbr){
            switch(abbr){
                case 'Str': return 'strength';
                case 'Agi': return 'agility';
                case 'Int': return 'intelligence';
                case 'Vit': return 'vitality';
                case 'Luck': return 'luck';
                default: return 'error';
            }
        },

        mapDamageToFontSize(numDigits){
            switch(numDigits){
                case 1: return 50;
                case 2: return 50;
                case 3: return 50;
                default: return 50;
            }
        },

        mapDamageTo3Digits: function(number){
            if (number < 1000) 
                return number.toString();
            let exponent = Math.floor(Math.log10(number));
            let mantissa = number / Math.pow(10, exponent);
            let mantissaString = mantissa.toFixed(0);
            if (mantissa % 1 === 0) 
                mantissaString = mantissa.toString();
            return `${mantissaString}e${exponent}`;
        },

        // Takes item-probability pairs and returns a random item based on the probability distribution
        getRandomFromRate: function(dict) {
            const keys = Object.keys(dict);
          
            // Next, we'll create an array of the probabilities corresponding to each key
            const probabilities = keys.map(key => dict[key]);
          
            // Then, we'll create a new array of the cumulative probabilities, which will be used to determine which key to return
            const cumulativeProbabilities = [];
            let cumulativeProbability = 0;
            for (const probability of probabilities) {
              cumulativeProbability += probability;
              cumulativeProbabilities.push(cumulativeProbability);
            }
          
            // Now we'll generate a random number between 0 and 1
            const randomNumber = Math.random();
          
            // Finally, we'll iterate through the cumulative probabilities array and return the key corresponding to the first cumulative probability that is greater than the random number
            for (let i = 0; i < cumulativeProbabilities.length; i++) {
              if (randomNumber < cumulativeProbabilities[i]) {
                return keys[i];
              }
            }
          },

          mapRateToRarity: function(rate){
            if(rate >= 0.05)
                return 'Common';
            if(rate >= 0.01)
                return 'Uncommon';
            if(rate >= 0.001)
                return 'Rare';
            if(rate >= 0.0001)
                return 'Very Rare';
            return 'Common';
          },

          selectRandomElement: function(array) {
            // Generate a random index between 0 and the length of the array
            const randomIndex = Math.floor(Math.random() * array.length);
            // Return the element at the random index
            return array[randomIndex];
          },

          addCommas: function(number) {
            var str = number.toString();
            var charArray = str.split('');
            var formatted = [];
            var counter = 0;
            for (var i = charArray.length - 1; i >= 0; i--) {
              counter++;
              formatted.unshift(charArray[i]);
              if (counter % 3 === 0 && i !== 0) {
                formatted.unshift(',');
              }
            }
            return formatted.join('');
          },

          // Searches an array of objects using a key and returns the object with the matching key
          arrFind: function(arr, key){
            for(var i = 0; i< arr.length; i++){
                if (arr[i].key == key)
                    return arr[i];
            }
            return false;
          },

          arrFindType: function(arr, type){
            for(var i = 0; i< arr.length; i++){
              if (arr[i].type == type)
                  return arr[i];
            }
            return false;
          },

          arrFindInventory: function(arr, item){
            for(var i = 0; i< arr.length; i++){
                if (arr[i][0].type == item.type)
                    return arr[i];
            }
            return false;
          },
          mapGroupToIcon: function(group){
            switch(group) {
                case 'healing': return '<img src="assets/icons/heal.png"/>';
                case 'mp_recovery': return '<img src="assets/icons/heal.png"/>';
                case 'weapon': return '<img src="assets/icons/weapon.png"/>';
                case 'material': return '<img src="assets/icons/drops.png"/>';
                case 'special': return '<img src="assets/icons/special.png"/>';
                case 'combat': return '<img src="assets/icons/weapon.png"/>';
                case 'misc': return '<img src="assets/icons/stats.png"/>';
            }
          },
    };

    root.RL.Util = Util;

}(this));
