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
        // base classes
        knight: {
            name: 'Knight',
            sprite: 'knight',
            description: 'trustworthy and noble',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'evade'));
                this.game.player.strengthGrowth++;
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.strengthGrowth--;
            },
        },
        knightess: {
            name: 'Knightess',
            sprite: 'knightess',
            description: 'fearless and gentle',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'evade'));
                this.game.player.strengthGrowth++;
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.strengthGrowth--;
            },
        },
        warrior: {
            name: 'Warrior',
            sprite: 'warrior',
            description: 'cheerful and undying',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'smash'));
                this.game.player.vitalityGrowth++;
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.vitalityGrowth--;
            },
        },
        warrioress: {
            name: 'Warrioress',
            sprite: 'warrioress',
            description: 'brave and dependable',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'smash'));
                this.game.player.vitalityGrowth++;
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.vitalityGrowth--;
            },
        },
        ranger: {
            name: 'Ranger',
            sprite: 'ranger',
            description: 'keen and accurate',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'far_shot'));
                this.game.player.luckGrowth++;
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.luckGrowth--;
            },
        },
        archeress: {
            name: 'Archeress',
            sprite: 'archeress',
            description: 'swift and majestic',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'far_shot'));
                this.game.player.luckGrowth++;
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.luckGrowth--;
            },
        },
        mage: {
            name: 'Mage',
            sprite: 'mage',
            description: 'witty and resourceful',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'fireball'));
                this.game.player.intelligenceGrowth++;
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.intelligenceGrowth--;
            },
        },
        sorceress: {
            name: 'Sorceress',
            sprite: 'sorceress',
            description: 'young and curious',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'fireball'));
                this.game.player.intelligenceGrowth++;
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.intelligenceGrowth--;
            },
        },
        ninja: {
            name: 'Ninja',
            sprite: 'ninja',
            description: 'silent and deadly',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'backstab'));
                this.game.player.agilityGrowth++;
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.agilityGrowth--;
            },
        },
        kunoichi: {
            name: 'Kunoichi',
            sprite: 'kunoichi',
            description: 'patient and agile',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'backstab'));
                this.game.player.agilityGrowth++;
                this.game.player.sprite = this.sprite;
            },
            unequipEffect: function(){
                this.game.player.agilityGrowth--;
            },
        },
    };

    root.RL.Job = Job;

}(this));
