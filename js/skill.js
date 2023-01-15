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
            mpCost: 20,
            performEffect: function() {
                this.game.player.heal(Math.floor(this.game.player.hpMax/2));
            },
            
        },
        powerbuff_gorl: {
            name: 'Powerbuff Gorl',
            rank: 'B',
            description: 'Increases strength stat by 1~10',
            mpCost: 20,
            performEffect: function() {
                this.game.player.statChange('strength', RL.Util.random(1,10));
            },
        },
        evade: {
            name: 'Evade',
            rank: 'F',
            description: 'Dodges the next incoming attack',
            mpCost: 3,
            performEffect: function() {
                if(this.game.player.dodgeNext == 0)
                    this.game.player.dodgeNext = 1;
            },
        },
        smash: {
            name: 'Smash',
            rank: 'F',
            description: 'Deal 50% Vit Dmg (Radius: 1)',
            mpCost: 2,
            performEffect: function() {
                this.game.player.selfAoeSkillAttack(this, Math.ceil(this.game.player.vitality * 0.5), 1);
            },
        },
        far_shot: {
            name: 'Far Shot',
            rank: 'F',
            description: 'Deal 100% Luck Dmg (Range: 4)',
            mpCost: 2,
            performEffect: function() {
                this.game.player.skillAttack(this, this.game.player.luck, 4);
            },
        },
        fireball: {
            name: 'Fireball',
            rank: 'F',
            description: 'Deal 100% Int Dmg (Range: 2, Splash: 1)',
            mpCost: 2,
            performEffect: function() {
                this.game.player.aoeSkillAttack(this, Math.ceil(this.game.player.intelligence * 1.5), 2, 1);
            },
        },
        backstab: {
            name: 'Backstab',
            rank: 'F',
            description: 'Deal 150% Agi Dmg (Range: 1)',
            mpCost: 2,
            performEffect: function() {
                this.game.player.skillAttack(this, Math.ceil(this.game.player.agility * 1.2), 1);
            },
        },

        // class specific skills


        // fillin spells to cover ranks
        slice: {
            name: 'Slice',
            rank: 'E',
            description: 'Deal 100% Agi and Str Dmg (Range: 1)',
            mpCost: 5,
            performEffect: function() {
                this.game.player.skillAttack(this, this.game.player.strength + this.game.player.agility, 1);
            },
        },
        triple_shot: {
            name: 'Triple Shot',
            rank: 'D',
            description: 'Deal 50% Luck Dmg (Range: 2, Targets: 3)',
            mpCost: 8,
            performEffect: function() {
                this.game.player.multiSkillAttack(this, Math.ceil(this.game.player.luck * 0.5), 2, 3);
            },
        },
        shockwave: {
            name: 'Shockwave',
            rank: 'C',
            description: 'Deal 150% Vit Dmg (Range: 3)',
            mpCost: 12,
            performEffect: function() {
                this.game.player.selfAoeSkillAttack(this, Math.ceil(this.game.player.vitality * 1.5), 3);
            },
        },
        lightning_bolt: {
            name: 'Lightning Bolt',
            rank: 'A',
            description: 'Deal 200% Int Dmg (Range: 3)',
            mpCost: 30,
            performEffect: function() {
                this.game.player.skillAttack(this, Math.ceil(this.game.player.intelligence * 2), 3);
            },
        },
        burst_blade: {
            name: 'Burst Blade',
            rank: 'S',
            description: 'Deal 250% Str Dmg (Range: 1)',
            mpCost: 50,
            performEffect: function() {
                this.game.player.skillAttack(this, Math.ceil(this.game.player.strength * 2.5), 3);
            }
        },
        
    };

    root.RL.Skill = Skill;

}(this));
