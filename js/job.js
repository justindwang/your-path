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
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'zen_strike'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('zen_strike');
            },
        },
        ivory_reaper: {
            name: 'Ivory Reaper',
            sprite: 'ivory_reaper',
            description: 'ominous and menacing',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'final_cut'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('final_cut');
            },
        },
        flower_fighter: {
            name: 'Flower Fighter',
            sprite: 'flower_fighter',
            description: 'graceful and vibrant',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'photosynthesis'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('photosynthesis');
            },
        },
        black_swordsman: {
            name: 'Black Swordsman',
            sprite: 'black_swordsman',
            description: 'skilled and battle-tested',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'evade'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('evade');
            },
        },
        archery_disciple: {
            name: 'Archery Disciple',
            sprite: 'archery_disciple',
            description: 'eager and sharp',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'qi_shot'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('qi_shot');
            },
        },
        preschooler: {
            name: 'Preschooler',
            sprite: 'preschooler',
            description: 'playful and energetic',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'temper_tantrum'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('temper_tantrum');
            },
        },
        kitsune: {
            name: 'Kitsune',
            sprite: 'kitsune',
            description: 'mischievous and wise',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'foxfire'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('foxfire');
            },
        },
        businessman: {
            name: 'Businessman',
            sprite: 'businessman',
            description: 'hardworking and professional',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'cash_flow'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('cash_flow');
            },
        },
        battle_maid: {
            name: 'Battle Maid',
            sprite: 'battle_maid',
            description: 'reliable and thorough',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'clean_finish'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.forgetSkill('clean_finish');
            },
        },
        
        // base classes
        knight: {
            name: 'Knight',
            sprite: 'knight',
            description: 'trustworthy and noble',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'slash'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
            },
        },
        knightess: {
            name: 'Knightess',
            sprite: 'knightess',
            description: 'fearless and gentle',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'slash'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
            },
        },
        warrior: {
            name: 'Warrior',
            sprite: 'warrior',
            description: 'cheerful and durable',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'smash'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
            },
        },
        warrioress: {
            name: 'Warrioress',
            sprite: 'warrioress',
            description: 'brave and dependable',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'smash'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
            },
        },
        ranger: {
            name: 'Ranger',
            sprite: 'ranger',
            description: 'keen and accurate',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'far_shot'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
            },
        },
        archeress: {
            name: 'Archeress',
            sprite: 'archeress',
            description: 'swift and majestic',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'far_shot'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
            },
        },
        mage: {
            name: 'Mage',
            sprite: 'mage',
            description: 'witty and resourceful',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'fireball'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
            },
        },
        sorceress: {
            name: 'Sorceress',
            sprite: 'sorceress',
            description: 'young and curious',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'fireball'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
            },
        },
        ninja: {
            name: 'Ninja',
            sprite: 'ninja',
            description: 'silent and deadly',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'backstab'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
            },
        },
        kunoichi: {
            name: 'Kunoichi',
            sprite: 'kunoichi',
            description: 'patient and agile',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'backstab'));
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
            },
        },
    };

    root.RL.Job = Job;

}(this));
