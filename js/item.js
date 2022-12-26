(function(root) {
    'use strict';

    /**
    * Represents an item in the game map.
    * @class Item
    * @constructor
    * @param {Object} game - Game instance this obj is attached to.
    * @param {String} type - Type of tile. When created this object is merged with the value of Item.Types[type].
    * @param {Number} x - The map tile coordinate position of this tile on the x axis.
    * @param {Number} y - The map tile coordinate position of this tile on the y axis.
    */
    var Item = function Item(game, type, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.type = type;
        var typeData = Item.Types[type];
        RL.Util.merge(this, typeData);
        this.color = RL.Util.mapRankToColor(this.rank);
        this.consoleColor = this.color;
    };

    Item.prototype = {
        constructor: Item,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * The type of entity this is.
        * When created this object is merged with the value of Item.Types[type].
        * @property type
        * @type Object
        */
        type: null,

        /**
        * Display name for this item.
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
        charStrokeColor: '#000',
        charStrokeWidth: 2,
        consoleColor: RL.Util.COLORS.blue_alt,
        group: null,
        rank: 'F',

        stat1: null,
        stat2: null,
        stat3: null,

        stat1Modifier: null,
        stat2Modifier: null,
        stat3Modifier: null,



        /**
         * Checks if this item can be attached to an entity.
         * @method canAttachTo
         * @param {Entity} entity
         * @return {Bool}
         */
        canAttachTo: function(entity){

        },

        /**
         * Resolves the effects of attaching this item to an entity.
         * @method attachTo
         * @param {Entity} entity
         */
        attachTo: function(entity){
            this.game.console.logPickUp(entity, this);
        },

        getConsoleName: function(){
            return {
                name: this.name,
                color: this.consoleColor,
            };
        },
    };


    var Defaults = {
        healing: {
            group: 'healing',
            consoleColor: 'pink',
            canAttachTo: function(entity){
                if(this.game.player !== entity){
                    return false;
                }
                if(entity.hp >= entity.hpMax){
                    this.game.console.logCanNotPickupHealing(entity, this);
                    return false;
                }
                return true;
            },
            attachTo: function(entity){
                this.game.console.logPickUpHealing(entity, this);
                entity.heal(this.healAmount);
            },
            getConsoleName: function(){
                return {
                    name: this.name + ' [+' + this.healAmount + ' HP]',
                    color: this.consoleColor
                };
            },
            getStats: function(){
                return 'Heals ' + this.healAmount + ' HP';
            },
        },
        weapon: {
            group: 'weapon',
            canAttachTo: function(entity){
                if(this.game.player !== entity){
                    return false;
                }
                if(this.damage < entity.weapon.damage){
                    this.game.console.logCanNotPickupWeapon(entity, entity.weapon, this);
                    return false;
                }
                return true;
            },
            attachTo: function(entity){
                Item.prototype.attachTo.call(this, entity);
                entity.weapon = this;
            },
            getConsoleName: function(){
                return {
                    name: this.name,
                    stats: this.getStats(),
                    range: this.range,
                    color: this.consoleColor
                };
            },
            getStats: function(){
                var msg = '';
                if(this.stat1){
                    if(this.stat1Modifier >= 0)
                        msg += '+';
                    else
                        msg += '-';
                    msg += this.stat1Modifier + ' ' + this.stat1;
                }
                if(this.stat2){
                    msg += ', ';
                    if(this.stat2Modifier >= 0)
                        msg += '+';
                    else
                        msg += '-';
                    msg += this.stat2Modifier + ' ' + this.stat2;
                }
                if(this.stat3){
                    msg += ', ';
                    if(this.stat3Modifier >= 0)
                        msg += '+';
                    else
                        msg += '-';
                    msg += this.stat3Modifier + ' ' + this.stat3;
                }
                return msg;
            },
        },
        material: {
            group: 'material',
            getStats: function(){
                return 'Material';
            }
        },
    };

    RL.Util.merge(Item.prototype, RL.Mixins.TileDraw);


    var makeHealingItem = function(obj){
        return RL.Util.merge(obj, Defaults.healing);
    };

    var makeWeapon = function(obj){
        return RL.Util.merge(obj, Defaults.weapon);
    };
    
    var makeMaterial = function(obj){
        return RL.Util.merge(obj, Defaults.material);
    }

    /**
    * Describes different types of tiles. Used by the Item constructor 'type' param.
    *
    *     Item.Types = {
    *         floor: {
    *            name: 'Floor',
    *            char: '.',
    *            color: '#333',
    *            bgColor: '#111',
    *            blocksLos: false
    *         },
    *         // ...
    *     }
    *
    * @class Item.Types
    * @static
    */
    Item.Types = {

        // healing items
        tiny_potion: makeHealingItem({
            name: 'Tiny Potion',
            char: "p",
            rank: 'F',
            healAmount: 5,
        }),

        // enemy weapons
        goo: makeWeapon({
            name: 'Goo',
            char: 'g',
            rank: 'F',
            stat1: 'Str',
            stat1Modifier: 1,
            range: 1,
        }),

        // melee weapons
        fists: makeWeapon({
            name: 'Fists',
            char: 'f',
            rank: 'F',
            stat1: 'Str',
            stat1Modifier: 1,
            range: 1,
        }),

        // ranged weapons
        rock: makeWeapon({
            name: 'Rock',
            char: 'r',
            rank: 'E',
            stat1: 'Str',
            stat1Modifier: 2,
            stat2: 'Agi',
            stat2Modifier: 1,
            range: 2,
        }),

        // material
        slime_goo: makeMaterial({
            name: 'Slime Goo',
            char: 's',
            rank: 'C',
        }),

    };


    root.RL.Item = Item;

}(this));
