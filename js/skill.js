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
        this.color = RL.Util.mapRankToColor(this.rank);

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

        color: null,
        description: null,
        tooltip: null,
        mpCost: null,

        getConsoleName: function(){
            return {
                name: this.name,
                description: this.description,
                tooltip: this.tooltip,
                color: this.color,
                selected: this.selected,
                rank: this.rank,
                mpCost: this.mpCost,
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
            rank: 'B',
            description: 'Heals half of one\'s HP immediately',
            mpCost: 5,
            performEffect: function() {
                this.game.player.heal(Math.floor(this.game.player.hpMax/2));
            },
            
        },
        powerbuff_gorl: {
            name: 'Powerbuff Gorl',
            rank: 'B',
            description: 'Increases strength stat by 1~10',
            mpCost: 3,
            performEffect: function() {
                this.game.player.statChange('strength', RL.Util.random(1,10));
                // this.game.player.strength += RL.Util.random(1,10);
            },
        },
        test1: {
            name: 'test1',
            rank: 'B',
            description: 'Increases strength stat by 1~10',
            mpCost: 3,
            performEffect: function() {
                this.game.player.statChange('strength', RL.Util.random(1,10));
                // this.game.player.strength += RL.Util.random(1,10);
            },
        },
        test2: {
            name: 'test2',
            rank: 'B',
            description: 'Increases strength stat by 1~10',
            mpCost: 3,
            performEffect: function() {
                this.game.player.statChange('strength', RL.Util.random(1,10));
                // this.game.player.strength += RL.Util.random(1,10);
            },
        },
        test3: {
            name: 'test3',
            rank: 'B',
            description: 'Increases strength stat by 1~10',
            mpCost: 3,
            performEffect: function() {
                this.game.player.statChange('strength', RL.Util.random(1,10));
                // this.game.player.strength += RL.Util.random(1,10);
            },
        },
        test4: {
            name: 'test4',
            rank: 'B',
            description: 'Increases strength stat by 1~10',
            mpCost: 3,
            performEffect: function() {
                this.game.player.statChange('strength', RL.Util.random(1,10));
                // this.game.player.strength += RL.Util.random(1,10);
            },
        },
        
    };

    root.RL.Skill = Skill;

}(this));
