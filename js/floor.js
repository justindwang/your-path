(function(root) {
    'use strict';

    /**
    * Represents a Floor of the game.
    * @class Floor
    * @constructor
    * @param {Object} game - Game instance this obj is attached to.
    * @param {Number} number - Floor number. When created this object is merged with the value of Floor.Data[number].
    */
    var Floor = function Floor(game, number) {
        this.game = game;
        this.number = number;

        var floorData = Floor.Data[number];
        RL.Util.merge(this, floorData);

        if(this.init){
            this.init();
        }
    };

    Floor.prototype = {
        constructor: Floor,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * The floor number.
        * When created this object is merged with the value of Floor.Data[number].
        * @property number
        * @type Object
        */
        number: null,

        /**
        * Display name for this Floor.
        * @property name
        * @type {String}
        */
        name: null,

        // The entities that can appear on this floor
        entities: null,

        // enemy list
        // enemies: null,

        consoleColor: false,

        floorColors: null,

        wallColors: null,

        doorColors: null,
        entityCharToType: null,
        furnitureCharToType: null,
        itemsCharToType: null,

        getConsoleName: function(){
            return {
                name: this.name,
                color: this.consoleColor
            };
        },

        getEntityRarities: function(){
            var string = ''
            var first = true;
            for (const [key, value] of Object.entries(this.entityCharToType)) {
                if(first)
                    first = false;
                else
                    string += ', '
                var rarity = RL.Util.mapRateToRarity(this.entities[key]);
                var name = RL.Entity.Types[value].name;
                string += name + ' - ' + rarity;
            }
            for (const [key, value] of Object.entries(this.itemsCharToType)) {
                if(first)
                    first = false;
                else
                    string += ', '
                var rarity = RL.Util.mapRateToRarity(this.entities[key]);
                var name = RL.Item.Types[value].name;
                string += name + ' - ' + rarity;
            }
            for (const [key, value] of Object.entries(this.furnitureCharToType)) {
                if(value != 'crate')
                    continue;
                if(first)
                    first = false;
                else
                    string += ', '
                var rarity = RL.Util.mapRateToRarity(this.entities[key]);
                var name = RL.Furniture.Types[value].name;
                string += name + ' - ' + rarity;
            }
            return string;
        },
        
    };

    /**
    * Describes different floors. Used by the Floor constructor 'type' param.
    *
    *     Floor.Data = {
    *         1: {
    *            name: 'Meadow',
    *         },
    *         // ...
    *     }
    *
    * @class Floor.Data
    * @static
    */
    Floor.Data = {
        1: {
            name: 'Rolling Meadows',
            entities: {
                '.': 0.749,
                'b': 0.2,
                's': 0.05,
                '-': 0.001,
                // '.': 0.999,
                // 's': 0.001,
            },
            consoleColor: RL.Util.COLORS.gray,
            floorColor: RL.Util.COLORS.carnation_pink,
            floorBgColor: RL.Util.COLORS.green,
            wallColor: RL.Util.COLORS.brown,
            wallBgColor: RL.Util.COLORS.light_brown,
            entityCharToType: {
                s: 'slime'},
            furnitureCharToType: {
                b: 'bush',
                '+': 'door',
                '-': 'crate',},
            itemsCharToType: {},
            crateLoot: {
                F: 0.4,
                E: 0.3,
                D: 0.25,
                C: 0.05
            }
        },
        2: {
            name: 'The Great Forest',
            entities: {
                '.': 0.649,
                'm': 0.2,
                'T': 0.1,
                'w': 0.05,
                '-': 0.001
            },
            consoleColor: RL.Util.COLORS.green,
            floorColor: RL.Util.COLORS.gray,
            floorBgColor: RL.Util.COLORS.forest_green,
            wallColor: RL.Util.COLORS.light_brown,
            wallBgColor: RL.Util.COLORS.oak_brown,
            entityCharToType: {
                w: 'wolf',},
            furnitureCharToType: {
                m: 'leaf_pile',
                '+': 'door',
                T: 'oak_tree',
                '-': 'crate',},
            itemsCharToType: {},
            crateLoot: {
                F: 0.4,
                E: 0.3,
                D: 0.25,
                C: 0.05
            }
        },
        3: {
            name: 'The Caverns',
            entities: {
                '.': 0.443,
                'g': 0.2,
                'b': 0.15,
                'm': 0.1,
                'w': 0.1,
                's': 0.005,
                'k': 0.001,
                '-': 0.001
            },
            consoleColor: RL.Util.COLORS.cave_floor,
            floorColor: RL.Util.COLORS.cave_floor,
            floorBgColor: RL.Util.COLORS.cave_floor,
            wallColor: RL.Util.COLORS.cave_wall,
            wallBgColor: RL.Util.COLORS.cave_wall,
            entityCharToType: {
                g: 'goblin',
                k: 'goblin_king',},
            furnitureCharToType: {
                b: 'boulder',
                '+': 'door',
                m: 'mud',
                w: 'puddle',
                '-': 'crate',},
            itemsCharToType: {
                s: 'mushroom',
            },
            crateLoot: {
                F: 0.4,
                E: 0.3,
                D: 0.25,
                C: 0.05
            }
        },
    };

    root.RL.Floor = Floor;

}(this));
