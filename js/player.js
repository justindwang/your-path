(function(root) {
    'use strict';

    var proto = root.RL.Player.prototype;

    var NewPlayer = function Player(game){
        proto.constructor.call(this, game);

        this.weapon = new RL.Item(this.game, 'fists');
        this.applyWeaponStats(this.weapon);
        this.skills = [new RL.Skill(this.game, 'pancake_torch'), new RL.Skill(this.game, 'powerbuff_gorl')];
        this.inventory = [[new RL.Item(this.game, 'ascension_crystal'),1], [new RL.Item(this.game, 'descension_crystal'),1]];

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

        name: 'rio',
        level: 1,
        job: 'None',
        title: 'None',
        
        exp: 0,
        expForNext: 9,

        gold: 0,

        hp: 20,
        hpMax: 20,
        mp: 10,
        mpMax: 10,
        strength: 100,
        vitality: 1,
        agility: 1,
        intelligence: 1,
        luck: 1,

        weapon: null,
        inventory: null,
        skills: null,

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
        weaponEl: null,
        skillsEl: null,

        pendingAction: false,

        bleeds: true,

        highestFloor: 1,

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

            if(action === 'close'){
                return this.close();
            }

            if(action === 'open'){
                return this.open();
            }

            if(action === 'attack'){
                return this.attack();
            }

            if(action === 'switch_skill'){
                return this.switchSkill();
            }
            if(action === 'use_skill'){
                return this.useSkill();
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

        // action
        close: function(){
            this.pendingActionName = 'close';
            return this.actionAdjacentTargetSelect('close');
        },

        // action
        open: function(){
            this.pendingActionName = 'open';
            return this.actionAdjacentTargetSelect('open');
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

        // action
        switchSkill: function(){
            for(var i = 0; i< this.skills.length; i++){
                if(this.skills[i].selected){
                    this.skills[i].selected = false;
                    if(i == this.skills.length - 1){
                        this.skills[0].selected = true;
                        this.game.console.logSwitchSkill(this.skills[0]);
                    }
                    else{
                        this.skills[i+1].selected = true;
                        this.game.console.logSwitchSkill(this.skills[i+1]);
                    }
                    break;
                }
            }
            return true;
        },
        useSkill: function(){
            for(var i = 0; i< this.skills.length; i++){
                if(this.skills[i].selected){
                    if(this.skills[i].mpCost <= this.mp){
                        this.mp -= this.skills[i].mpCost;
                        this.game.console.logUseSkill(this, this.skills[i]);
                        RL.Util.arrFind(this.game.menu.stats, 'skills_used').increment();
                        this.skills[i].performEffect();
                    }
                    else{
                        this.game.console.logCanNotUseSkill(this, this.skills[i]);
                    }
                    break;
                }
            }
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
                this.strength++;
                this.intelligence++;
                this.vitality++;
                this.agility++;
                this.game.console.logLevelUp(this.level);
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
            }
            else if(item.group == 'special'){
                item.performUse();
            }
            this.renderHtml();
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

        renderHtml: function(){
            this.nameEl.innerHTML = this.name;
            this.levelEl.innerHTML = this.level;
            this.jobEl.innerHTML = this.job;
            this.titleEl.innerHTML = this.title;
            this.goldEl.innerHTML = RL.Util.addCommas(this.gold);

            this.hpEl.innerHTML = this.hp;
            this.hpMaxEl.innerHTML = this.hpMax;
            this.hpBarEl.value = this.hp;
            this.hpBarEl.max = this.hpMax;

            this.mpEl.innerHTML = this.mp;
            this.mpMaxEl.innerHTML = this.mpMax;
            this.mpBarEl.value = this.mp;
            this.mpBarEl.max = this.mpMax;

            this.strengthEl.innerHTML = this.strength;
            this.vitalityEl.innerHTML = this.vitality;
            this.agilityEl.innerHTML = this.agility;
            this.intelligenceEl.innerHTML = this.intelligence;
            this.luckEl.innerHTML = this.luck;

            if(this.weapon){
                var weaponConsoleName = this.weapon.getConsoleName();
                this.weaponNameEl.innerHTML = weaponConsoleName.name;
                this.weaponStatsEl.innerHTML = weaponConsoleName.stats;
                this.weaponRangeEl.innerHTML = weaponConsoleName.range;
                document.getElementById('stat-weapon-name').style.color = weaponConsoleName.color;
            }
            
            if(this.skillsEl){
                // building skills section of html
                var skillsHtml = '';

                for(var i = 0; i< this.skills.length; i++){
                    var skillConsoleName = this.skills[i].getConsoleName();
                    if(skillConsoleName.selected){
                        skillsHtml += '<div class="tr"><div class="td_yellow">' + skillConsoleName.name + '</div></div><div class="tr"><div class="td_dark">';
                        skillsHtml += skillConsoleName.description + '</div></div><div class="tr"><div class="td_dark">\"' + skillConsoleName.tooltip + '\"</div></div>';
                    }
                    else{
                        skillsHtml += '<div class="tr"><div class="td">' + skillConsoleName.name + '</div></div><div class="tr"><div class="td_dark">';
                        skillsHtml += skillConsoleName.description + '</div></div><div class="tr"><div class="td_dark">\"' + skillConsoleName.tooltip + '\"</div></div>';
                    }
                }
                this.skillsEl.innerHTML = skillsHtml;
            }
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
