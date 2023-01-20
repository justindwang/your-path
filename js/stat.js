(function(root) {
    'use strict';

    var Stat = function Stat(game, key) {
        this.game = game;
        this.key = key;
        var typeData = Stat.List[key];
        RL.Util.merge(this, typeData);
        this.color = RL.Util.mapRankToColor(this.rank);
    };

    Stat.prototype = {
        constructor: Stat,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        type: null,

        name: null,

        rank: 'F',

        show: true,

        group: null,
        
        rank: 'F',

        color: null,

        showInMenu: function(){
            this.show = true;
        },

        getConsoleName: function(){
            return {
                name: this.name,
                color: this.color,
            };
        },

        getClass: function(){
            return 'stat';
        },
    };

    var Defaults = {
        counter: {
            count: 0,
            increment: function(){
                this.count++;
            },
            incrementBy: function(amount){
                this.count += amount;
            },
            getStats: function(){
                return this.count;
            },
        },
    };

    var makeCounterStat = function(obj){
        return RL.Util.merge(obj, Defaults.counter);
    };

    Stat.List = {
        tiles_traveled: makeCounterStat({
            name: 'Tiles Traveled',
            group: 'misc',
            rank: 'F',
        }),
        crates_opened: makeCounterStat({
            name: 'Crates Opened',
            group: 'misc',
            rank: 'F',
        }),
        enemies_killed: makeCounterStat({
            name: 'Enemies Killed',
            group: 'combat',
            rank: 'F',
        }),
        objects_destroyed: makeCounterStat({
            name: 'Objects Destroyed',
            group: 'combat',
            rank: 'F',
        }),
        weapons_collected: makeCounterStat({
            name: 'Weapons Collected',
            group: 'combat',
            rank: 'F',
        }),
        hp_healed: makeCounterStat({
            name: 'HP Healed',
            group: 'healing',
            rank: 'E'
        }),
        mp_restored: makeCounterStat({
            name: 'MP restored',
            group: 'healing',
            rank: 'E'
        }),
        skills_used: makeCounterStat({
            name: 'Skills Used',
            group: 'misc',
            rank: 'E'
        }),
        gold_earned: makeCounterStat({
            name: 'Gold Earned',
            group: 'misc',
            rank: 'E'
        }),
    };
    


    root.RL.Stat = Stat;

}(this));
