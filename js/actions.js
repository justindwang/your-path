(function(root) {
    'use strict';

    /**
     * Surface api functions added to an object
     */
    var performableActionMixin = {
        getTargetsForAction: function(action, settings){
            var handler = this.performableActions[action];
            if(!handler){
                return false;
            }

            if(!handler.getTargetsForAction){
                return false;
            }

            settings = settings || {};
            if(!settings.skipCanPerformAction && !this.canPerformAction(action, settings)){
                return false;
            }

            return handler.getTargetsForAction.call(this, settings);
        },

        /**
         * Checks if source can perform an action with given settings.
         * Functionality seperated to avoid checking multiple targets when source cannot perform action regardless of target.
         * @method canPerformAction
         * @param {string} action
         * @param {Object} settings
         * @return {Boolean}
         */
        canPerformAction: function(action, settings){
            var handler = this.performableActions[action];
            if(!handler){
                return false;
            }
            if(handler.canPerformAction === false){
                return false;
            }

            if(!(handler.canPerformAction === true || handler.canPerformAction.call(this, settings))){
                return false;
            }
            return true;
        },

        /**
         * Checks if source can perform an action on target with given settings.
         * @method canPerformActionOnTarget
         * @param {string} action
         * @param {Object} target
         * @param {Object} settings
         * @return {Boolean}
         */
        canPerformActionOnTarget: function(action, target, settings){
            var handler = this.performableActions[action];
            if(!handler){
                return false;
            }
            // target cannot resolve any actions
            if(!target.canResolveAction){
                return false;
            }

            settings = settings || {};
            if(!settings.skipCanPerformAction && !this.canPerformAction(action, settings)){
                return false;
            }

            if(!(handler.canPerformActionOnTarget === true || handler.canPerformActionOnTarget.call(this, target, settings))){
                return false;
            }
            return target.canResolveAction(action, this, settings);
        },

        /**
         * Performs an action on target and with given settings.
         * @method performAction
         * @param {String} action
         * @param {Object} target
         * @param {Object} settings
         * @return {Boolean} true if the action has been successfully completed.
         */
        performAction: function(action, target, settings){
            var handler = this.performableActions[action];
            if(!handler){
                return false;
            }

            settings = settings || {};
            if(!settings.skipCanPerformActionOnTarget && !this.canPerformActionOnTarget(action, target, settings)){
                return false;
            } else if(!settings.skipCanPerformAction && !this.canPerformAction(action, settings)){
                return false;
            }

            var result;
            if(handler.performAction === true){
                result = {};
            } else {
                result = handler.performAction.call(this, target, settings);
            }

            if(result === false){
                return false;
            }
            settings.result = result;
            var outcome = target.resolveAction(action, this, settings);
            if(outcome && handler.afterPerformActionSuccess){
                handler.afterPerformActionSuccess.call(this, target, settings);
            } else if(!outcome && handler.afterPerformActionFailure){
                handler.afterPerformActionFailure.call(this, target, settings);
            }
            this.lastAction = {
                action: action,
                source: this,
                target: target,
                settings: settings,
            };
            return outcome;
        },
    };

    /**
     * Surface api functions added to an object
     */
    var resolvableActionMixin = {
        /**
         * Checks if a target can resolve an action with given source and settings.
         * @method canResolveAction
         * @param {String} action
         * @param {Object} source
         * @param {Object} settings
         * @return {Boolean} true if action was successfully resolved
         */
        canResolveAction: function(action, source, settings){
            var handler = this.resolvableActions[action];
            if(!handler){
                return false;
            }
            if(handler.canResolveAction === false){
                return false;
            }
            if(handler.canResolveAction === true){
                return true;
            }
            return handler.canResolveAction.call(this, source, settings);
        },

        /**
         * Resolves an action on target from source with given settings.
         * @method performAction
         * @param {String} action
         * @param {Object} source
         * @param {Object} settings
         * @return {Boolean} true if the action was successfully completed.
         */
        resolveAction: function(action, source, settings){
            var handler = this.resolvableActions[action];
            if(!handler){
                return false;
            }
            settings = settings || {};
            if(!settings.skipCanResolveAction && !this.canResolveAction(action, source, settings)){
                return false;
            }

            if(handler.resolveAction === false){
                return false;
            }
            if(handler.resolveAction === true){
                return true;
            }
            return handler.resolveAction.call(this, source, settings);
        },
    };

    var makeAdjacentTargetsFinder = function(action){
        return function(settings){
            var _this = this;
            var validTargetsSettings = {
                range: 1,
                limitToFov: false,
                limitToNonDiagonalAdjacent: true,
                filter: function(target){
                    return _this.canPerformActionOnTarget(action, target, settings);
                }
            };
            var validTargetsFinder = new RL.ValidTargetsFinder(this.game, this, validTargetsSettings);
            return validTargetsFinder.getValidTargets();
        };
    };

    var performableActions = {

        open: {
            canPerformAction: true,
            canPerformActionOnTarget: true,
            performAction: function(target){
                this.game.console.logOpen(this, target);
                return true;
            },
            getTargetsForAction: makeAdjacentTargetsFinder('open')
        },
        close: {
            canPerformAction: true,
            canPerformActionOnTarget: true,
            performAction: function(target){
                this.game.console.logClose(this, target);
                return true;
            },
            getTargetsForAction: makeAdjacentTargetsFinder('close')
        },
        push: {
            canPerformAction: true,
            canPerformActionOnTarget: true,
            performAction: true,
            getTargetsForAction: makeAdjacentTargetsFinder('push')
        },

        attack: {
            canPerformAction: function(target, settings){
                if(!this.weapon){
                    this.game.console.log('you do not have a weapon');
                    return false;
                }
                return true;
            },
            canPerformActionOnTarget: function(target, settings){
                // if this is a mob
                if(!this.fov)
                    return true;
                
                // if this is a player
                if(!this.fov.get(target.x, target.y)){
                    return false;
                }
                // range has already been checked by validTargets
                return true;
            },
            performAction: function(target, settings){
                return {
                    damage: this.weapon.damage,
                    weapon: this.weapon
                };
            },
            getTargetsForAction: function(settings){
                var _this = this;
                var validTargetsSettings = {
                    range: this.weapon.range,
                    limitToFov: true,
                    filter: function(target){
                        return _this.canPerformActionOnTarget('attack', target, settings);
                    }
                };
                var validTargetsFinder = new RL.ValidTargetsFinder(this.game, this, validTargetsSettings);
                return validTargetsFinder.getValidTargets();
            }
        },
    };

    var resolvableActions = {
        open: {
            initialize: function(){
                this.open = false;
            },
            canResolveAction: function(source, settings){
                return !this.open;
            },
            resolveAction: function(source, settings){
                if(this.type == 'door'){
                    this.passable = true;
                    this.blocksLos = false;
                    this.open = true;
                    this.char = "'";
                    return true;
                }
                else if(this.type == 'crate'){
                    RL.Util.arrFind(this.game.menu.stats, 'crates_opened').increment();
                    this.game.furnitureManager.remove(this);
                    var loot = new RL.Item(this.game, this.game.generateCrateLoot(this.game.floor.crateLoot));
                    var crate_x = this.x;
                    var crate_y = this.y;
                    this.game.itemManager.add(crate_x, crate_y, loot);
                    return true;
                }
            },
        },
        close: {
            initialize: function(){
                this.open = false;
            },
            canResolveAction: function(source, settings){
                if(!this.open){
                    return false;
                }
                // prevent closing door on entity
                var entity = this.game.entityManager.get(this.x, this.y);
                if(entity){
                    console.log('prevent closing door on entity');
                    return false;
                }
                return true;
            },
            resolveAction: function(source, settings){
                this.passable = false;
                this.blocksLos = true;
                this.open = false;
                this.char = "+";
                return true;
            },
        },
        push: {
            canResolveAction: function(source, settings){
                var pusherX = source.x,
                    pusherY = source.y,
                    directionX = this.x - pusherX,
                    directionY = this.y - pusherY,
                    targetX = this.x + directionX,
                    targetY = this.y + directionY;

                return this.canMoveTo(targetX, targetY);
            },
            resolveAction: function(source, settings){
                var prevX = this.x,
                    prevY = this.y,
                    pusherX = source.x,
                    pusherY = source.y,
                    directionX = this.x - pusherX,
                    directionY = this.y - pusherY,
                    targetX = this.x + directionX,
                    targetY = this.y + directionY;

                // push target source into tile
                this.moveTo(targetX, targetY);
                if(source.canMoveTo(prevX, prevY)){
                    // move player into previously occupied tile
                    source.moveTo(prevX, prevY);
                }
                return true;
            }
        },
        attack: {
            canResolveAction: true,
            resolveAction: function(source, settings){
                if(this.dead)
                    return false;
                var result = settings.result;

                if(this == this.game.player){
                    if (this.game.player.attemptDodge(source.strength)){
                        this.game.console.logDodge(this, source);
                        return true;
                    }
                }
                var finalDamage = 0;
                if(source == this.game.player){
                    if(this.game.player.attemptCrit())
                        finalDamage = Math.floor(2.5 * source.strength);
                    else
                        finalDamage = source.strength;
                }
                else
                    finalDamage = source.strength;
                
                this.takeDamage(finalDamage);

                var weapon = {
                    name: result.weapon.name,
                    damage: finalDamage
                };
                
                this.game.console.logAttack(source, weapon, this);
                if(this.dead){
                    var entity_x = this.x;
                    var entity_y = this.y;
                    if (this.getClass() == 'entity'){
                    
                        var loot = this.generateLoot();
                        if (loot != 'nothing' && !this.game.itemManager.get(entity_x, entity_y)){
                            loot = new RL.Item(this.game, loot);
                            this.game.itemManager.add(entity_x, entity_y, loot);
                        }
                        this.game.entityManager.remove(this);
                        if(this.game.player == source){
                            source.gainExp(this.exp);
                            RL.Util.arrFind(this.game.menu.stats, 'enemies_killed').increment();
                        }
                    }
                    else if (this.getClass() == 'furniture'){
                        this.game.furnitureManager.remove(this);
                        RL.Util.arrFind(this.game.menu.stats, 'objects_destroyed').increment();
                    }
                }

                var smash = {
                    source: source,
                    target: this,
                    type: 'attack',
                    targetX: this.x,
                    targetY: this.y,
                    sourceX: source.x,
                    sourceY: source.y
                };

                this.game.smashLayer.set(source.x, source.y, smash);
                this.game.damageLayer.set(this.x, this.y, finalDamage);

                if(this.bleeds){
                    var splatter = source.strength / 10;
                    if(this.dead){
                        splatter *= 1.5;
                    }
                    this.game.splatter(this.x, this.y, splatter);
                }
                return true;
            },
        },
    };


    var mixIfNotFound =function(object, mixin){
        for(var key in mixin){
            if(!object[key]){
                object[key] = mixin[key];
            }
        }
        return object;
    };

    var Actions = {
        Performable: {
            add: function(obj, name, implementation){
                mixIfNotFound(obj, performableActionMixin);

                obj.performableActions                  = obj.performableActions                    || {};
                obj.performableActions[name]            = obj.performableActions[name]              || {};
                obj.performableActions[name].actionName = obj.performableActions[name].actionName   || name;

                var source = implementation || performableActions[name];

                obj.performableActions[name] = Object.create(source);
                // RL.Util.merge(obj.performableActions[name], source);

                if(obj.performableActions[name].initialize){
                    obj.performableActions[name].initialize.call(obj);
                }
            }
        },
        Resolvable: {
            add: function(obj, name, implementation){
                mixIfNotFound(obj, resolvableActionMixin);

                obj.resolvableActions                   = obj.resolvableActions                     || {};
                obj.resolvableActions[name]             = obj.resolvableActions[name]               || {};
                obj.resolvableActions[name].actionName  = obj.resolvableActions[name].actionName    || name;

                var source = implementation || resolvableActions[name];
                obj.resolvableActions[name] = Object.create(source);
                // RL.Util.merge(obj.resolvableActions[name], source);

                if(obj.resolvableActions[name].initialize){
                    obj.resolvableActions[name].initialize.call(obj);
                }
            }
        }
    };

    root.RL.Actions = Actions;
}(this));
