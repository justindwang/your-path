(function(root) {
    'use strict';

    var proto = root.RL.Player.prototype;

    var NewPlayer = function Player(game){
        proto.constructor.call(this, game);

        this.weapon = new RL.Item(this.game, 'fists');
        this.applyWeaponStats(this.weapon);
        this.skills = [];
        this.inventory = [[new RL.Item(this.game, 'ascension_crystal'),1], [new RL.Item(this.game, 'descension_crystal'),1]];
        this.jobs = []
        RL.Actions.Performable.add(this, 'open');
        RL.Actions.Performable.add(this, 'close');
        RL.Actions.Performable.add(this, 'push');
        RL.Actions.Performable.add(this, 'attack');

        RL.Actions.Resolvable.add(this, 'attack');
    };

    var newPlayerPrototype = {
        constructor: NewPlayer,

        fovMaxViewDistance: 20,
        charStrokeColor: '#000',
        consoleColor: '#00a185',
        charStrokeWidth: 3,

        name: 'None',
        level: 1,
        job: null,
        title: 'None',
        
        exp: 0,
        expForNext: 55,

        gold: 100000,

        hp: 20,
        hpMax: 20,
        mp: 100,
        mpMax: 100,

        strength: 1,
        vitality: 1,
        agility: 1,
        intelligence: 1,
        luck: 1,

        statPoints: 0,

        strengthGrowth: 1,
        vitalityGrowth: 1,
        agilityGrowth: 1,
        intelligenceGrowth: 1,
        luckGrowth: 0,

        weapon: null,
        inventory: null,
        skillSlots: 4,
        skills: null,

        jobs: null,

        nameEl: null,
        levelEl: null,
        jobEl: null,
        titleEl: null,
        goldEl: null,
        hpEl: null,
        hpMaxEl: null,
        hpBarEl: null,
        mpEl: null,
        mpMaxEl: null,
        mpBarEl: null,
        strengthEl: null,
        vitalityEl: null,
        agilityEl: null,
        intelligenceEl: null,
        luckEl: null,

        pendingAction: false,

        bleeds: true,

        highestFloor: 1,
        dodgeNext: 0,

        getClass: function(){
            return 'player';
        },

        update: function(action) {
            this.renderHtml();
            if(action === 'cancel'){
                this.clearPendingAction();
            }

            if(this.pendingAction){
                return this.pendingAction(action);
            }

            var isMoveDirection = RL.Util.DIRECTIONS_4.indexOf(action) !== -1;
            if(isMoveDirection){
                return this.move(action);
            }

            if(action === 'attack'){
                return this.attack();
            }

            if(action === 'same_floor'){
                if(this.game.map.get(this.x, this.y).name == 'Exit')
                    this.game.goToFloor(this.game.floor.number);
                return true;
            }
            if(action === 'next_floor'){
                if( this.game.floor.number + 1 > this.highestFloor)
                    this.highestFloor = this.game.floor.number + 1;
                if(this.game.map.get(this.x, this.y).name == 'Exit')
                    this.game.goToFloor(this.game.floor.number + 1);
                return true;
            }
            if(action === 'cancel_replace'){
                this.game.menu.renderSkills();
                this.game.input.removeBindings({cancel_replace: ['esc']});
                let _console = this.game.console;
                _console.log(_console.wrap(this.game.player) + ' did not learn the new skill');
            }
            return false;
        },

        // action
        move: function(direction){
            var offset = RL.Util.getOffsetCoordsFromDirection(direction),
                x = this.x + offset.x,
                y = this.y + offset.y;

            if(this.canMoveTo(x, y)){

                this.moveTo(x, y);
                RL.Util.arrFind(this.game.menu.stats, 'tiles_traveled').increment();
                return true;

            } else {
                if(this.movePush(x, y)){
                    return true;
                }

                if(this.moveAttack(x, y)){
                    return true;
                }

                if(this.moveOpen(x, y)){
                    return true;
                }
            }
            return false;
        },

        movePush: function(x, y){
            var _this = this;
            var furniture = this.game.furnitureManager.getFirst(x, y, function(furniture){
                return _this.canPerformAction('push', furniture);
            });

            if(!furniture){
                return false;
            }
            return this.performAction('push', furniture);
        },

        moveAttack: function(x, y){
            var entity = this.game.entityManager.get(x, y);
            if(!entity){
                return false;
            }
            return this.performAction('attack', entity);
        },

        moveOpen: function(x, y){
            var _this = this;
            var furniture = this.game.furnitureManager.getFirst(x, y, function(furniture){
                return _this.canPerformAction('open', furniture);
            });

            if(!furniture){
                return false;
            }
            return this.performAction('open', furniture);
        },

        attack: function(){
            this.pendingActionName = 'attack';

            var targets = this.getTargetsForAction(this.pendingActionName);
            if(!targets.length){
                this.game.console.logNothingTo(this.pendingActionName);
                return false;
            }

            // uncomment this to auto perform an action when there is only one target
            // if(targets.length === 1){
            //     return this.performAction(this.pendingActionName, targets[0].value, this.pendingActionSettings);
            // }
            this.actionTargets = new RL.ValidTargets(this.game, targets);
            this.game.queueDraw = true;
            this.pendingAction = this.actionTargetSelect;
            this.game.console.directionsSelectActionTarget(this.pendingActionName);
            this.game.console.logSelectActionTarget(this.pendingActionName, this.actionTargets.getCurrent().value);

            return false;
        },

        useSkill: function(slotNum){
            if(this.skills[slotNum].mpCost <= this.mp){
                this.mp -= this.skills[slotNum].mpCost;
                this.game.console.logUseSkill(this, this.skills[slotNum]);
                RL.Util.arrFind(this.game.menu.stats, 'skills_used').increment();
                this.skills[slotNum].performEffect();
                this.renderHtml();
            }
            else
                this.game.console.logCanNotUseSkill(this, this.skills[slotNum]);
            return true;
        },

        actionAdjacentTargetSelect: function(action){
            var targets = this.getTargetsForAction(this.pendingActionName);
            if(!targets.length){
                this.game.console.logNothingTo(this.pendingActionName);
                this.clearPendingAction();
                return false;
            }

            // auto perform an action when there is only one target
            // if(targets.length === 1){
            //     return this.performAction(this.pendingActionName, targets[0].value, this.pendingActionSettings);
            // }
            this.actionTargets = new RL.ValidTargets(this.game, targets);
            this.actionTargets.ignoreCurrent = true;
            this.game.queueDraw = true;

            this.pendingAction = this.actionAdjacentDirectionTargetSelect;
            this.game.console.logChooseDirection(this.pendingActionName);
            return false;
        },

        // pending action
        actionAdjacentDirectionTargetSelect: function(action){
            var pendingActionName = this.pendingActionName;
            var actionTargets = this.actionTargets;

            if(action === pendingActionName){
                if(actionTargets.targets.length === 1){
                    this.clearPendingAction();
                    return this.performAction(pendingActionName, actionTargets.targets[0].value);
                }
                return false;
            }

            var isMoveDirection = RL.Util.DIRECTIONS_4.indexOf(action) !== -1;
            if(!isMoveDirection){
                this.clearPendingAction();
                return false;
            }

            var _this = this;
            var moveOffsetCoord = RL.Util.getOffsetCoordsFromDirection(action),
                moveToX = this.x + moveOffsetCoord.x,
                moveToY = this.y + moveOffsetCoord.y,
                objects = this.game.getObjectsAtPostion(moveToX, moveToY).filter(function(obj){
                    return _this.canPerformActionOnTarget(pendingActionName, obj);
                })
                // needs to be the same format as RL.ValidTargetsFinder.getValidTargets();
                .map(function(obj){
                    return {
                        x: obj.x,
                        y: obj.y,
                        range: 1,
                        value: obj
                    };
                });

            if(!objects.length){
                this.game.console.logNothingTo(pendingActionName);
                this.clearPendingAction();
                return false;
            }

            if(objects.length === 1){
                this.clearPendingAction();
                return this.performAction(pendingActionName, objects[0].value);
            }
            this.clearPendingAction();
            this.actionTargets = new RL.ValidTargets(this.game, objects);
            this.pendingAction = this.actionTargetSelect;
            this.game.console.directionsSelectActionTarget(this.pendingActionName);
            this.game.console.logSelectActionTarget(pendingActionName, this.actionTargets.getCurrent().value);
            return false;
        },

        // pending action
        actionTargetSelect: function(action){
            this.actionTargets.ignoreCurrent = false;
            if(
                action === 'prev_target' ||
                action === 'left' ||
                action === 'down'
            ){

                this.game.queueDraw = true;
                this.actionTargets.prev();
                this.game.console.logSelectActionTarget(this.pendingActionName, this.actionTargets.getCurrent().value);
                return false;
            }

            if(
                action === 'next_target' ||
                action === 'right' ||
                action === 'up'
            ){
                this.game.queueDraw = true;
                this.actionTargets.next();
                this.game.console.logSelectActionTarget(this.pendingActionName, this.actionTargets.getCurrent().value);
                return false;
            }

            if(action === this.pendingActionName || action === 'select'){
                var target = this.actionTargets.getCurrent().value;
                this.performAction(this.pendingActionName, target, this.pendingActionSettings);
                this.clearPendingAction();
                return true;
            }
            var target = this.actionTargets.getCurrent().value;
            
            // Target selection stays for nonmoving furniture
            if (target.getClass() == 'entity')
                this.clearPendingAction();
            return false;
        },

        takeDamage: function(amount, source) {
            if(this.game.gameOver){
                return;
            }
            this.hp -= amount;
            if (this.hp <= 0) {
                this.color = 'red';
                this.game.gameOver = true;
                this.game.console.logDied(this);
            }
        },

        clearPendingAction: function(){
            this.actionTargets = false;
            this.pendingAction = false;
            this.pendingActionName = false;
            this.pendingActionSettings = false;
            this.game.queueDraw = true;
            this.game.console.clearDirections();
        },

        heal: function(amount){
            this.hp += amount;
            if(this.hp > this.hpMax){
                this.hp = this.hpMax;
            }
            this.game.console.logHeal(this, amount);
            RL.Util.arrFind(this.game.menu.stats, 'hp_healed').incrementBy(amount);
        },

        restoreMp: function(amount){
            this.mp += amount;
            if(this.mp > this.mpMax){
                this.mp = this.mpMax;
            }
            this.game.console.logRestoreMp(this, amount);
            RL.Util.arrFind(this.game.menu.stats, 'mp_restored').incrementBy(amount);
        },

        statChange: function(stat, amount){
            switch(stat) {
                case 'strength':
                    this.strength += amount;
                    break;
                case 'agility':
                    this.agility += amount;
                    break;
                case 'vitality':
                    this.vitality += amount;
                    break;
                case 'intelligence':
                    this.intelligence += amount;
                    break;
                default:
                  break;
            }
            this.game.console.logStatChange(this, stat, amount);
        },

        gainExp: function(expGain){
            this.exp += expGain;

            // leveled up
            if(this.exp >= this.expForNext){
                this.exp -= this.expForNext;
                this.level++;
                this.expForNext = RL.Util.exptoNextLevel(this.level);
                var hpGain = this.hpGainFromVit();
                var mpGain = this.mpGainFromInt();
                this.hp += hpGain;
                this.mp += mpGain;
                this.hpMax += hpGain;
                this.mpMax += mpGain;
                if(this.hp > this.hpMax)
                    this.hp = this.hpMax;
                if(this.mp > this.mpMax)
                    this.mp = this.mpMax;
                this.strength += this.strengthGrowth;
                this.intelligence += this.intelligenceGrowth;
                this.vitality += this.vitalityGrowth;
                this.agility += this.agilityGrowth;
                this.luck += this.luckGrowth;
                this.statPoints++;
                this.game.console.logLevelUp(this.level);
                this.game.menu.renderStatPoints();
            }
        },

        applyWeaponStats: function(weapon){
            if(weapon.stat1)
                this[RL.Util.mapAbbrToStat(weapon.stat1)] = Math.max(0, this[RL.Util.mapAbbrToStat(weapon.stat1)] + weapon.stat1Modifier);
            if(weapon.stat2)
                this[RL.Util.mapAbbrToStat(weapon.stat2)] = Math.max(0, this[RL.Util.mapAbbrToStat(weapon.stat2)] + weapon.stat2Modifier);
            if(weapon.stat3)
                this[RL.Util.mapAbbrToStat(weapon.stat3)] = Math.max(0, this[RL.Util.mapAbbrToStat(weapon.stat3)] + weapon.stat3Modifier);
        },

        removeWeaponStats: function(weapon){
            if(weapon.stat1)
                this[RL.Util.mapAbbrToStat(weapon.stat1)] = Math.max(0, this[RL.Util.mapAbbrToStat(weapon.stat1)] - weapon.stat1Modifier);
            if(weapon.stat2)
                this[RL.Util.mapAbbrToStat(weapon.stat2)] = Math.max(0, this[RL.Util.mapAbbrToStat(weapon.stat2)] - weapon.stat2Modifier);
            if(weapon.stat3)
                this[RL.Util.mapAbbrToStat(weapon.stat3)] = Math.max(0, this[RL.Util.mapAbbrToStat(weapon.stat3)] - weapon.stat3Modifier);
        },

        useItem: function(slotNum){
            var item = this.inventory[slotNum][0];
            var amount = this.inventory[slotNum][1];
            if(item.group == 'healing'){
                if(this.hp >= this.hpMax)
                    this.game.console.logNoEffect(item);
                else{
                    this.heal(item.healAmount);
                    if(amount>1)
                        this.inventory[slotNum][1]--;
                    else
                        this.inventory.splice(slotNum, 1);
                }
            }
            else if(item.group == 'mp_recovery'){
                if(this.mp >= this.mpMax)
                    this.game.console.logNoEffect(item);
                else{
                    this.restoreMp(item.healAmount);
                    if(amount>1)
                        this.inventory[slotNum][1]--;
                    else
                        this.inventory.splice(slotNum, 1);
                }
            }
            else if(item.group == 'weapon'){
                this.game.console.logEquipItem(this, item);
                var currWeapon = this.weapon;
                this.weapon = item;
                if(amount>1)
                    this.inventory[slotNum][1]--;
                else
                    this.inventory.splice(slotNum, 1);
                // add current weapon to inventory
                this.game.menu.addToInventory(currWeapon);
                this.removeWeaponStats(currWeapon);
                this.applyWeaponStats(item);
                this.game.menu.renderWeapon();
            }
            else if (item.group == 'skill_scroll'){
                let new_skill = new RL.Skill(this.game, this.game.randomSkillOfRank(item.rank));
                if(amount>1)
                    this.inventory[slotNum][1]--;
                else
                    this.inventory.splice(slotNum, 1);
                if(RL.Util.arrFindType(this.skills, new_skill.type)){
                    this.game.console.logDupeSkill(item, new_skill);
                    return;
                }
                if (this.skills.length < this.skillSlots){
                    this.skills.push(new_skill);
                    this.game.console.logLearnedSkill(new_skill);
                    if(this.game.menu.weaponOrSkills == 'skills')
                        this.game.menu.renderSkills();    
                }
                else{
                    this.game.menu.renderSkills();
                    this.game.console.logReplaceSkillDescription(item, new_skill);
                    this.game.menu.addSkillReplaceListeners(new_skill);
                    this.game.input.addBindings({cancel_replace: ['esc']});
                }
            }
            else if(item.group == 'special'){
                item.performUse();
            }
            this.renderHtml();
        },

        learnSkill: function(new_skill){
            if(RL.Util.arrFindType(this.skills, new_skill.type)){
                return;
            }
            if (this.skills.length < this.skillSlots){
                this.skills.push(new_skill);
                if(this.game.menu.weaponOrSkills == 'skills')
                    this.game.menu.renderSkills();    
            }
            else{
                this.game.menu.renderSkills();
                this.game.console.logReplaceSkillDescription(item, new_skill);
                this.game.menu.addSkillReplaceListeners(new_skill);
                this.game.input.addBindings({cancel_replace: ['esc']});
            }
        },

        hpGainFromVit: function(){
           return Math.floor(1234 * Math.tanh(0.001 * this.vitality));
        },

        mpGainFromInt: function(){
            return Math.floor(1234 * Math.tanh(0.0005 * this.intelligence));
        },

        attemptDodge: function(entityStrength){
            var points = this.agility - entityStrength;
            if(points<= 0)
                return false;
            return points >= RL.Util.random(1,100);
        },

        attemptCrit: function(){
            var adjustedLuck = Math.floor(this.luck - (this.game.floor.number/4));
            if(adjustedLuck <= 0)
                return false;
            var points = Math.floor(100 * (-0.00007*adjustedLuck*adjustedLuck + 0.017*adjustedLuck - 0.00177));
            return points >= RL.Util.random(1,100);
        },

        skillAttack: function(skill, damage, range){
            
            var validTargetsSettings = {
                range: range,
                limitToFov: true,
                filter: function(target){
                    return target.getClass() == 'entity';
                }
            };
            var validTargetsFinder = new RL.ValidTargetsFinder(this.game, this, validTargetsSettings);
            let actionTargets = new RL.ValidTargets(this.game, validTargetsFinder.getValidTargets());
            if(!actionTargets.getCurrent()){
                this.game.console.log('No targets are in range for '+ this.game.console.wrap(skill));
                return false;
            }
            var target = actionTargets.getCurrent().value;

            if(target.dead)
                return false;

            if(this.game.player.attemptCrit())
                damage = Math.floor(2.5 * damage);
            
            target.takeDamage(damage);

            var weapon = {
                name: skill.name,
                damage: damage
            };
            
            this.game.console.logAttack(this, weapon, target);
            if(target.dead){
                var entity_x = target.x;
                var entity_y = target.y;
                var loot = target.generateLoot();
                if (loot != 'nothing' && !this.game.itemManager.get(entity_x, entity_y)){
                    loot = new RL.Item(this.game, loot);
                    this.game.itemManager.add(entity_x, entity_y, loot);
                }
                this.game.entityManager.remove(target);
                this.gainExp(this.exp);
                RL.Util.arrFind(this.game.menu.stats, 'enemies_killed').increment();
            }

            var smash = {
                source: this,
                target: target,
                type: 'attack',
                targetX: target.x,
                targetY: target.y,
                sourceX: this.x,
                sourceY: this.y
            };

            this.game.smashLayer.set(this.x, this.y, smash);
            this.game.damageLayer.set(target.x, target.y, damage);

            if(target.bleeds){
                var splatter = damage / 10;
                if(target.dead){
                    splatter *= 1.5;
                }
                this.game.splatter(target.x, target.y, splatter);
            }
            this.game.renderer.draw();
            this.game.smashLayer.reset();
            this.game.damageLayer.reset();
            return true; 
        },

        aoeSkillAttack: function(skill, damage, range, aoe){
            
            var validTargetsSettings = {
                range: range,
                limitToFov: true,
                filter: function(target){
                    return target.getClass() == 'entity';
                }
            };
            var validTargetsFinder = new RL.ValidTargetsFinder(this.game, this, validTargetsSettings);
            let actionTargets = new RL.ValidTargets(this.game, validTargetsFinder.getValidTargets());
            if(!actionTargets.getCurrent()){
                this.game.console.log('No targets are in range for '+ this.game.console.wrap(skill));
                return false;
            }
            var target = actionTargets.getCurrent().value;
            var target_entry = actionTargets.getCurrent();
            if(target.dead)
                return false;

            var aoeFinder = new RL.ValidTargetsFinder(this.game, target, {range:aoe, filter:function(obj){return obj.getClass()=='entity'}});
            var aoe_targets = new RL.ValidTargets(this.game, aoeFinder.getValidTargets());
            aoe_targets.targets.push(target_entry);
            
            var temp_damage = damage;

            for (let i = 0; i < aoe_targets.targets.length; i++){
                target = aoe_targets.targets[i].value;
                if(this.game.player.attemptCrit())
                    temp_damage = Math.floor(2.5 * damage);
                target.takeDamage(damage);
                var weapon = {
                    name: skill.name,
                    damage: damage
                };
                this.game.console.logAttack(this, weapon, target);
                if(target.dead){
                    var entity_x = target.x;
                    var entity_y = target.y;
                    var loot = target.generateLoot();
                    if (loot != 'nothing' && !this.game.itemManager.get(entity_x, entity_y)){
                        loot = new RL.Item(this.game, loot);
                        this.game.itemManager.add(entity_x, entity_y, loot);
                    }
                    this.game.entityManager.remove(target);
                    this.gainExp(this.exp);
                    RL.Util.arrFind(this.game.menu.stats, 'enemies_killed').increment();
                }
                var smash = {
                    source: this,
                    target: target,
                    type: 'attack',
                    targetX: target.x,
                    targetY: target.y,
                    sourceX: this.x,
                    sourceY: this.y
                };
    
                this.game.smashLayer.set(this.x, this.y, smash);
                this.game.damageLayer.set(target.x, target.y, damage);
    
                if(target.bleeds){
                    var splatter = damage / 10;
                    if(target.dead){
                        splatter *= 1.5;
                    }
                    this.game.splatter(target.x, target.y, splatter);
                }
            }
            this.game.renderer.draw();
            this.game.smashLayer.reset();
            this.game.damageLayer.reset();
            return true; 
        },

        selfAoeSkillAttack: function(skill, damage, radius){
            
            var validTargetsSettings = {
                range: radius,
                limitToFov: true,
                filter: function(target){
                    return target.getClass() == 'entity' || target.getClass() == 'furniture';
                }
            };
            var validTargetsFinder = new RL.ValidTargetsFinder(this.game, this, validTargetsSettings);
            let actionTargets = new RL.ValidTargets(this.game, validTargetsFinder.getValidTargets());
            if(!actionTargets.getCurrent()){
                this.game.console.log('No targets are in range for '+ this.game.console.wrap(skill));
                return false;
            }

            var aoeFinder = new RL.ValidTargetsFinder(this.game, this, {range:radius, filter:function(obj){return obj.getClass()=='entity' || obj.getClass()=='furniture'}});
            var aoe_targets = new RL.ValidTargets(this.game, aoeFinder.getValidTargets());
            
            var temp_damage = damage;
            var target = null;

            for (let i = 0; i < aoe_targets.targets.length; i++){
                target = aoe_targets.targets[i].value;
                if(this.game.player.attemptCrit())
                    temp_damage = Math.floor(2.5 * damage);
                target.takeDamage(damage);
                var weapon = {
                    name: skill.name,
                    damage: damage
                };
                this.game.console.logAttack(this, weapon, target);
                if(target.dead){
                    var entity_x = target.x;
                    var entity_y = target.y;
                    if (target.getClass() == 'entity'){
                        var loot = target.generateLoot();
                        if (loot != 'nothing' && !this.game.itemManager.get(entity_x, entity_y)){
                            loot = new RL.Item(this.game, loot);
                            this.game.itemManager.add(entity_x, entity_y, loot);
                        }
                        this.game.entityManager.remove(target);
                        this.gainExp(target.exp);
                        RL.Util.arrFind(this.game.menu.stats, 'enemies_killed').increment();
                    }
                    else if (target.getClass() == 'furniture'){
                        this.game.furnitureManager.remove(target);
                        RL.Util.arrFind(this.game.menu.stats, 'objects_destroyed').increment();
                    }
                }
                var smash = {
                    source: this,
                    target: target,
                    type: 'attack',
                    targetX: target.x,
                    targetY: target.y,
                    sourceX: this.x,
                    sourceY: this.y
                };
    
                this.game.smashLayer.set(this.x, this.y, smash);
                this.game.damageLayer.set(target.x, target.y, damage);
    
                if(target.bleeds){
                    var splatter = damage / 10;
                    if(target.dead){
                        splatter *= 1.5;
                    }
                    this.game.splatter(target.x, target.y, splatter);
                }
            }
            this.game.renderer.draw();
            this.game.smashLayer.reset();
            this.game.damageLayer.reset();
            return true; 
        },

        multiSkillAttack: function(skill, damage, range, number){
            
            var validTargetsSettings = {
                range: range,
                limitToFov: true,
                filter: function(target){
                    return target.getClass() == 'entity';
                }
            };
            var validTargetsFinder = new RL.ValidTargetsFinder(this.game, this, validTargetsSettings);
            let actionTargets = new RL.ValidTargets(this.game, validTargetsFinder.getValidTargets());
            if (actionTargets.targets.length > number)
                actionTargets.targets = actionTargets.targets.slice(0, number);
            if(!actionTargets.getCurrent()){
                this.game.console.log('No targets are in range for '+ this.game.console.wrap(skill));
                return false;
            }
            var target = null;
            
            var temp_damage = damage;

            for (let i = 0; i < actionTargets.targets.length; i++){
                target = actionTargets.targets[i].value;
                if(this.game.player.attemptCrit())
                    temp_damage = Math.floor(2.5 * damage);
                target.takeDamage(damage);
                var weapon = {
                    name: skill.name,
                    damage: damage
                };
                this.game.console.logAttack(this, weapon, target);
                if(target.dead){
                    var entity_x = target.x;
                    var entity_y = target.y;
                    var loot = target.generateLoot();
                    if (loot != 'nothing' && !this.game.itemManager.get(entity_x, entity_y)){
                        loot = new RL.Item(this.game, loot);
                        this.game.itemManager.add(entity_x, entity_y, loot);
                    }
                    this.game.entityManager.remove(target);
                    this.gainExp(this.exp);
                    RL.Util.arrFind(this.game.menu.stats, 'enemies_killed').increment();
                }
                var smash = {
                    source: this,
                    target: target,
                    type: 'attack',
                    targetX: target.x,
                    targetY: target.y,
                    sourceX: this.x,
                    sourceY: this.y
                };
    
                this.game.smashLayer.set(this.x, this.y, smash);
                this.game.damageLayer.set(target.x, target.y, damage);
    
                if(target.bleeds){
                    var splatter = damage / 10;
                    if(target.dead){
                        splatter *= 1.5;
                    }
                    this.game.splatter(target.x, target.y, splatter);
                }
            }
            this.game.renderer.draw();
            this.game.smashLayer.reset();
            this.game.damageLayer.reset();
            return true; 
        },

        renderHtml: function(){
            this.nameEl.innerHTML = 'Name: ' + this.name;
            this.levelEl.innerHTML = 'Level: ' + this.level;
            if(this.job)
                this.jobEl.innerHTML = 'Job: ' + this.job.name;
            else
                this.jobEl.innerHTML = 'Job: None'
            this.titleEl.innerHTML = 'Title: ' + this.title;
            this.goldEl.innerHTML = 'Gold: ' + RL.Util.addCommas(this.gold);

            this.hpEl.innerHTML = 'HP: ' + this.hp + '/' + this.hpMax;
            this.hpBarEl.value = this.hp;
            this.hpBarEl.max = this.hpMax;

            this.mpEl.innerHTML = 'MP: ' + this.mp + '/' + this.mpMax;
            this.mpBarEl.value = this.mp;
            this.mpBarEl.max = this.mpMax;

            this.strengthEl.innerHTML = 'Strength: ' + this.strength;
            this.vitalityEl.innerHTML = 'Vitality: ' + this.vitality;
            this.agilityEl.innerHTML = 'Agility: ' + this.agility;
            this.intelligenceEl.innerHTML = 'Intelligence: ' + this.intelligence;
            this.luckEl.innerHTML = 'Luck: ' + this.luck;
        },

        getConsoleName: function(){
            return {
                name: this.name,
                color: this.consoleColor
            };
        },
    };

    RL.Util.merge(NewPlayer.prototype, proto);
    RL.Util.merge(NewPlayer.prototype, newPlayerPrototype);

    root.RL.Player = NewPlayer;

}(this));
