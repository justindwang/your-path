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

        // The entities that can appear on this floor [unlucky to lucky]
        entities: null,
        
        // The colors of the entities that can appear on this floor (same mapping as entities)
        entityColors: null,

        // enemy list
        // enemies: null,

        consoleColor: false,

        floorColors: null,

        wallColors: null,

        doorColors: null,

        getConsoleName: function(){
            return {
                name: this.name,
                color: this.consoleColor
            };
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
            name: 'Field of Dawn',
            // entities: ['slime', 'floor', 'floor', 'floor', 'bush', 'floor'],
            entities: {
                '.': 0.75,
                'b': 0.2,
                's': 0.05,
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
        },
        2: {
            name: 'The Great Forest',
            // entities: ['wolf', 'floor', 'floor', 'floor', 'shrub', 'oak_tree', 'wolf'],
            entities: {
                '.': 0.65,
                'm': 0.2,
                'T': 0.1,
                'w': 0.05,
            },
            consoleColor: RL.Util.COLORS.green,
            floorColor: RL.Util.COLORS.gray,
            floorBgColor: RL.Util.COLORS.forest_green,
            wallColor: RL.Util.COLORS.light_brown,
            wallBgColor: RL.Util.COLORS.oak_brown,
            entityCharToType: {
                w: 'wolf',},
            furnitureCharToType: {
                m: 'shrub',
                '+': 'door',
                T: 'oak_tree',
                '-': 'crate'},
            itemsCharToType: {},
        },
    };

    root.RL.Floor = Floor;

}(this));
