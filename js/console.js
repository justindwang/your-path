(function(root) {
    'use strict';


    var extendedConsole = {

        directionsEl: null,

        clearDirections: function(){
            this.directionsEl.innerHTML = '';
        },
        directionsSelectActionTarget: function(action){
            var verb = this.wrapStr(action, RL.Util.COLORS.blue);
            this.directionsEl.innerHTML = this.wrapStr('(ENTER to select, movement keys for prev/next target, esc or other to cancel)', RL.Util.COLORS.blue_alt);
        },

        logWait: function(entity){
            entity = this.wrap(entity);
            this.log(entity + ' waited for a moment');
        },
        logHeal: function(target, amount){
            target = this.wrap(target);
            var healed = this.wrapStr('healed', RL.Util.COLORS.teal);
            amount = this.wrapStr(amount + ' hp', RL.Util.COLORS.green);
            this.log(target + ' ' + healed + ' ' + amount);
        },
        logStatChange: function(entity, stat, amount){
            entity = this.wrap(entity);
            stat = this.wrapStr(stat, RL.Util.COLORS.gray_alt);
            if (amount >= 0)
                var verb = ' increased by ';
            else
                var verb = ' decreased by ';
            amount = this.wrapStr(Math.abs(amount), RL.Util.COLORS.gray_alt);
            var points = this.wrapStr('points', RL.Util.COLORS.gray_alt);
            this.log(entity + '\'s ' + stat + verb + amount +' '+ points);
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
        logAttack: function(source, weapon, target){

            var weaponName = this.wrapStr(weapon.name);
            var weaponDamage = this.wrapStr(weapon.damage, RL.Util.COLORS.red_alt);
            var sourceName = this.wrap(source);
            var targetName = this.wrap(target);

            var msg = '' + sourceName + ' hits ' + targetName + ' with ' + weaponName + ' dealing ' + weaponDamage + ' damage';
            if(target.dead){
                if(target instanceof RL.Furniture){
                    msg += this.wrapStr(' Destroying It', RL.Util.COLORS.red_alt);
                } else {
                    msg += this.wrapStr(' Killing It', RL.Util.COLORS.red_alt);
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
        logPickUpHealing: function(entity, item){
            entity = this.wrap(entity);
            var consoleData = item.getConsoleName();
            var name = this.wrapStr(item.name,  consoleData.color);
            var healing = this.wrapStr('healing', 'teal');
            var hp = this.wrapStr(item.healAmount + 'HP', RL.Util.COLORS.green);
            this.log(entity + ' picked up a ' + name + ' ' + healing + ' ' + hp);
        },
        logCanNotPickupHealing: function(entity, item){
            entity = this.wrap(entity);
            item = this.wrap(item);
            this.game.console.log(entity + ' sees a ' + item + ' but has no use for it right now.');
        },
        logCanNotPickupWeapon: function(entity, currentWeapon, item){
            var currentItem = this.wrap(currentWeapon);
            entity = this.wrap(entity);
            item = this.wrap(item);
            this.game.console.log(entity + ' sees a ' + item + ' but it is not as good as ' + currentItem);
        },
        logGrab: function(entity, furniture){
            var entityName = this.wrap(entity);
            var furnitureName = this.wrap(furniture);
            this.log(entityName + ' grabs ' + furnitureName);
        },
        logGrabLetGo: function(entity, furniture){
            var entityName = this.wrap(entity);
            var furnitureName = this.wrap(furniture);
            this.log(entityName + ' lets go of ' + furnitureName);
        },
        logDied: function(entity){
            var entityName = this.wrap(entity);
            this.log(entityName + ' ' + this.wrapStr('died.', RL.Util.COLORS.red_alt));
        },
        logExit: function(entity){
            var entityName = this.wrap(entity);
            this.log(entityName + ' made it to the Exit. Level complete.');
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
            var verb = this.wrapStr(action, RL.Util.COLORS.blue);
            var targetName = this.wrap(target);
            this.log(verb + ' ' + targetName + '?');
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
