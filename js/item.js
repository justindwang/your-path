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
        mp_recovery: {
            group: 'mp_recovery',
            getConsoleName: function(){
                return {
                    name: this.name,
                    color: this.color
                };
            },
            getStats: function(){
                return 'Recovers ' + this.healAmount + ' MP';
            },
        },
        weapon: {
            group: 'weapon',
            attachTo: function(entity){
                this.game.console.logAddToInventory(entity, this);
                this.game.menu.addToInventory(this);
                RL.Util.arrFind(this.game.menu.stats, 'weapons_collected').increment();
            },
            getConsoleName: function(){
                return {
                    name: this.name,
                    rank: this.rank,
                    stats: this.getStats(),
                    range: this.range,
                    color: this.color,
                    sprite: this.sprite,
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
            // sprite: 'material',
            getStats: function(){
                return 'Material';
            },
            getConsoleName: function(){
                return {
                    name: this.name,
                    stats: this.getStats(),
                    color: this.color
                };
            },
        },
        special: {
            group: 'special',
            // sprite: 'material',
            getConsoleName: function(){
                return {
                    name: this.name,
                    stats: this.getStats(),
                    color: this.color
                };
            },
        },
    };

    RL.Util.merge(Item.prototype, RL.Mixins.TileDraw);


    var makeHealingItem = function(obj){
        return RL.Util.merge(obj, Defaults.healing);
    };

    var makeMpRecoveryItem = function(obj){
        return RL.Util.merge(obj, Defaults.mp_recovery);
    };

    var makeWeapon = function(obj){
        return RL.Util.merge(obj, Defaults.weapon);
    };
    
    var makeMaterial = function(obj){
        return RL.Util.merge(obj, Defaults.material);
    };
    var makeSpecialItem = function(obj){
        return RL.Util.merge(obj, Defaults.special);
    };

    Item.Types = {
        // healing items
        tiny_hp_potion: makeHealingItem({
            name: 'Tiny HP Potion',
            sprite: 'hp_potion',
            rank: 'F',
            healAmount: 5,
            cost: 10,
        }),
        tiny_mp_potion: makeMpRecoveryItem({
            name: 'Tiny MP Potion',
            sprite: 'mp_potion',
            rank: 'F',
            healAmount: 5,
            cost: 10,
        }),
        mushroom: makeHealingItem({
            name: 'Mushroom',
            sprite: 'mushroom',
            rank: 'F',
            healAmount: 3,
            cost: 5,
        }),

        // enemy weapons
        goo: makeWeapon({
            name: 'Goo',
            sprite: 'slime_goo',
            rank: 'F',
            stat1: 'Str',
            stat1Modifier: 1,
            range: 1,
            cost: 10,
        }),
        wolf_fang: makeWeapon({
            name: 'Wolf Fang',
            sprite: 'wolf_fang',
            rank: 'E',
            stat1: 'Str',
            stat1Modifier: 2,
            range: 1,
            cost: 100,
        }),
        rusty_dagger: makeWeapon({
            name: 'Rusty Dagger',
            sprite: 'rusty_dagger',
            rank: 'F',
            stat1: 'Agi',
            stat1Modifier: 1,
            range: 1,
            cost: 10,
        }),
        kings_resent: makeWeapon({
            name: 'King\'s Resent',
            sprite: 'kings_resent',
            rank: 'C',
            stat1: 'Str',
            stat1Modifier: 10,
            range: 1,
            cost: 1000
        }),

        // melee weapons
        fists: makeWeapon({
            name: 'Fists',
            sprite: 'fists',
            rank: 'F',
            stat1: 'Str',
            stat1Modifier: 1,
            range: 1,
            cost: 10,
        }),

        // ranged weapons
        sharp_rock: makeWeapon({
            name: 'Sharp Rock',
            sprite: 'sharp_rock',
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
            sprite: 'slime_goo',
            rank: 'F',
            cost: 5,
        }),

        wolf_fur: makeMaterial({
            name: 'Wolf Fur',
            sprite: 'wolf_fur',
            rank: 'F',
            cost: 5,
        }),

        coin_stash: makeMaterial({
            name: 'Coin Stash',
            sprite: 'coin_stash',
            rank: 'E',
            cost: 200,
        }),

        // special items
        ascension_crystal: makeSpecialItem({
            name: 'Ascension Crystal',
            sprite: 'ascension_crystal',
            rank: 'A',
            cost: 0,
            getStats: function(){
                return 'For traversing floors';
            },
            performUse: function(){
                if(this.game.floor.number < this.game.player.highestFloor)
                    this.game.goToFloor(this.game.floor.number + 1);
                else
                    this.game.console.logNoEffect(this);
                console.log('bro?');
            },
        }),

        descension_crystal: makeSpecialItem({
            name: 'Descension Crystal',
            sprite: 'descension_crystal',
            rank: 'A',
            cost: 0,
            getStats: function(){
                return 'For traversing floors';
            },
            performUse: function(){
                if(this.game.floor.number > 1)
                    this.game.goToFloor(this.game.floor.number - 1);
                else
                    this.game.console.logNoEffect(this);
                console.log('bro?');
            },
        }),

        // fillin rank items
        stinger: makeWeapon({
            name: 'Stinger',
            sprite: 'stinger',
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
            sprite: 'hp_potion',
            rank: 'C',
            healAmount: 20,
            cost: 1000,
        }),
        secret_rocks: makeMaterial({
            name: 'Secret Rocks',
            rank: 'B',
            cost: 2000,
        }),
        desolation: makeWeapon({
            name: 'Desolation',
            sprite: 'desolation',
            rank: 'B',
            stat1: 'Vit',
            stat1Modifier: 75,
            stat2: 'Str',
            stat2Modifier: 10,
            range: 1,
            cost: 2000,
        }),
        whip_of_fortune: makeWeapon({
            name: 'Whip of Fortune',
            sprite: 'whip_of_fortune',
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
            sprite: 'barans_blades',
            rank: 'S',
            stat1: 'Str',
            stat1Modifier: 220,
            stat2: 'Agi',
            stat2Modifier: 100,
            range: 1,
            cost: 10000,
        }),
        excalibur: makeWeapon({
            name: 'Excalibur',
            sprite: 'excalibur',
            rank: 'S',
            stat1: 'Str',
            stat1Modifier: 400,
            range: 1,
            cost: 15000,
        }),
        heavens_arrow: makeWeapon({
            name: 'Heaven\'s Arrow',
            sprite: 'heavens_arrow',
            rank: 'S',
            stat1: 'Str',
            stat1Modifier: 50,
            range: 5,
            cost: 15000,
        }),
    };


    root.RL.Item = Item;

}(this));
