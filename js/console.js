(function(root) {
    'use strict';


    var extendedConsole = {

        directionsEl: null,

        clearDirections: function(){
            this.directionsEl.innerHTML = '';
        },
        directionsSelectActionTarget: function(action){
            // var verb = this.wrapStr(action, RL.Util.COLORS.blue);
            // this.directionsEl.innerHTML = this.wrapStr('(ENTER to select, movement keys for prev/next target, esc or other to cancel)', RL.Util.COLORS.blue_alt);
        },

        logWait: function(entity){
            entity = this.wrap(entity);
            this.log(entity + ' waited for a moment');
        },
        logStatChange: function(entity, stat, amount){
            entity = this.wrap(entity);
            stat = this.wrapStr(stat, RL.Util.COLORS.stat_yellow);
            if (amount >= 0)
                var verb = ' increased by ';
            else
                var verb = ' decreased by ';
            amount = this.wrapStr(Math.abs(amount), RL.Util.COLORS.stat_yellow);
            this.log(entity + '\'s ' + stat + verb + amount +' points');
        },
        logUseSkill: function(entity, skill){
            var skillName = this.wrap(skill);
            // var skillCost = this.wrapStr(skill.mpCost + ' mp', RL.Util.COLORS.mp_blue);
            entity = this.wrap(entity);
            this.log(entity + ' used ' + skillName);
        },
        logCanNotUseSkill: function(entity, skill){
            entity = this.wrap(entity);
            skill = this.wrap(skill);
            this.game.console.log(entity + ' does not have enough mp to use ' + skill);
        },
        logLevelUp: function(level){
            var playerName = this.wrap(this.game.player);
            level = this.wrapStr(level, RL.Util.COLORS.exp_green);
            this.log(playerName + ' grew to level ' + level);
            this.log(playerName + '\'s stats increased by '+ this.wrapStr('1', RL.Util.COLORS.stat_yellow));
        },
        logAttack: function(source, weapon, target){

            var weaponName = this.wrapStr(weapon.name);
            var weaponDamage = this.wrapStr(weapon.damage, RL.Util.COLORS.red_alt);
            var targetExp = this.wrapStr(target.exp, RL.Util.COLORS.exp_green);
            var sourceName = this.wrap(source);
            var targetName = this.wrap(target);

            var msg = '' + sourceName + ' hit ' + targetName;
            if(target.dead){
                if(target instanceof RL.Furniture){
                    msg = '' + sourceName + ' destroyed ' + targetName;
                } else {
                    msg = '' + sourceName + ' killed ' + targetName + ' and gained ' + targetExp + ' exp';
                }
            }
            this.log(msg);
        },
        logTileInspect: function(tile, list){
            var msg = '';
            if(list.length){
                var _this = this;
                list = list.map(function(item){
                    return _this.wrap(item);
                });
                msg += this.wrap(this.game.player) + ' sees: ' + list.join(' and ') + ' on ' + this.wrap(tile);
            } else {
                msg = this.wrap(this.game.player) + ' sees: ' + this.wrap(tile);
            }

            this.log(msg);
        },
        logPickUp: function(entity, item){
            entity = this.wrap(entity);
            item = this.wrap(item);
            this.log(entity + ' picked up a ' + item);
        },
        logEquipItem: function(entity, item){
            entity = this.wrap(entity);
            item = this.wrap(item);
            this.log(entity + ' equipped ' + item);
        },
        logAddToInventory: function(entity, item){
            entity = this.wrap(entity);
            item = this.wrap(item);
            this.log(item + ' was added to '+ entity + '\'s inventory');
        },
        logHeal: function(target, amount){
            target = this.wrap(target);
            amount = this.wrapStr(amount, RL.Util.COLORS.hp_red);
            this.log(target + ' healed ' + amount + ' hp');
        },
        logCanNotHeal: function(item){
            // entity = this.wrap(entity);
            item = this.wrap(item);
            this.game.console.log(item + ' had no effect.');
        },
        logCanNotPickupWeapon: function(entity, currentWeapon, item){
            var currentItem = this.wrap(currentWeapon);
            entity = this.wrap(entity);
            item = this.wrap(item);
            this.game.console.log(entity + ' sees a ' + item + ' but it is not as good as ' + currentItem);
        },
        logDied: function(entity){
            var entityName = this.wrap(entity);
            this.log(entityName + ' ' + this.wrapStr('died.', RL.Util.COLORS.red_alt));
        },
        logExitReached: function(entity){
            var entityName = this.wrap(entity);
            this.log(entityName + ' made it to the gate. Proceed to next floor? (Y/N)');
        },
        logClose: function(entity, furniture){
            var entityName = this.wrap(entity);
            var furnitureName = this.wrap(furniture);
            this.log(entityName + ' closes the ' + furnitureName);
        },

        logOpen: function(entity, furniture){
            var entityName = this.wrap(entity);
            var furnitureName = this.wrap(furniture);
            this.log(entityName + ' opens the ' + furnitureName);
        },

        logNothingTo: function(verb){
            verb = this.wrapStr(verb, RL.Util.COLORS.blue);
            this.log(this.wrapStr('Nothing', RL.Util.COLORS.orange_alt) + ' to ' + verb);
        },

        logChooseDirection: function(verb){
            verb = this.wrapStr(verb, RL.Util.COLORS.blue);
            this.log(verb + ' where? '+ this.wrapStr('(choose direction)', RL.Util.COLORS.blue_alt));
        },

        logSelectActionTarget: function(action, target){
            // if(!target.dead){
            //     var verb = this.wrapStr(action, RL.Util.COLORS.blue);
            //     var targetName = this.wrap(target);
            //     this.log(verb + ' ' + targetName + '?');
            // }
        },
        logMultipleActionTargetsFound: function(action){
            var verb = this.wrapStr(action, RL.Util.COLORS.blue);
            var directions = this.wrapStr('(ENTER to select, movement keys for prev/next target)', RL.Util.COLORS.blue_alt);
            this.log('Multiple ' + verb + ' targets found ' + directions);
        },

        logSwitchSkill: function(skill){
            var skillName = this.wrap(skill);
            this.log(skillName + ' is now equipped.');
        },

        logAskConfirmHeal: function(item){
            this.log('Use ' + this.wrap(item) + '? (Click again to confirm.)');
        },

        logAskConfirmEquip: function(item){
            this.log('Equip ' + this.wrap(item) + '? (Click again to confirm.)');
        },

        loginspectMaterial: function(item){
            this.log('You have selected: ' + this.wrap(item));
        },
        logCurrentFloor: function(floor){
            this.log('Currently on: Floor '+ floor.number + ' - ' + floor.name);
        },

        wrap: function(obj){
            var data = obj.getConsoleName();
            var str = data.name;
            if(data.stats){
                str += ' ' + data.stats;
            }
            return this.wrapStr(data.name, data.color);
        },
        wrapStr: function(str, color){
            var style = '';
            if(typeof color === 'string'){
                style = ' style="color:' + color + '"';
            }
            return '<strong' + style + '>' + str + '</strong>';
        }

    };
    RL.Util.merge(root.RL.Console.prototype, extendedConsole);

}(this));
