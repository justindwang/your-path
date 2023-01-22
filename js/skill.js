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

        passive: false,

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
        performOnHit: function(){},
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
            sprite: 'zen_strike',
            rank: 'Unique',  
            description: 'Deal 100% Strength damage in a 2 tile radius',
            mpCost: 10,
            performEffect: function() {
                this.game.player.selfAoeSkillAttack(this, this.game.player.strength, 2);
            },
        },
        final_cut: {
            name: 'Final Cut',
            sprite: 'final_cut',
            rank: 'Unique',
            description: 'Deal 300% Strength damage to an enemy within 1 tile',
            mpCost: 50,
            performEffect: function() {
                this.game.player.skillAttack(this, this.game.player.strength * 3, 1);
            },
        },
        photosynthesis: {
            name: 'Photosynthesis',
            sprite: 'photosynthesis',
            rank: 'Unique',
            description: 'Heals half of one\'s HP',
            mpCost: 20,
            performEffect: function() {
                this.game.player.heal(Math.floor(this.game.player.hpMax/2));
            },
        },
        evade: {
            name: 'Evade',
            sprite: 'evade',
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
            sprite: 'qi_shot',
            rank: 'Unique',
            description: 'Deal 100% Luck damage to 3 targets within 2 tiles',
            mpCost: 10,
            performEffect: function() {
                this.game.player.multiSkillAttack(this, this.game.player.luck * 2, 2, 3);
            },
        },
        temper_tantrum: {
            name: 'Temper Tantrum',
            sprite: 'temper_tantrum',
            rank: 'Unique',
            description: 'Deal 1 to 50 damage in a 2 tile radius',
            mpCost: 5,
            performEffect: function() {
                this.game.player.selfAoeSkillAttack(this, RL.Util.random(1,50), 2);
            },
        },
        foxfire: {
            name: 'Foxfire',
            sprite: 'evade',
            rank: 'Unique',
            description: 'Deal 150% Intelligence damage to 5 targets within 3 tiles',
            mpCost: 20,
            performEffect: function() {
                this.game.player.multiSkillAttack(this, Math.ceil(this.game.player.intelligence * 1.5), 3, 5);
            },
        },
        cash_flow: {
            name: 'Cash Flow',
            sprite: 'evade',
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
            sprite: 'evade',
            rank: 'Unique',
            description: 'Deal 200% Agility damage to an enemy within 1 tile',
            mpCost: 5,
            performEffect: function() {
                this.game.player.skillAttack(this, this.game.player.agility * 2, 1);
            },
        },
        embrace: {
            name: 'Embrace',
            sprite: 'evade',
            rank: 'Unique',
            description: 'Stuns an enemy within 2 tiles for 3 seconds',
            mpCost: 15,
            performEffect: function() {
                this.game.player.skillStun(this, 3, 2);
            },
        },
        // test skills
        pancake_torch: {
            name: 'Pancake Torch',
            sprite: 'evade',
            rank: 'B',
            description: 'Heals half of one\'s HP immediately',
            mpCost: 20,
            performEffect: function() {
                this.game.player.heal(Math.floor(this.game.player.hpMax/2));
            },
            
        },
        powerbuff_gorl: {
            name: 'Powerbuff Gorl',
            sprite: 'evade',
            rank: 'B',
            description: 'Increases strength stat by 1~10',
            mpCost: 20,
            performEffect: function() {
                this.game.player.statChange('strength', RL.Util.random(1,10));
            },
        },
        // on hit passives
        salvage: {
            name: 'Salvage',
            sprite: 'evade',
            rank: 'C',
            description: 'Passive - Chance to heal 1 health on hit',
            mpCost: 0,
            passive: true,
            performOnHit: function() {
                if(RL.Util.random(0,1)==1){
                    this.game.player.hp += 1;
                    if(this.game.player.hp > this.game.player.hpMax)
                        this.game.player.hp = this.game.player.hpMax;
                    RL.Util.arrFind(this.game.menu.stats, 'hp_healed').incrementBy(1);
                }
            },
        },
        intuition: {
            name: 'Intuition',
            sprite: 'evade',
            rank: 'C',
            description: 'Passive - Chance to restore 1 mp on hit',
            mpCost: 0,
            passive: true,
            performOnHit: function() {
                if(RL.Util.random(0,1)==1){
                    this.game.player.mp += 1;
                    if(this.game.player.mp > this.game.player.mpMax)
                        this.game.player.mp = this.game.player.mpMax;
                    RL.Util.arrFind(this.game.menu.stats, 'mp_restored').incrementBy(1);
                }
            },
        },
        golden_touch: {
            name: 'Golden Touch',
            sprite: 'evade',
            rank: 'C',
            description: 'Passive - Chance to earn 1 gold on hit',
            mpCost: 0,
            passive: true,
            performOnHit: function() {
                if(RL.Util.random(0,1)==1){
                    this.game.player.gold += 1;
                    RL.Util.arrFind(this.game.menu.stats, 'gold_earned').incrementBy(1);
                }
            },
        },
        // base skills
        slash: {
            name: 'Slash',
            sprite: 'evade',
            rank: 'F',
            description: 'Deal 12 damage to an enemy within 1 tile',
            mpCost: 2,
            performEffect: function() {
                this.game.player.skillAttack(this, 12, 1);
            },
        },
        smash: {
            name: 'Smash',
            sprite: 'evade',
            rank: 'F',
            description: 'Deal 5 damage in a 1 tile radius',
            mpCost: 2,
            performEffect: function() {
                this.game.player.selfAoeSkillAttack(this, 5, 1);
            },
        },
        far_shot: {
            name: 'Far Shot',
            sprite: 'evade',
            rank: 'F',
            description: 'Deal 5 damage to an enemy within 4 tiles',
            mpCost: 2,
            performEffect: function() {
                this.game.player.skillAttack(this, 5, 4);
            },
        },
        fireball: {
            name: 'Fireball',
            sprite: 'evade',
            rank: 'F',
            description: 'Deal 8 splash damage to enemies within 2 tiles',
            mpCost: 2,
            performEffect: function() {
                this.game.player.aoeSkillAttack(this, 8, 2, 1);
            },
        },
        backstab: {
            name: 'Backstab',
            sprite: 'evade',
            rank: 'F',
            description: 'Deal 15 damage to an enemy within 1 tile',
            mpCost: 2,
            performEffect: function() {
                this.game.player.skillAttack(this, 15, 1);
            },
        },

        // fillin spells to cover ranks
        slice: {
            name: 'Slice',
            sprite: 'evade',
            rank: 'E',
            description: 'Deal 100% Agi and Str Dmg (Range: 1)',
            mpCost: 5,
            performEffect: function() {
                this.game.player.skillAttack(this, this.game.player.strength + this.game.player.agility, 1);
            },
        },
        triple_shot: {
            name: 'Triple Shot',
            sprite: 'evade',
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
            sprite: 'evade',
            rank: 'A',
            description: 'Deal 200% Int Dmg (Range: 3)',
            mpCost: 30,
            performEffect: function() {
                this.game.player.skillAttack(this, Math.ceil(this.game.player.intelligence * 2), 3);
            },
        },
        burst_blade: {
            name: 'Burst Blade',
            sprite: 'evade',
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
