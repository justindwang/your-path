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
        skill_scroll: {
            group: 'skill_scroll',
            attachTo: function(entity){
                this.game.console.logAddToInventory(entity, this);
                this.game.menu.addToInventory(this);
                // RL.Util.arrFind(this.game.menu.stats, 'skill_scrolls_obtained').increment();
            },
            getConsoleName: function(){
                return {
                    name: this.name,
                    rank: this.rank,
                    stats: this.getStats(),
                    color: this.color,
                    sprite: this.sprite,
                };
            },
            getStats: function(){
                return 'Consumable';
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
        misc: {
            group: 'misc',
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
    var makeSkillScroll = function(obj){
        return RL.Util.merge(obj, Defaults.skill_scroll);
    };
    var makeMiscItem = function(obj){
        return RL.Util.merge(obj, Defaults.misc);
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
            stat2: 'Agi',
            stat1Modifier: 2,
            stat2Modifier: 2,
            range: 1,
            cost: 110,
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
            stat2: 'Vit',
            stat1Modifier: 10,
            stat2Modifier: 5,
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
        wooden_sword: makeWeapon({
            name: 'Wooden Sword',
            sprite: 'wooden_sword',
            rank: 'F',
            stat1: 'Str',
            stat1Modifier: 2,
            range: 1,
            cost: 20,
        }),
        wooden_shield: makeWeapon({
            name: 'Wooden Shield',
            sprite: 'wooden_shield',
            rank: 'F',
            stat1: 'Vit',
            stat1Modifier: 2,
            range: 1,
            cost: 20,
        }),

        copper_dagger: makeWeapon({
            name: 'Copper Dagger',
            sprite: 'copper_dagger',
            rank: 'F',
            stat1: 'Str',
            stat1Modifier: 1,
            stat2: 'Agi',
            stat2Modifier: 1,
            range: 1,
            cost: 20,
        }),

        // ranged weapons
        sharp_rock: makeWeapon({
            name: 'Sharp Rock',
            sprite: 'sharp_rock',
            rank: 'F',
            stat1: 'Str',
            stat2: 'Luck',
            stat1Modifier: 1,
            stat2Modifier: 1,
            range: 2,
            cost: 20,
        }),

        javelin: makeWeapon({
            name: 'Javelin',
            sprite: 'javelin',
            rank: 'F',
            stat1: 'Luck',
            stat1Modifier: 2,
            range: 2,
            cost: 20,
        }),

        nails: makeWeapon({
            name: 'Nails',
            sprite: 'nails',
            rank: 'F',
            stat1: 'Agi',
            stat1Modifier: 1,
            range: 3,
            cost: 20,
        }),

        twig: makeWeapon({
            name: 'Twig',
            sprite: 'twig',
            rank: 'F',
            stat1: 'Int',
            stat1Modifier: 2,
            range: 2,
            cost: 20,
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

        // skill scrolls
        skill_scrollF: makeSkillScroll({
            name: 'Skill Scroll',
            sprite: 'skill_scrollF',
            rank: 'F',
            cost: 50,
        }),
        skill_scrollE: makeSkillScroll({
            name: 'Skill Scroll',
            sprite: 'skill_scrollE',
            rank: 'E',
            cost: 200,
        }),
        skill_scrollD: makeSkillScroll({
            name: 'Skill Scroll',
            sprite: 'skill_scrollD',
            rank: 'D',
            cost: 600,
        }),
        skill_scrollC: makeSkillScroll({
            name: 'Skill Scroll',
            sprite: 'skill_scrollC',
            rank: 'C',
            cost: 1200,
        }),
        skill_scrollB: makeSkillScroll({
            name: 'Skill Scroll',
            sprite: 'skill_scrollB',
            rank: 'B',
            cost: 2400,
        }),
        skill_scrollA: makeSkillScroll({
            name: 'Skill Scroll',
            sprite: 'skill_scrollA',
            rank: 'A',
            cost: 6000,
        }),
        skill_scroll_S: makeSkillScroll({
            name: 'Skill Scroll',
            sprite: 'skill_scrollS',
            rank: 'S',
            cost: 12000,
        }),
        // misc items
        job_change_ticket: makeMiscItem({
            name: 'Job Change Ticket',
            sprite: 'job_change_ticket',
            rank: 'S',
            cost: 1000,
            getStats: function(){
                return 'Assigns a new job';
            },
            performUse: function(){
                var newJob = new RL.Job(this.game, this.game.randomJob());
                if (newJob.type == this.game.player.job.type || RL.Util.arrFindType(this.game.player.jobs, newJob.type)){
                    this.game.console.log(newJob.name + ' was already in job list');
                }
                else{
                    this.game.player.jobs.push(newJob);
                    this.game.player.outfits.push(new RL.Outfit(this.game, newJob.outfit));
                    this.game.console.log('Added ' + newJob.name + ' to job list');
                    this.game.menu.renderJobs();
                    this.game.menu.renderOutfits();
                }
            },
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
