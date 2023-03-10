(function(root) {
    'use strict';

    /**
    * Represents an entity in the game. Usually a character or enemy.
    * Manages state (position, health, stats, etc)
    * Occupies a single game map tile.
    * @class Entity
    * @constructor
    * @uses TileDraw
    * @param {Game} game - Game instance this obj is attached to.
    * @param {String} type - Type of entity. When created this object is merged with the value of Entity.Types[type].
    */
    var Entity = function Entity(game, type) {
        this.game = game;
        this.type = type;
        var typeData = Entity.Types[type];
        RL.Util.merge(this, typeData);

        if(this.initialize){
            this.initialize();
        }
    };

    Entity.prototype = {
        constructor: Entity,

        /**
        * Game instance this object is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * The type of entity this is.
        * When created this object is merged with the value of Entity.Types[type].
        * @property type
        * @type String
        */
        type: null,

        /**
        * Called when the entity is first created. Intended to be assigned by Entity.Types.
        * @method initialize
        */
        initialize: function(){

        },

        /**
        * Name used when referencing or describing this entity.
        * Used in console messages.
        * @property name
        * @type String
        */
        name: null,

        /**
        * The x map tile coord of this entity.
        * @property x
        * @type Number
        */
        x: null,

        /**
        * The y map tile coord of this entity.
        * @property y
        * @type Number
        */
        y: null,

        /**
        * The character displayed when rendering this entity.
        * @property char
        * @type String
        */
        char: 'x',

        /**
        * The color of the character displayed when rendering this entity. Not rendered if false.
        * @property color
        * @type String|bool
        */
        color: '#fff',

        /**
        * The background color the character displayed when rendering this entity. Not rendered if false.
        * @property bgColor
        * @type String|bool
        */
        bgColor: false,

        charStrokeColor: '#000',
        charStrokeWidth: 2,

        consoleColor: false,

        fontSize: 15,
        
        font: 'Segoe UI',

        hp: null,

        hpMax: null,

        strength: null,

        agility: 0,
        vitality: 0,
        intelligence: 0,

        exp: null,

        /**
        * Determines if this entity has been killed and needs to be removed.
        * @property dead
        * @type bool
        */
        dead: false,
        
        stunTurns: 0,

        playerLastSeen: false,

        getClass: function(){
            return 'entity';
        },

        takeDamage: function(amount) {
            this.hp -= amount;
            if(this.hp <= 0) {
                this.color = RL.Util.COLORS.hp_red;
                this.dead = true;
            }
        },

        /**
        * Called after a player action has been resolved. Resolves this entities turn.
        * @method update
        */
        update: function() {

        },

        /**
        * Checks if an entity can move through a map tile.
        * Convenience method for this.game.canMoveThrough()
        * @method canMoveThrough
        * @param {Number} x - The tile map x coord to check if this entity can move to.
        * @param {Number} y - The tile map y coord to check if this entity can move to.
        * @return {Bool}
        */
        canMoveThrough: function(x, y){
            return this.game.entityCanMoveTo(this, x, y);
        },

        /**
        * Checks if an entity can move through and into a map tile and that tile is un-occupied.
        * Convenience method for this.game.entityCanMoveTo()
        * @method canMoveTo
        * @param {Number} x - The tile map x coord to check if this entity can move to.
        * @param {Number} y - The tile map y coord to check if this entity can move to.
        * @return {Bool}
        */
        canMoveTo: function(x, y){
            return this.game.entityCanMoveTo(this, x, y);
        },

        /**
        * Changes the position of this entity on the map.
        * Convenience method for this.game.entityMoveTo()
        * this.canMoveTo() and/or this.canMoveThrough() should always be checked before calling this.moveTo()
        * @method moveTo
        * @param {Number} x - The tile map x coord to move to.
        * @param {Number} y - The tile map y coord to move to.
        */
        moveTo: function(x, y) {
            return this.game.entityMoveTo(this, x, y);
        },

        /**
        * Checks if a map tile can be seen through.
        * Convenience method for this.game.entityCanSeeThrough()
        * @method canSeeThrough
        * @param {Number} x - The x map tile coord to check.
        * @param {Number} y - The y map tile coord to check.
        * @return {Bool}
        */
        canSeeThrough: function(x, y){
            return this.game.entityCanSeeThrough(this, x, y);
        },

        /**
        * Handles the behavior of a player or other entity attempting to move into the tile coord this entity is currently occupying.
        * @method bump
        * @param {Player|Entity} entity - The player or entity attemplting to move into this entity's tile.
        * @return {Bool} true if bumping this entity completes the action of the bumping entity.
        */
        bump: function(entity){
            return false;
        },

        getConsoleName: function() {
            return {
                name: this.name,
                color: this.consoleColor
            };
        },

        canMoveTo: function(x, y, ignoreExtra) {
            if(ignoreExtra) {
                return this.game.entityCanMoveThrough(this, x, y, true);
            } else {
                return this.game.entityCanMoveTo(this, x, y);
            }

        },

        updatePlayerLastSeen: function() {
            if(this.playerVisible()) {
                this.playerLastSeen = {
                    x: this.game.player.x,
                    y: this.game.player.y
                };
            }

            // if reached player last seen at tile clear it
            if(this.playerLastSeen &&
                this.x === this.playerLastSeen.x &&
                this.y === this.playerLastSeen.y
            ) {
                this.playerLastSeen = false;
            }
        },

        getRandomAdjacentTile: function() {
            var directions = ['up', 'down', 'left', 'right'];
            var adjacent = [];

            for(var i = directions.length - 1; i >= 0; i--) {
                var dir = directions[i];
                var offset = RL.Util.getOffsetCoordsFromDirection(dir);
                var adjTileX = this.x + offset.x;
                var adjTileY = this.y + offset.y;
                if(this.canMoveTo(adjTileX, adjTileY)) {
                    adjacent.push({
                        x: adjTileX,
                        y: adjTileY
                    });
                }
            }

            if(adjacent && adjacent.length) {
                return adjacent[Math.floor(Math.random() * adjacent.length)];
            }
            return false;
        },

        isAdjacent: function(x, y) {
            return(
                (x === this.x && (y === this.y - 1 || y === this.y + 1)) ||
                (y === this.y && (x === this.x - 1 || x === this.x + 1))
            );
        },

        playerVisible: function() {
            return this.game.player.fov.get(this.x, this.y);
        },

        getNextPathTile: function(x, y, ignoreExtra) {
            var path = this.getPathToTile(x, y, ignoreExtra);
            path.splice(0, 1);
            if(path[0] && path[0].x !== void 0 && path[0].y !== void 0) {
                return path[0];
            }
        },
        getPathToTile: function(x, y, ignoreExtra) {
            var _this = this,
                path = [],
                computeCallback = function(x, y) {
                    path.push({
                        x: x,
                        y: y
                    });
                },
                passableCallback = function(x, y) {
                    if(_this.x === x && _this.y === y) {
                        return true;
                    }
                    return _this.canMoveTo(x, y, ignoreExtra);
                },
                // prepare path to given coords
                aStar = new ROT.Path.AStar(x, y, passableCallback, {
                    topology: 4
                });

            // compute from current tile coords
            aStar.compute(this.x, this.y, computeCallback);
            return path;
        },
        applyWeaponStats: function(weapon){
            if(weapon.stat1)
                this[RL.Util.mapAbbrToStat(weapon.stat1)] = Math.max(0, this[RL.Util.mapAbbrToStat(weapon.stat1)] + weapon.stat1Modifier);
            if(weapon.stat2)
                this[RL.Util.mapAbbrToStat(weapon.stat2)] = Math.max(0, this[RL.Util.mapAbbrToStat(weapon.stat2)] + weapon.stat2Modifier);
            if(weapon.stat3)
                this[RL.Util.mapAbbrToStat(weapon.stat3)] = Math.max(0, this[RL.Util.mapAbbrToStat(weapon.stat3)] + weapon.stat3Modifier);
        },
        generateLoot: function(){
            return RL.Util.getRandomFromRate(this.loot);
        },
    };

    var Defaults = {
        MeleeEntity: {
            playerLastSeen: false,
            turnsSinceStumble: 0,
            bleeds: true,
            

            update: function() {
                var result = this._update();
                return result;
            },
            /**
             * Called every turn by the entityManger (entity turns are triggered after player actions are complete)
             * @method update
             */
            _update: function() {
                if (this.stunTurns > 0){
                    this.stunTurns--;
                    this.game.console.log(this.game.console.wrap(this) + ' is stunned');
                    return true;
                }
                var stumbleChance = this.turnsSinceStumble / this.maxTurnsWithoutStumble;
                if(this.turnsSinceStumble && Math.random() < stumbleChance) {
                    this.turnsSinceStumble = 0;
                    return true;
                }
                this.turnsSinceStumble++;

                this.updatePlayerLastSeen();

                if(this.isAdjacent(this.game.player.x, this.game.player.y)) {
                    return this.performAction('attack', this.game.player);
                }

                var destination;
                var distance = RL.Util.getDistance(this.x, this.y, this.game.player.x, this.game.player.y);
                if(this.playerLastSeen && this.aggroRange>=distance) {
                    destination = this.getNextPathTile(this.playerLastSeen.x, this.playerLastSeen.y);

                    // if(!destination) {
                    //     // get next path tile ignoring furniture and entities
                    //     destination = this.getNextPathTile(this.playerLastSeen.x, this.playerLastSeen.y, true);
                    //     if(destination) {
                    //         var _this = this;
                    //         var furniture = this.game.furnitureManager.getFirst(destination.x, destination.y, function(furniture) {
                    //             return !furniture.passable && _this.canPerformActionOnTarget('attack', furniture);
                    //         });

                    //         if(furniture && this.performAction('attack', furniture)) 
                    //             return true;
                    //         var entity = this.game.entityManager.get(destination.x, destination.y);
                    //         if(entity) 
                    //             return true;
                    //     }
                    // }
                }

                if(!destination) {
                    destination = this.getRandomAdjacentTile();
                }

                if(destination) {
                    this.moveTo(destination.x, destination.y);
                    return true;
                }
            },
        },
        nonSeekingMeleeEntity: {
            playerLastSeen: false,
            turnsSinceStumble: 0,
            bleeds: true,
            

            update: function() {
                var result = this._update();
                return result;
            },
            /**
             * Called every turn by the entityManger (entity turns are triggered after player actions are complete)
             * @method update
             */
            _update: function() {
                if (this.stunTurns > 0){
                    this.stunTurns--;
                    this.game.console.log(this.game.console.wrap(this) + ' is stunned');
                    return true;
                }
                var stumbleChance = this.turnsSinceStumble / this.maxTurnsWithoutStumble;
                if(this.turnsSinceStumble && Math.random() < stumbleChance) {
                    this.turnsSinceStumble = 0;
                    return true;
                }
                this.turnsSinceStumble++;

                if(this.isAdjacent(this.game.player.x, this.game.player.y)) 
                    return this.performAction('attack', this.game.player);

                var destination = this.getRandomAdjacentTile();

                if(destination) {
                    this.moveTo(destination.x, destination.y);
                    return true;
                }
            },
        },
    };

    RL.Util.merge(Entity.prototype, RL.Mixins.TileDraw);

    var makeMeleeEntity = function(obj){
        return RL.Util.merge(obj, Defaults.MeleeEntity);
    };

    var makeNonSeekingMeleeEntity = function(obj){
        return RL.Util.merge(obj, Defaults.nonSeekingMeleeEntity);
    };

    /**
    * Describes different types of entities. Used by the Entity constructor 'type' param.
    *
    *     Entity.Types = {
    *         zombie: {
    *            name: 'Zombie',
    *            char: 'z',
    *            color: 'red',
    *            bgColor: '#222'
    *         },
    *         // ...
    *     }
    *
    * @class Entity.Types
    * @static
    */
    Entity.Types = {
        slime: makeMeleeEntity({
            name: 'Slime',
            sprite: 'slime',
            consoleColor: RL.Util.COLORS.blue,

            maxTurnsWithoutStumble: 3,
            hp: 10,
            hpMax: 10,
            strength: 0,
            exp: 2,
            aggroRange: 0,
            initialize: function() {
                this.weapon = new RL.Item(this.game, 'goo');
                this.applyWeaponStats(this.weapon);
                RL.Actions.Resolvable.add(this, 'attack');

                RL.Actions.Performable.add(this, 'attack');

            },
            loot: {
                nothing: 0.75,
                slime_goo: 0.25,
            },
        }),
        wolf: makeMeleeEntity({
            name: 'Wolf',
            sprite: 'wolf',
            consoleColor: RL.Util.COLORS.dark_gray,
            hp: 20,
            hpMax: 20,
            strength: 1,
            exp: 5,
            maxTurnsWithoutStumble: 10,
            aggroRange: 3,
            initialize: function() {
                this.weapon = new RL.Item(this.game, 'wolf_fang');
                this.applyWeaponStats(this.weapon);
                RL.Actions.Resolvable.add(this, 'attack');

                RL.Actions.Performable.add(this, 'attack');
            },
            loot: {
                nothing: 0.75,
                wolf_fur: 0.2,
                wolf_fang: 0.05
            },
        }),
        goblin: makeMeleeEntity({
            name: 'Goblin',
            sprite: 'goblin',
            consoleColor: RL.Util.COLORS.green,
            hp: 30,
            hpMax: 30,
            strength: 5,
            exp: 10,
            maxTurnsWithoutStumble: 25,
            aggroRange: 5,
            initialize: function() {
                this.weapon = new RL.Item(this.game, 'rusty_dagger');
                RL.Actions.Resolvable.add(this, 'attack');

                RL.Actions.Performable.add(this, 'attack');
            },
            loot: {
                nothing: 0.8,
                rusty_dagger: 0.15,
                coin_stash: 0.05
            },
        }),
        goblin_king: makeMeleeEntity({
            name: 'Goblin King',
            sprite: 'goblin_king',
            consoleColor: RL.Util.COLORS.dark_green,
            hp: 100,
            hpMax: 100,
            strength: 10,
            exp: 100,
            maxTurnsWithoutStumble: 10,
            aggroRange: 0,
            initialize: function() {
                this.weapon = new RL.Item(this.game, 'kings_resent');
                RL.Actions.Resolvable.add(this, 'attack');

                RL.Actions.Performable.add(this, 'attack');
            },
            loot: {
                kings_resent: 0.5,
                coin_stash: 0.5
            },
        }),
    };

    root.RL.Entity = Entity;

}(this));
