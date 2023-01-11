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
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'evade'));
                this.game.player.strengthGrowth++;
            },
            unequipEffect: function(){
                this.game.player.strengthGrowth--;
            },
        },
        knightess: {
            name: 'Knightess',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'evade'));
                this.game.player.strengthGrowth++;
            },
            unequipEffect: function(){
                this.game.player.strengthGrowth--;
            },
        },
        warrior: {
            name: 'Warrior',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'smash'));
                this.game.player.vitalityGrowth++;
            },
            unequipEffect: function(){
                this.game.player.vitalityGrowth--;
            },
        },
        warrioress: {
            name: 'Warrioress',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'smash'));
                this.game.player.vitalityGrowth++;
            },
            unequipEffect: function(){
                this.game.player.vitalityGrowth--;
            },
        },
        ranger: {
            name: 'Ranger',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'far_shot'));
                this.game.player.luckGrowth++;
            },
            unequipEffect: function(){
                this.game.player.luckGrowth--;
            },
        },
        archeress: {
            name: 'Archeress',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'far_shot'));
                this.game.player.luckGrowth++;
            },
            unequipEffect: function(){
                this.game.player.luckGrowth--;
            },
        },
        mage: {
            name: 'Mage',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'fireball'));
                this.game.player.intelligenceGrowth++;
            },
            unequipEffect: function(){
                this.game.player.intelligenceGrowth--;
            },
        },
        sorceress: {
            name: 'Sorceress',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'fireball'));
                this.game.player.intelligenceGrowth++;
            },
            unequipEffect: function(){
                this.game.player.intelligenceGrowth--;
            },
        },
        ninja: {
            name: 'Ninja',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'backstab'));
                this.game.player.agilityGrowth++;
            },
            unequipEffect: function(){
                this.game.player.agilityGrowth--;
            },
        },
        kunoichi: {
            name: 'Kunoichi',
            equipEffect: function() {
                this.game.player.learnSkill(new RL.Skill(this.game, 'backstab'));
                this.game.player.agilityGrowth++;
            },
            unequipEffect: function(){
                this.game.player.agilityGrowth--;
            },
        },
    };

    root.RL.Job = Job;

}(this));
