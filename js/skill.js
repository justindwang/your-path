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
        // class specific skills
        zen_strike: {
            name: 'Zen Strike',
            rank: 'Unique',
            description: 'Deal 100% Str Dmg (Radius: 2)',
            mpCost: 10,
            performEffect: function() {
                this.game.player.selfAoeSkillAttack(this, this.game.player.strength, 2);
            },
        },
        final_cut: {
            name: 'Final Cut',
            rank: 'Unique',
            description: 'Deal 300% Str Dmg (Range: 1)',
            mpCost: 50,
            performEffect: function() {
                this.game.player.skillAttack(this, this.game.player.strength * 3, 1);
            },
        },
        photosynthesis: {
            name: 'Photosynthesis',
            rank: 'Unique',
            description: 'Heals half of one\'s HP',
            mpCost: 20,
            performEffect: function() {
                this.game.player.heal(Math.floor(this.game.player.hpMax/2));
            },
        },
        evade: {
            name: 'Evade',
            rank: 'Unique',
            description: 'Dodges the next attack',
            mpCost: 5,
            performEffect: function() {
                if(this.game.player.dodgeNext == 0)
                    this.game.player.dodgeNext = 1;
            },
        },
        qi_shot: {
            name: 'Qi Shot',
            rank: 'Unique',
            description: 'Deal 100% Luck Dmg (Range: 2, Targets: 2)',
            mpCost: 10,
            performEffect: function() {
                this.game.player.multiSkillAttack(this, this.game.player.luck * 2, 2, 2);
            },
        },
        temper_tantrum: {
            name: 'Temper Tantrum',
            rank: 'Unique',
            description: 'Deal 1 to 50 Dmg (Radius: 2)',
            mpCost: 5,
            performEffect: function() {
                this.game.player.selfAoeSkillAttack(this, RL.Util.random(1,50), 2);
            },
        },
        foxfire: {
            name: 'Foxfire',
            rank: 'Unique',
            description: 'Deal 150% Int Dmg (Range: 3, Targets: 5)',
            mpCost: 20,
            performEffect: function() {
                this.game.player.multiSkillAttack(this, Math.ceil(this.game.player.intelligence * 1.5), 3, 5);
            },
        },
        cash_flow: {
            name: 'Cash Flow',
            rank: 'Unique',
            description: 'Obtain 1 to 100 gold',
            mpCost: 10,
            performEffect: function() {
                var gold = RL.Util.random(1,100);
                this.game.player.gold += gold;
                this.game.console.log(this.game.console.wrap(this.game.player) + ' gained ' + gold + ' gold');
            },
        },
        clean_finish: {
            name: 'Clean Finish',
            rank: 'Unique',
            description: 'Deal 200% Agi Dmg (Range: 1)',
            mpCost: 5,
            performEffect: function() {
                this.game.player.skillAttack(this, this.game.player.agility * 2, 1);
            },
        },
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

        // base skills
        slash: {
            name: 'Slash',
            rank: 'F',
            description: 'Deal 12 Dmg (Range: 1)',
            mpCost: 2,
            performEffect: function() {
                this.game.player.skillAttack(this, 12, 1);
            },
        },
        smash: {
            name: 'Smash',
            rank: 'F',
            description: 'Deal 5 Dmg (Radius: 1)',
            mpCost: 2,
            performEffect: function() {
                this.game.player.selfAoeSkillAttack(this, 5, 1);
            },
        },
        far_shot: {
            name: 'Far Shot',
            rank: 'F',
            description: 'Deal 5 Dmg (Range: 4)',
            mpCost: 2,
            performEffect: function() {
                this.game.player.skillAttack(this, 5, 4);
            },
        },
        fireball: {
            name: 'Fireball',
            rank: 'F',
            description: 'Deal 8 Dmg (Range: 2, Splash: 1)',
            mpCost: 2,
            performEffect: function() {
                this.game.player.aoeSkillAttack(this, 8, 2, 1);
            },
        },
        backstab: {
            name: 'Backstab',
            rank: 'F',
            description: 'Deal 15 Dmg (Range: 1)',
            mpCost: 2,
            performEffect: function() {
                this.game.player.skillAttack(this, 15, 1);
            },
        },

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
                this.game.player.skillAttack(this, Math.ceil(this.game.player.strength * 2.5), 1);
            }
        },
        
    };

    root.RL.Skill = Skill;

}(this));
