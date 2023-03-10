(function(root) {
    'use strict';

    /**
    * Represents an Furniture in the game map.
    * @class Furniture
    * @constructor
    * @param {Object} game - Game instance this obj is attached to.
    * @param {String} type - Type of tile. When created this object is merged with the value of Furniture.Types[type].
    * @param {Number} x - The map tile coordinate position of this tile on the x axis.
    * @param {Number} y - The map tile coordinate position of this tile on the y axis.
    */
    var Furniture = function Furniture(game, type, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.type = type;

        var typeData = Furniture.Types[type];
        RL.Util.merge(this, typeData);

        this.actions = {};

        if(this.init){
            this.init();
        }
    };

    Furniture.prototype = {
        constructor: Furniture,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * The type of entity this is.
        * When created this object is merged with the value of Furniture.Types[type].
        * @property type
        * @type Object
        */
        type: null,

        /**
        * Display name for this Furniture.
        * @property name
        * @type {String}
        */
        name: null,

        /**
        * The tile map coordinate position on the x axis.
        * @property x
        * @type Number
        */
        x: null,

        /**
        * The tile map coordinate position on the y axis.
        * @property y
        * @type Number
        */
        y: null,

        /**
        * The character displayed when rendering this tile.
        * @property char
        * @type String
        */
        char: null,

        /**
        * The color of the character displayed when rendering this tile. Not rendered if false.
        * @property color
        * @type String|bool
        */
        color: null,

        /**
        * The background color the character displayed when rendering this tile. Not rendered if false.
        * @property bgColor
        * @type String|bool
        */
        bgColor: false,

        consoleColor: false,
        
        fontSize: 15,

        pushable: false,

        /**
        * If entities can move through this tile.
        * @property passable
        * @type {Bool}
        */
        passable: false,

        /**
        * If this tile blocks line of sight.
        * @property passable
        * @type {Bool}
        */
        blocksLos: false,

        hp: 1,

        dead: false,

        exp: 0,

        actions: null,

        getClass: function(){
            return 'furniture';
        },

        takeDamage: function(amount){
            this.hp -= amount;
            if (this.hp <= 0) {
                this.dead = true;
            }
        },
        getConsoleName: function(){
            return {
                name: this.name,
                color: this.consoleColor
            };
        },

        /**
        * Checks if this entity can move to the specified map tile
        * @method canMoveTo
        * @param {Number} x - The tile map x coord to check if this entity can move to.
        * @param {Number} y - The tile map y coord to check if this entity can move to.
        * @return {Bool}
        */
        canMoveTo: function(x, y){
            return this.game.entityCanMoveTo(this, x, y);
        },

        /**
        * Changes the position of this entity on the map.
        * this.canMoveTo() should always be checked before calling this.moveTo
        * @method moveTo
        * @param {Number} x - The tile map x coord to move to.
        * @param {Number} y - The tile map y coord to move to.
        */
        moveTo: function(x, y) {
            return this.game.furnitureManager.move(x, y, this);
        },

        // /**
        //  * Checks if this object is a valid target for given action.
        //  * @method canResolveAction
        //  * @param {String} action
        //  * @param {Object} source
        //  * @param {Object} settings
        //  * @return {Boolean}
        //  */
        // canResolveAction: function(action, source, settings){
        //     if(!this.actions[action]){
        //         return false;
        //     }
        //     return this.actions[action].canResolve.call(this, source, settings);
        // },

        // /**
        //  * Resolves an action
        //  * @method resolveAction
        //  * @param {String} action
        //  * @param {Object} source
        //  * @param {Object} settings
        //  * @return {Boolean}
        //  */
        // resolveAction: function(action, source, settings){
        //     if(this.canResolveAction(action, source, settings)){
        //         return this.actions[action].resolve.call(this, source, settings);
        //     }
        // },
    };

    RL.Util.merge(Furniture.prototype, RL.Mixins.TileDraw);



    /**
    * Describes different types of tiles. Used by the Furniture constructor 'type' param.
    *
    *     Furniture.Types = {
    *         floor: {
    *            name: 'Floor',
    *            char: '.',
    *            color: '#333',
    *            bgColor: '#111',
    *            passable: true,
    *            blocksLos: false
    *         },
    *         // ...
    *     }
    *
    * @class Furniture.Types
    * @static
    */
    Furniture.Types = {
        door: {
            name: 'Door',
            hp: 5,
            sprite: 'door',
            consoleColor: 'yellow',
            passable: false,
            blocksLos: true,
            mixins: ['door'],
            init: function(){
                RL.Actions.Resolvable.add(this, 'open');
                RL.Actions.Resolvable.add(this, 'close');

                // RL.Actions.Resolvable.add(this, 'attack');
            }
        },
        crate: {
            name: 'Crate',
            hp: 5,
            sprite: 'crate',
            consoleColor: 'yellow',
            pushable: false,
            passable: false,
            blocksLos: false,
            init: function(){
                RL.Actions.Resolvable.add(this, 'open');
            }
        },
        // Added by rio
        bush: {
            name: 'Bush',
            hp: 1,
            sprite: 'bush',
            consoleColor: 'green',
            pushable: true,
            passable: false,
            blocksLos: false,
            init: function(){
                RL.Actions.Resolvable.add(this, 'push');
                RL.Actions.Resolvable.add(this, 'attack');
            }
        },

        leaf_pile: {
            name: 'Leaf Pile',
            hp: 5,
            sprite: 'leaf_pile',
            consoleColor: RL.Util.COLORS.green,
            pushable: false,
            passable: true,
            blocksLos: false,
            init: function(){
                RL.Actions.Resolvable.add(this, 'attack');
            }
        },
        oak_tree:{
            name: 'Oak Tree',
            hp: 15,
            sprite: 'oak_tree',
            consoleColor: RL.Util.COLORS.golden_oak,
            pushable: false,
            passable: false,
            blocksLos: true,
            init: function(){
                RL.Actions.Resolvable.add(this, 'attack');
            }
        },
        boulder:{
            name: 'Boulder',
            hp: 30,
            sprite: 'boulder',
            consoleColor: RL.Util.COLORS.gray,
            pushable: false,
            passable: false,
            blocksLos: true,
            init: function(){
                RL.Actions.Resolvable.add(this, 'attack');
            }
        },
        mud:{
            name: 'Mud',
            hp: 1,
            sprite: 'mud',
            consoleColor: RL.Util.COLORS.brown,
            pushable: false,
            passable: true,
            blocksLos: false,
            init: function(){
            }
        },
        puddle:{
            name: 'Puddle',
            hp: 1,
            sprite: 'puddle',
            consoleColor: RL.Util.COLORS.dirty_water,
            pushable: false,
            passable: false,
            blocksLos: false,
            init: function(){
                RL.Actions.Resolvable.add(this, 'attack');
            }
        },
        
    };

    root.RL.Furniture = Furniture;

}(this));
