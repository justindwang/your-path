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
        charStrokeColor: '#5A5A5A',
        charStrokeWidth: 1,
        group: null,
        rank: 'F',
        cost: 0,

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
            if(this.game.player !== entity){
                return false;
            }
            return true;
        },

        /**
         * Resolves the effects of attaching this item to an entity.
         * @method attachTo
         * @param {Entity} entity
         */
        attachTo: function(entity){
            this.game.console.logAddToInventory(entity, this);
            this.game.menu.addToInventory(this);
        },

        getConsoleName: function(){
            return {
                name: this.name,
                color: this.color,
            };
        },

        getClass: function(){
            return 'item';
        },
    };


    var Defaults = {
        healing: {
            group: 'healing',
            char: '🩹',
            fontSize: 12,
            getConsoleName: function(){
                return {
                    name: this.name,
                    color: this.color
                };
            },
            getStats: function(){
                return 'Heals ' + this.healAmount + ' HP';
            },
        },
        weapon: {
            group: 'weapon',
            char: '🔪',
            fontSize: 12,
            getConsoleName: function(){
                return {
                    name: this.name,
                    stats: this.getStats(),
                    range: this.range,
                    color: this.color
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
            charStrokeWidth: 1,
            char: '✨',
            fontSize: 12,
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
    };

    Item.Types = {
        // healing items
        tiny_hp_potion: makeHealingItem({
            name: 'Tiny HP Potion',
            rank: 'F',
            healAmount: 5,
            cost: 10,
        }),

        // enemy weapons
        goo: makeWeapon({
            name: 'Goo',
            rank: 'F',
            stat1: 'Str',
            stat1Modifier: 1,
            range: 1,
            cost: 10,
        }),
        wolf_fang: makeWeapon({
            name: 'Wolf Fang',
            rank: 'E',
            stat1: 'Str',
            stat1Modifier: 2,
            range: 1,
            cost: 100,
        }),

        // melee weapons
        fists: makeWeapon({
            name: 'Fists',
            rank: 'F',
            stat1: 'Str',
            stat1Modifier: 1,
            range: 1,
            cost: 10,
        }),

        // ranged weapons
        rock: makeWeapon({
            name: 'Rock',
            rank: 'E',
            stat1: 'Str',
            stat1Modifier: 2,
            stat2: 'Agi',
            stat2Modifier: 1,
            range: 2,
            cost: 100,
        }),

        // material
        slime_goo: makeMaterial({
            name: 'Slime Goo',
            rank: 'F',
            cost: 5,
        }),

        wolf_fur: makeMaterial({
            name: 'Wolf Fur',
            rank: 'F',
            cost: 5,
        }),

        // fillin rank items
        stinger: makeWeapon({
            name: 'Stinger',
            rank: 'D',
            stat1: 'Str',
            stat1Modifier: 5,
            stat2: 'Agi',
            stat2Modifier: 2,
            range: 1,
            cost: 500,
        }),
        hp_potion: makeHealingItem({
            name: 'HP Potion',
            rank: 'C',
            healAmount: 20,
            cost: 1000,
        }),
        secret_rocks: makeMaterial({
            name: 'Secret Rocks',
            rank: 'B',
            cost: 2000,
        }),
        whip_of_fortune: makeWeapon({
            name: 'Whip of Fortune',
            rank: 'A',
            stat1: 'Str',
            stat1Modifier: 100,
            stat2: 'Int',
            stat2Modifier: 50,
            range: 3,
            cost: 5000,
        }),
        barans_blades: makeWeapon({
            name: 'Baran\'s Blades',
            rank: 'S',
            stat1: 'Str',
            stat1Modifier: 220,
            stat2: 'Agi',
            stat2Modifier: 100,
            range: 1,
            cost: 10000,
        }),
    };


    root.RL.Item = Item;

}(this));
