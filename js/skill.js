(function(root) {
    'use strict';

    /**
    * Represents a skill in the game.
    * @class Skill
    * @constructor
    * @param {Object} game - Game instance this obj is attached to.
    * @param {String} type - Skill type. When created this object is merged with the value of Skill.Data[type].
    */
    var Skill = function Skill(game, type) {
        this.game = game;
        this.type = type;

        var skillData = Skill.Data[type];
        RL.Util.merge(this, skillData);

        if(this.init){
            this.init();
        }
    };

    Skill.prototype = {
        constructor: Skill,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * The skill type.
        * When created this object is merged with the value of Skill.Data[type].
        * @property number
        * @type Object
        */
        type: null,

        /**
        * Display name for this skill.
        * @property name
        * @type {String}
        */
        name: null,

        consoleColor: false,
        description: null,
        tooltip: null,
        selected: false,

        getConsoleName: function(){
            return {
                name: this.name,
                description: this.description,
                tooltip: this.tooltip,
                color: this.consoleColor,
                selected: this.selected,
            };
        },
    };

    /**
    * Describes different skills. Used by the Skill constructor 'type' param.
    *
    *     Skill.Data = {
    *         'Quick Heal': {
    *            name: 'Quick Heal',
    *         },
    *         // ...
    *     }
    *
    * @class Skill.Data
    * @static
    */
    Skill.Data = {
        pancake_torch: {
            name: 'Pancake Torch',
            consoleColor: RL.Util.COLORS.peach,
            description: 'Heals half of one\'s HP immediately',
            tooltip: 'A cute pancake torch fights alongside you',
            selected: true,
            performEffect: function() {
                this.game.player.heal(Math.floor(this.game.player.hpMax/2));
            },
        },
        powerbuff_gorl: {
            name: 'Powerbuff Gorl',
            consoleColor: RL.Util.COLORS.carnation_pink,
            description: 'Increases strength stat by 1~10 points on this floor\n',
            tooltip: 'Feeling lucky?',
            performEffect: function() {
                this.game.player.strength += RL.Util.random(1,10);
            },
        },
    };

    root.RL.Skill = Skill;

}(this));
