(function(root) {
    'use strict';

    /**
    * Represents an outfit in the game.
    * @class Outfit
    * @constructor
    * @param {Object} game - Game instance this obj is attached to.
    * @param {String} type - Outfit type. When created this object is merged with the value of Outfit.Data[type].
    */
    var Outfit = function Outfit(game, type) {
        this.game = game;
        this.type = type;

        var outfitData = Outfit.Data[type];
        RL.Util.merge(this, outfitData);

        if(this.init){
            this.init();
        }
    };

    Outfit.prototype = {
        constructor: Outfit,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        type: null,

        /**
        * Display name for this outfit.
        * @property name
        * @type {String}
        */
        name: null,

        sprite: null,

        getConsoleName: function(){
            return {
                name: this.name,
            };
        },
    };

    Outfit.Data = {
        casual_hoodie: {
            name: 'Casual Hoodie',
            sprite: 'casual_hoodie',
            description: 'warm and comfy',
        },
        casual_blouse: {
            name: 'Casual Blouse',
            sprite: 'casual_blouse',
            description: 'comes with cute frills',
        },
        // assignable classes
        keikogi: {
            name: 'Keikogi',
            sprite: 'kendoka',
            description: 'made with simple fabrics',
        },
        hooded_cloak: {
            name: 'Hooded Cloak',
            sprite: 'ivory_reaper',
            description: 'mysterious but stylish',
        },
        floral_armor: {
            name: 'Floral Armor',
            sprite: 'flower_fighter',
            description: 'a sweet fragrance follows',
        },
        midnight_cloak: {
            name: 'Midnight Cloak',
            sprite: 'black_swordsman',
            description: 'just a little edgy',
        },
        daopao: {
            name: 'Daopao',
            sprite: 'archery_disciple',
            description: 'plain and respectful',
        },
        tiny_dress: {
            name: 'Tiny Dress',
            sprite: 'preschooler',
            description: 'handpicked with love',
        },
        patterned_kimono: {
            name: 'Patterned Kimono',
            sprite: 'kitsune',
            description: 'beautifully woven',
        },
        work_suit: {
            name: 'Work Suit',
            sprite: 'businessman',
            description: 'perfectly ironed',
        },
        lofty_dress: {
            name: 'Lofty Dress',
            sprite: 'battle_maid',
            description: 'orderly and spotless',
        },
        autumn_dress: {
            name: 'Autumn Dress',
            sprite: 'enchantress',
            description: 'colorful and dazzling',
        },
        
        // base classes
        silver_armor: {
            name: 'Silver Armor',
            sprite: 'knight',
            description: 'basic protection',
        },
        cobalt_armor: {
            name: 'Cobalt Armor',
            sprite: 'knightess',
            description: 'basic protection',
        },
        trusty_chainmail: {
            name: 'Trusty Chainmail',
            sprite: 'warrior',
            description: 'capable of taking hits',
        },
        leather_chainmail: {
            name: 'Leather Chainmail',
            sprite: 'warrioress',
            description: 'capable of taking hits',
        },
        green_rags: {
            name: 'Green Rags',
            sprite: 'ranger',
            description: 'blends with the forest',
        },
        flowy_rags: {
            name: 'Flowy Rags',
            sprite: 'archeress',
            description: 'blends with the forest',
        },
        blue_robe: {
            name: 'Blue Robe',
            sprite: 'mage',
            description: 'a magician\'s staple',
        },
        purple_robe: {
            name: 'Purple Robe',
            sprite: 'sorceress',
            description: 'a magician\'s staple',
        },
        ninja_gear: {
            name: 'Ninja Gear',
            sprite: 'ninja',
            description: 'for hiding in shadows',
        },
        black_haori: {
            name: 'Black Haori',
            sprite: 'kunoichi',
            description: 'for hiding in shadows',
        },
    };

    root.RL.Outfit = Outfit;

}(this));
