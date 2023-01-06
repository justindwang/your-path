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
        fighter: {
            name: 'Fighter',
            equipEffect: function() {
                // give 'evade' skill to player - dodge next attack
                this.game.player.strengthGrowth++;
            },
            unequipEffect: function(){
                // remove 'evade' skill from player
                this.game.player.strengthGrowth--;
            },
        },
        warrior: {
            name: 'Warrior',
            equipEffect: function() {
                // give 'smash' skill to player - aoe?
                
                this.game.player.vitalityGrowth++;
            },
            unequipEffect: function(){
                // remove 'smash' skill from player
                this.game.player.vitalityGrowth--;
            },
        },
        ranger: {
            name: 'Ranger',
            equipEffect: function() {
                // give 'far_shot' skill to player - extra range hit
                this.game.player.luckGrowth++;
            },
            unequipEffect: function(){
                // give 'far_shot' skill to player
                this.game.player.luckGrowth--;
            },
        },
        mage: {
            name: 'Mage',
            equipEffect: function() {
                // give 'fireball' skill to player
                this.game.player.intelligenceGrowth++;
            },
            unequipEffect: function(){
                // give 'fireball' skill to player
                this.game.player.intelligenceGrowth--;
            },
        },
        thief: {
            name: 'Thief',
            equipEffect: function() {
                // give 'backstab' skill to player - crits
                this.game.player.agilityGrowth++;
            },
            unequipEffect: function(){
                // give 'backstab' skill to player
                this.game.player.agilityGrowth--;
            },
        },
    };

    root.RL.Job = Job;

}(this));
