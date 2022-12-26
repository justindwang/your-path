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

        consoleColor: false,

        hp: null,

        hpMax: null,

        strength: null,

        exp: null,

        /**
        * Determines if this entity has been killed and needs to be removed.
        * @property dead
        * @type bool
        */
        dead: false,

        playerLastSeen: false,

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
    };

    var Defaults = {
        seekingMeleeEntity: {
            playerLastSeen: false,
            turnsSinceStumble: 0,
            bleeds: true,
            

            update: function() {
                var result = this._update();
                this.hordePushBonus = 0;
                return result;
            },
            /**
             * Called every turn by the entityManger (entity turns are triggered after player actions are complete)
             * @method update
             */
            _update: function() {

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
                if(this.playerLastSeen) {
                    destination = this.getNextPathTile(this.playerLastSeen.x, this.playerLastSeen.y);

                    if(!destination) {
                        // get next path tile ignoring furniture and entities
                        destination = this.getNextPathTile(this.playerLastSeen.x, this.playerLastSeen.y, true);
                        if(destination) {
                            var _this = this;
                            var furniture = this.game.furnitureManager.getFirst(destination.x, destination.y, function(furniture) {
                                return !furniture.passable && _this.canPerformActionOnTarget('attack', furniture);
                            });

                            if(furniture && this.performAction('attack', furniture)) {
                                return true;
                            }

                            var entity = this.game.entityManager.get(destination.x, destination.y);
                            if(entity && this.performAction('horde_push_bonus', entity)) {
                                return true;
                            }
                        }
                    }
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
                this.hordePushBonus = 0;
                return result;
            },
            /**
             * Called every turn by the entityManger (entity turns are triggered after player actions are complete)
             * @method update
             */
            _update: function() {
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

    var makeSeekingMeleeEntity = function(obj){
        return RL.Util.merge(obj, Defaults.seekingMeleeEntity);
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
        zombie: makeSeekingMeleeEntity({
            name: 'Zombie',
            char: 'z',
            color: RL.Util.COLORS.red,
            bgColor: false,
            charStrokeColor: '#000',
            charStrokeWidth: 2,
            consoleColor: RL.Util.COLORS.red_alt,
            hp: 3,
            hpMax: 3,
            strength: 0,
            exp: 2,
            maxTurnsWithoutStumble: 10,
            hordePushBonus: 0,
            initialize: function() {
                this.weapon = new RL.Item(this.game, 'claws');
                RL.Actions.Resolvable.add(this, 'attack');
                RL.Actions.Resolvable.add(this, 'horde_push_bonus');

                RL.Actions.Performable.add(this, 'attack');
                RL.Actions.Performable.add(this, 'horde_push_bonus');
            },
        }),
        slime: makeNonSeekingMeleeEntity({
            name: 'Slime',
            char: 's',
            color: RL.Util.COLORS.blue,
            bgColor: false,
            charStrokeColor: '#000',
            charStrokeWidth: 2,

            consoleColor: RL.Util.COLORS.blue,

            maxTurnsWithoutStumble: 3,
            hp: 1,
            hpMax: 1,
            strength: 0,
            exp: 2,
            hordePushBonus: 0,
            initialize: function() {
                this.weapon = new RL.Item(this.game, 'goo');
                RL.Actions.Resolvable.add(this, 'attack');
                RL.Actions.Resolvable.add(this, 'horde_push_bonus');

                RL.Actions.Performable.add(this, 'attack');
                RL.Actions.Performable.add(this, 'horde_push_bonus');
            },
        }),
    };

    root.RL.Entity = Entity;

}(this));
