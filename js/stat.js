(function(root) {
    'use strict';

    var Stat = function Stat(game, type) {
        this.game = game;
        this.type = type;
        var typeData = Stat.Types[type];
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
            getStats: function(){
                return this.count;
            },
        },
    };

    var makeCounterStat = function(obj){
        return RL.Util.merge(obj, Defaults.counter);
    };

    Stat.Types = {
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
        slimes_killed: makeCounterStat({
            name: 'Slimes Killed',
            group: 'combat',
            rank: 'F',
        }),
        wolves_killed: makeCounterStat({
            name: 'Wolves Killed',
            group: 'combat',
            rank: 'F',
        }),
        bushes_destroyed: makeCounterStat({
            name: 'Bushes Destroyed',
            group: 'combat',
            rank: 'F',
        }),
        trees_destroyed: makeCounterStat({
            name: 'Trees Destroyed',
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
    };
    


    root.RL.Stat = Stat;

}(this));
