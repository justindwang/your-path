(function(root) {
    'use strict';

    /**
    * Represents a job in the game.
    * @class Job
    * @constructor
    * @param {Object} game - Game instance this obj is attached to.
    * @param {String} type - Job type. When created this object is merged with the value of Job.Data[type].
    */
    var Job = function Job(game, type) {
        this.game = game;
        this.type = type;

        var jobData = Job.Data[type];
        RL.Util.merge(this, jobData);
        // this.color = RL.Util.mapRankToColor(this.rank);

        if(this.init){
            this.init();
        }
    };

    Job.prototype = {
        constructor: Job,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        type: null,

        /**
        * Display name for this job.
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

    Job.Data = {
        // assignable classes
        kendoka: {
            name: 'Kendoka',
            sprite: 'kendoka',
            description: 'simple and steadfast',
            outfit: 'keikogi',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'zen_strike'));
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('zen_strike');
            },
        },
        ivory_reaper: {
            name: 'Ivory Reaper',
            sprite: 'ivory_reaper',
            description: 'ominous and menacing',
            outfit: 'hooded_cloak',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'final_cut'));
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('final_cut');
            },
        },
        flower_fighter: {
            name: 'Flower Fighter',
            sprite: 'flower_fighter',
            description: 'graceful and vibrant',
            outfit: 'floral_armor',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'photosynthesis'));
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('photosynthesis');
            },
        },
        black_swordsman: {
            name: 'Black Swordsman',
            sprite: 'black_swordsman',
            description: 'skilled and battle-tested',
            outfit: 'midnight_cloak',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'evade'));
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('evade');
            },
        },
        archery_disciple: {
            name: 'Archery Disciple',
            sprite: 'archery_disciple',
            description: 'eager and sharp',
            outfit: 'daopao',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'qi_shot'));
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('qi_shot');
            },
        },
        preschooler: {
            name: 'Preschooler',
            sprite: 'preschooler',
            description: 'playful and energetic',
            outfit: 'tiny_dress',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'temper_tantrum'));
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('temper_tantrum');
            },
        },
        kitsune: {
            name: 'Kitsune',
            sprite: 'kitsune',
            description: 'mischievous and wise',
            outfit: 'patterned_kimono',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'foxfire'));
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('foxfire');
            },
        },
        businessman: {
            name: 'Businessman',
            sprite: 'businessman',
            description: 'hardworking and professional',
            outfit: 'work_suit',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'cash_flow'));
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('cash_flow');
            },
        },
        battle_maid: {
            name: 'Battle Maid',
            sprite: 'battle_maid',
            description: 'reliable and thorough',
            outfit: 'lofty_dress',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'clean_finish'));
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('clean_finish');
            },
        },
        enchantress: {
            name: 'Enchantress',
            sprite: 'enchantress',
            description: 'mystical and alluring',
            outfit: 'autumn_dress',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'embrace'));
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('embrace');
            },
        },
        
        // base classes
        knight: {
            name: 'Knight',
            sprite: 'knight',
            description: 'trustworthy and noble',
            outfit: 'silver_armor',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'slash'));
            },
            unequipEffect: function(){
            },
        },
        knightess: {
            name: 'Knightess',
            sprite: 'knightess',
            description: 'fearless and gentle',
            outfit: 'cobalt_armor',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'slash'));
            },
            unequipEffect: function(){
            },
        },
        warrior: {
            name: 'Warrior',
            sprite: 'warrior',
            description: 'cheerful and durable',
            outfit: 'trusty_chainmail',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'smash'));
            },
            unequipEffect: function(){
            },
        },
        warrioress: {
            name: 'Warrioress',
            sprite: 'warrioress',
            description: 'brave and dependable',
            outfit: 'leather_chainmail',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'smash'));
            },
            unequipEffect: function(){
            },
        },
        ranger: {
            name: 'Ranger',
            sprite: 'ranger',
            description: 'keen and accurate',
            outfit: 'green_rags',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'far_shot'));
            },
            unequipEffect: function(){
            },
        },
        archeress: {
            name: 'Archeress',
            sprite: 'archeress',
            description: 'swift and majestic',
            outfit: 'flowy_rags',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'far_shot'));
            },
            unequipEffect: function(){
            },
        },
        mage: {
            name: 'Mage',
            sprite: 'mage',
            description: 'witty and resourceful',
            outfit: 'blue_robe',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'fireball'));
            },
            unequipEffect: function(){
            },
        },
        sorceress: {
            name: 'Sorceress',
            sprite: 'sorceress',
            description: 'young and curious',
            outfit: 'purple_robe',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'fireball'));
            },
            unequipEffect: function(){
            },
        },
        ninja: {
            name: 'Ninja',
            sprite: 'ninja',
            description: 'silent and deadly',
            outfit: 'ninja_gear',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'backstab'));
            },
            unequipEffect: function(){
            },
        },
        kunoichi: {
            name: 'Kunoichi',
            sprite: 'kunoichi',
            description: 'patient and agile',
            outfit: 'black_haori',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'backstab'));
            },
            unequipEffect: function(){
            },
        },
    };

    root.RL.Job = Job;

}(this));
