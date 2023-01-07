(function(root) {
    'use strict';

    /*
    * Menu class that manages inventory, shop, and stats UI
    */
    var Menu = function Menu(game) {
        this.game = game;
        this.shop = [];
        this.generateShop();
        this.stats = this.initializeAllStats();
        if(this.init)
            this.init();
    };

    Menu.prototype = {
        constructor: Menu,

        game: null,

        shop: [],

        stats: [],

        inventoryItemConfirmIndex: -1,
        shopItemConfirmIndex: -1,
        shopSellItemConfirmIndex: -1,

        buyOrSell: 'buy',
        weaponOrSkills: 'weapon',

        generateShop: function(){
            let temp = [new RL.Item(this.game, 'tiny_hp_potion'), new RL.Item(this.game, 'tiny_mp_potion')];
            temp.push(new RL.Item(this.game, this.game.randomItemOfRank('E')));
            temp.push(new RL.Item(this.game, this.game.randomItemOfRank('D')));
            temp.push(new RL.Item(this.game, this.game.randomItemOfRank('C')));
            temp.push(new RL.Item(this.game, this.game.randomItemOfRank('B')));
            temp.push(new RL.Item(this.game, this.game.randomItemOfRank('A')));
            temp.push(new RL.Item(this.game, this.game.randomItemOfRank('S')));
            this.shop = temp;
        },

        startListening: function(){
            document.getElementById('pr-inventory').addEventListener('click', this.displayInventoryMenu);
            document.getElementById('pr-shop').addEventListener('click', this.displayShopMenu);
            document.getElementById('pr-stats').addEventListener('click', this.displayStatsMenu);

            document.getElementById('inventory-foot-type').addEventListener('click', () => {this.sortInventoryType()});
            document.getElementById('inventory-foot-rarity').addEventListener('click', () => {this.sortInventoryRarity()});
            document.getElementById('inventory-foot-name').addEventListener('click', () => {this.sortInventoryName()});

            document.getElementById('stats-foot-type').addEventListener('click', () => {this.sortStatsType()});
            document.getElementById('stats-foot-rarity').addEventListener('click', () => {this.sortStatsRarity()});
            document.getElementById('stats-foot-name').addEventListener('click', () => {this.sortStatsName()});

            document.getElementById('shop-buy').addEventListener('click', () => {this.renderShop()});
            document.getElementById('shop-sell').addEventListener('click', () => {this.renderShopSell()});

            document.getElementById('skill-weapon').addEventListener('click', () => {this.renderWeapon()});
            document.getElementById('skill-skills').addEventListener('click', () => {this.renderSkills()});

            document.getElementById('up-strength').addEventListener('click', () => {this.upStrength()});
            document.getElementById('up-vitality').addEventListener('click', () => {this.upVitality()});
            document.getElementById('up-agility').addEventListener('click', () => {this.upAgility()});
            document.getElementById('up-intelligence').addEventListener('click', () => {this.upIntelligence()});
            document.getElementById('up-luck').addEventListener('click', () => {this.upLuck()});

            document.getElementById('start-button').addEventListener('click', () => {this.startPressed()});
            

            this.addInventoryListeners();
            this.addShopListeners();
            this.addShopSortListeners();
        },

        startPressed: function(){
            let input = document.getElementById('name-input');
            let start = document.getElementById('start-text');
            let name = document.getElementById('start-name-prompt');

            document.getElementById('start-arrow').style.display = 'none';
            input.style.visibility = 'visible';
            input.style.opacity = 1;
            start.style.visibility = 'hidden';
            start.style.opacity = 0;
            name.style.visibility = 'visible';
            name.style.opacity = 1;
            input.addEventListener("keyup", ({key}) => {
                if (key === "Enter") {
                    // remove start button listener
                    var old_element = document.getElementById("start-button");
                    var new_element = old_element.cloneNode(true);
                    old_element.parentNode.replaceChild(new_element, old_element);

                    this.game.player.name = input.value;
                    let name = document.getElementById('start-name-prompt');
                    let _class = document.getElementById('start-class-prompt');
                    let textbox = document.getElementById('name-input');

                    name.style.visibility = 'hidden';
                    name.style.opacity = 0;
                    _class.style.visibility = 'visible';
                    _class.style.opacity = 1;
                    textbox.style.visibility = 'hidden';
                    textbox.style.opacity = 0;
                }
            })
        },

        addInventoryListeners: function(){
            var inventory = this.game.player.inventory;
            for(let i = 0; i<inventory.length; i++){
                let item = document.getElementById('inventory-item-' + i);
                item.addEventListener('click', () => {this.inventoryItemClicked(i)});
            }
        },

        addShopListeners: function(){
            for(let i = 0; i < this.shop.length; i++){
                let item = document.getElementById('shop-item-' + i);
                item.addEventListener('click', () => {this.shopItemClicked(i)});
            }
        },

        addShopSellListeners: function(){
            var inventory = this.game.player.inventory;
            for(let i = 0; i<inventory.length; i++){
                let item = document.getElementById('shop-sell-item-' + i);
                item.addEventListener('click', () => {this.shopSellItemClicked(i)});
            }
        },

        addShopSortListeners: function(){
            document.getElementById('shop-foot-type').addEventListener('click', () => {this.sortShopType()});
            document.getElementById('shop-foot-rarity').addEventListener('click', () => {this.sortShopRarity()});
            document.getElementById('shop-foot-name').addEventListener('click', () => {this.sortShopName()});
        },

        addShopSellSortListeners: function(){
            document.getElementById('shop-sell-foot-type').addEventListener('click', () => {this.sortShopSellType()});
            document.getElementById('shop-sell-foot-rarity').addEventListener('click', () => {this.sortShopSellRarity()});
            document.getElementById('shop-sell-foot-name').addEventListener('click', () => {this.sortShopSellName()});
        },

        displayInventoryMenu: function(){
            var inventoryWindowEl = document.getElementById('inventory-window');
            var shopWindowEl = document.getElementById('shop-window');
            var statsWindowEl = document.getElementById('stats-window');

            inventoryWindowEl.style.visibility = 'visible';
            shopWindowEl.style.visibility = 'hidden';
            statsWindowEl.style.visibility = 'hidden';

            inventoryWindowEl.style.opacity = 1;
            shopWindowEl.style.opacity = 0;
            statsWindowEl.style.opacity = 0;
        },

        displayShopMenu: function() {
            var inventoryWindowEl = document.getElementById('inventory-window');
            var shopWindowEl = document.getElementById('shop-window');
            var statsWindowEl = document.getElementById('stats-window');

            inventoryWindowEl.style.visibility = 'hidden';
            shopWindowEl.style.visibility = 'visible';
            statsWindowEl.style.visibility = 'hidden';

            inventoryWindowEl.style.opacity = 0;
            shopWindowEl.style.opacity = 1;
            statsWindowEl.style.opacity = 0;
        },

        displayStatsMenu: function() {
            var inventoryWindowEl = document.getElementById('inventory-window');
            var shopWindowEl = document.getElementById('shop-window');
            var statsWindowEl = document.getElementById('stats-window');

            inventoryWindowEl.style.visibility = 'hidden';
            shopWindowEl.style.visibility = 'hidden';
            statsWindowEl.style.visibility = 'visible';

            inventoryWindowEl.style.opacity = 0;
            shopWindowEl.style.opacity = 0;
            statsWindowEl.style.opacity = 1;
        },

        renderStatPoints: function(){
            if(this.game.player.statPoints > 0){
                let statPointsEl = document.getElementById('stat-points');
                statPointsEl.innerHTML = '(Stat Points: ' + this.game.player.statPoints + ')';
                this.displayStatPoints();
            }
            else
                this.hideStatPoints();
        },

        displayStatPoints: function(){
            let elements = document.querySelectorAll('.player-stat-item');
            for (let element of elements) 
                element.style.display = 'block';
            let statPoints = document.getElementById('stat-points');
            statPoints.style.display = 'block';
        },

        hideStatPoints: function(){
            let elements = document.querySelectorAll('.player-stat-item');
            for (let element of elements) 
                element.style.display = 'none';
            let statPoints = document.getElementById('stat-points');
            statPoints.style.display = 'none';
        },

        upStrength: function(){
            this.game.player.statPoints--;
            this.game.player.strength++;
            this.game.player.renderHtml();
            this.game.console.logUsedStatPoint('strength');
            this.renderStatPoints();
        },

        upVitality: function(){
            this.game.player.statPoints--;
            this.game.player.vitality++;
            this.game.player.renderHtml();
            this.game.console.logUsedStatPoint('vitality');
            this.renderStatPoints();
        },

        upAgility: function(){
            this.game.player.statPoints--;
            this.game.player.agility++;
            this.game.player.renderHtml();
            this.game.console.logUsedStatPoint('agility');
            this.renderStatPoints();
        },

        upIntelligence: function(){
            this.game.player.statPoints--;
            this.game.player.intelligence++;
            this.game.player.renderHtml();
            this.game.console.logUsedStatPoint('intelligence');
            this.renderStatPoints();
        },

        upLuck: function(){
            this.game.player.statPoints--;
            this.game.player.luck++;
            this.game.player.renderHtml();
            this.game.console.logUsedStatPoint('luck');
            this.renderStatPoints();
        },
        
        sortInventoryType: function(){
            document.getElementById('inventory-foot-type').style.color = '#e5e5e5';
            document.getElementById('inventory-foot-rarity').style.color = '#ffffff33';
            document.getElementById('inventory-foot-name').style.color = '#ffffff33';

            var toSort = this.game.player.inventory;
            this.game.player.inventory = RL.Util.sortInventoryByKey(toSort, 'group');
            this.renderInventory();
        },

        sortInventoryRarity: function(){
            document.getElementById('inventory-foot-type').style.color = '#ffffff33';
            document.getElementById('inventory-foot-rarity').style.color = '#e5e5e5';
            document.getElementById('inventory-foot-name').style.color = '#ffffff33';

            var toSort = this.game.player.inventory;
            this.game.player.inventory = RL.Util.sortInventoryByKey(toSort, 'rank');
            this.renderInventory();
        },

        sortInventoryName: function(){
            document.getElementById('inventory-foot-type').style.color = '#ffffff33';
            document.getElementById('inventory-foot-rarity').style.color = '#ffffff33';
            document.getElementById('inventory-foot-name').style.color = '#e5e5e5';

            var toSort = this.game.player.inventory;
            this.game.player.inventory = RL.Util.sortInventoryByKey(toSort, 'name');
            this.renderInventory();
        },

        sortShopType: function(){
            this.shop = RL.Util.sortArrayOfObjects(this.shop, 'group');
            this.renderShop();
            document.getElementById('shop-foot-type').style.color = '#e5e5e5';
            document.getElementById('shop-foot-rarity').style.color = '#ffffff33';
            document.getElementById('shop-foot-name').style.color = '#ffffff33';
        },

        sortShopRarity: function(){
            this.shop = RL.Util.sortArrayOfObjects(this.shop, 'rank');
            this.renderShop();
            document.getElementById('shop-foot-type').style.color = '#ffffff33';
            document.getElementById('shop-foot-rarity').style.color = '#e5e5e5';
            document.getElementById('shop-foot-name').style.color = '#ffffff33';
        },

        sortShopName: function(){
            this.shop = RL.Util.sortArrayOfObjects(this.shop, 'name');
            this.renderShop();
            document.getElementById('shop-foot-type').style.color = '#ffffff33';
            document.getElementById('shop-foot-rarity').style.color = '#ffffff33';
            document.getElementById('shop-foot-name').style.color = '#e5e5e5';
        },

        sortShopSellType: function(){
            var toSort = this.game.player.inventory;
            this.game.player.inventory = RL.Util.sortInventoryByKey(toSort, 'group');
            this.renderShopSell();
            document.getElementById('shop-sell-foot-type').style.color = '#e5e5e5';
            document.getElementById('shop-sell-foot-rarity').style.color = '#ffffff33';
            document.getElementById('shop-sell-foot-name').style.color = '#ffffff33';
        },

        sortShopSellRarity: function(){
            var toSort = this.game.player.inventory;
            this.game.player.inventory = RL.Util.sortInventoryByKey(toSort, 'rank');
            this.renderShopSell();
            document.getElementById('shop-sell-foot-type').style.color = '#ffffff33';
            document.getElementById('shop-sell-foot-rarity').style.color = '#e5e5e5';
            document.getElementById('shop-sell-foot-name').style.color = '#ffffff33';
        },

        sortShopSellName: function(){
            var toSort = this.game.player.inventory;
            this.game.player.inventory = RL.Util.sortInventoryByKey(toSort, 'name');
            this.renderShopSell();
            document.getElementById('shop-sell-foot-type').style.color = '#ffffff33';
            document.getElementById('shop-sell-foot-rarity').style.color = '#ffffff33';
            document.getElementById('shop-sell-foot-name').style.color = '#e5e5e5';
        },

        sortStatsType: function(){
            document.getElementById('stats-foot-type').style.color = '#e5e5e5';
            document.getElementById('stats-foot-rarity').style.color = '#ffffff33';
            document.getElementById('stats-foot-name').style.color = '#ffffff33';

            this.stats = RL.Util.sortArrayOfObjects(this.stats, 'group');
            this.renderStats();
        },

        sortStatsRarity: function(){
            document.getElementById('stats-foot-type').style.color = '#ffffff33';
            document.getElementById('stats-foot-rarity').style.color = '#e5e5e5';
            document.getElementById('stats-foot-name').style.color = '#ffffff33';

            this.stats = RL.Util.sortArrayOfObjects(this.stats, 'rank');
            this.renderStats();
        },

        sortStatsName: function(){
            document.getElementById('stats-foot-type').style.color = '#ffffff33';
            document.getElementById('stats-foot-rarity').style.color = '#ffffff33';
            document.getElementById('stats-foot-name').style.color = '#e5e5e5';

            this.stats = RL.Util.sortArrayOfObjects(this.stats, 'name');
            this.renderStats();
        },

        inventoryItemClicked: function(slotNum){
            var inventory = this.game.player.inventory;
            var group = inventory[slotNum][0].group;

            if (slotNum == this.inventoryItemConfirmIndex){
                if (group != 'material'){
                    this.game.player.useItem(slotNum);
                    this.renderInventory();
                }
                this.clearClickData();
            }
            else{
                this.inventoryItemConfirmIndex = slotNum;
                if(group=='healing' || group == 'mp_recovery' || group == 'special')
                    this.game.console.logAskConfirmUse(inventory[slotNum][0]);
                else if (group == 'weapon')
                    this.game.console.logAskConfirmEquip(inventory[slotNum][0]);
                else
                    this.game.console.logInspectMaterial(inventory[slotNum][0]);
            }
        },

        shopItemClicked: function(slotNum){
            var item = this.shop[slotNum];
            if (slotNum == this.shopItemConfirmIndex){
                if(this.game.player.gold >= item.cost){
                    this.game.player.gold -= item.cost;
                    // this.shop.splice(slotNum, 1);
                    this.addToInventory(item);
                    this.game.console.logPurchasedItem(item);
                    this.game.player.renderHtml();
                    this.renderInventory();
                    this.renderShop();
                }
                else{
                    this.game.console.logNotEnoughMoney(item);
                }
                this.clearClickData();
            }
            else{
                this.shopItemConfirmIndex = slotNum;
                this.game.console.logAskPurchase(item);
            }
        },

        shopSellItemClicked: function(slotNum){
            var item = this.game.player.inventory[slotNum][0];
            if(item.group == 'special'){
                this.game.console.log('Special items can\'t be sold');
                return;
            }
            if (slotNum == this.shopSellItemConfirmIndex){
                this.clearClickData();
                this.game.player.gold += item.cost;
                this.removeFromInventory(item);
                this.game.console.logSoldItem(item);
                this.game.player.renderHtml();
                this.renderShopSell();
            }
            else{
                this.shopSellItemConfirmIndex = slotNum;
                this.game.console.logAskSell(item);
            }
        },
        
        clearClickData: function(){
            this.inventoryItemConfirmIndex = -1;
            this.shopItemConfirmIndex = -1;
            this.shopSellItemConfirmIndex = -1;
        },

        addToInventory: function(item){
            var inv = this.game.player.inventory;
            var found = RL.Util.arrFindInventory(inv, item);
            if(found)
                found[1]++;
            else
                inv.push([item,1]);
            this.renderInventory();
            if(this.buyOrSell == 'sell')
                this.renderShopSell();
        },
        
        removeFromInventory: function(item){
            var inv = this.game.player.inventory;
            for(var i = 0; i< inv.length; i++){
                if (inv[i][0].type == item.type){
                    if(inv[i][1] > 1)
                        inv[i][1]--;
                    else
                        inv.splice(i, 1);
                }
            }
            this.renderShopSell();
            this.renderInventory();
        },

        initializeAllStats: function(){
            var list = [];
            for (const [key, value] of Object.entries(RL.Stat.List)) {
                var temp = new RL.Stat(this.game, key);
                list.push(temp);
            }
            return list;
        },

        initInventory: function(){
            var inventory = this.game.player.inventory;
            var wrap = document.getElementById('inventory-body');
            var icon = '';
            var color = '';
            var html = '';
            
            for(var i = 0; i<inventory.length; i++){
                icon = '<img src="assets/sprites/' +  inventory[i][0].sprite + '.png"/>';
                switch(inventory[i][0].rank){
                    case 'S': color = '<span style="color:brown">'; break;
                    case 'A': color = '<span style="color:orchid">'; break;
                    case 'B': color = '<span style="color: #85B9E1ff">'; break;
                    case 'C': color = '<span style="color:cadetblue">'; break;
                    case 'D': color = '<span style="color:paleturquoise">'; break;
                    case 'E': color = '<span style="color:goldenrod">'; break;
                    case 'F': color = '<span style="color:peachpuff">'; break;
                }

                html += '<div class="menu-item" id="inventory-item-'+ i + '"><div class="menu-item-icon">' + icon + '</div><div class="menu-item-info"><h4>' + color + inventory[i][0].name + ' - ​' + inventory[i][0].rank +'</span><br> <span>' + inventory[i][0].getStats() + '</span></h4></div><div class="menu-item-amount"><h4>x' + inventory[i][1] + '</h4></div></div>';
            }
            wrap.innerHTML = html;
        },

        renderInventory: function(){
            var inventory = this.game.player.inventory;
            var wrap = document.getElementById('mCSB_2_container');
            var icon = '';
            var color = '';
            var html = '';
            
            for(var i = 0; i<inventory.length; i++){
                icon = '<img src="assets/sprites/' +  inventory[i][0].sprite + '.png"/>';
                switch(inventory[i][0].rank){
                    case 'S': color = '<span style="color:brown">'; break;
                    case 'A': color = '<span style="color:orchid">'; break;
                    case 'B': color = '<span style="color:#85B9E1ff">'; break;
                    case 'C': color = '<span style="color:cadetblue">'; break;
                    case 'D': color = '<span style="color:paleturquoise">'; break;
                    case 'E': color = '<span style="color:goldenrod">'; break;
                    case 'F': color = '<span style="color:peachpuff">'; break;
                }

                html += '<div class="menu-item" id="inventory-item-'+ i + '"><div class="menu-item-icon">' + icon + '</div><div class="menu-item-info"><h4>' + color + inventory[i][0].name + ' - ​' + inventory[i][0].rank +'</span><br> <span>' + inventory[i][0].getStats() + '</span></h4></div><div class="menu-item-amount"><h4>x' + inventory[i][1] + '</h4></div></div>';
            }
            wrap.innerHTML = html;
            this.addInventoryListeners();
        }, 
        initShop: function(){
            var wrap = document.getElementById('shop-body');
            var icon = '';
            var color = '';
            var html = '';
            
            for(var i = 0; i< this.shop.length; i++){
                icon = '<img src="assets/sprites/' +  this.shop[i].sprite + '.png"/>'; 
                switch(this.shop[i].rank){
                    case 'S': color = '<span style="color:brown">'; break;
                    case 'A': color = '<span style="color:orchid">'; break;
                    case 'B': color = '<span style="color:#85B9E1ff">'; break;
                    case 'C': color = '<span style="color:cadetblue">'; break;
                    case 'D': color = '<span style="color:paleturquoise">'; break;
                    case 'E': color = '<span style="color:goldenrod">'; break;
                    case 'F': color = '<span style="color:peachpuff">'; break;
                }
                html += '<div class="menu-item" id="shop-item-'+ i + '"><div class="menu-item-icon">' + icon + '</div><div class="menu-item-info"><h4>' + color + this.shop[i].name + ' - ​' + this.shop[i].rank +'</span> <br> <span>' + this.shop[i].getStats() + '</span></h4></div><div class="menu-item-amount"><img src="assets/icons/gold.png"/><p>' + RL.Util.addCommas(this.shop[i].cost) + '</p></div></div>';
            }
            wrap.innerHTML = html;
            document.getElementById('shop-foot').innerHTML = '<p>Order by:</p><span id="shop-foot-type"> Type </span><p class = "td_tab_short"></p> <p>|</p><p class="td_tab_short"></p><span id="shop-foot-rarity">Rarity</span> <p class="td_tab_short"></p><p>|</p><p class="td_tab_short"></p><span id="shop-foot-name">Name </span>';
        },
        renderShop: function(){
            this.buyOrSell = 'buy';
            document.getElementById('shop-sell').style.color = '#ffffff33';
            document.getElementById('shop-buy').style.color = '#e5e5e5';
            var wrap = document.getElementById('mCSB_3_container');
            var icon = '';
            var color = '';
            var html = '';
            
            for(var i = 0; i< this.shop.length; i++){
                icon = '<img src="assets/sprites/' +  this.shop[i].sprite + '.png"/>'; 
                switch(this.shop[i].rank){
                    case 'S': color = '<span style="color:brown">'; break;
                    case 'A': color = '<span style="color:orchid">'; break;
                    case 'B': color = '<span style="color:#85B9E1ff">'; break;
                    case 'C': color = '<span style="color:cadetblue">'; break;
                    case 'D': color = '<span style="color:paleturquoise">'; break;
                    case 'E': color = '<span style="color:goldenrod">'; break;
                    case 'F': color = '<span style="color:peachpuff">'; break;
                }

                html += '<div class="menu-item" id="shop-item-'+ i + '"><div class="menu-item-icon">' + icon + '</div><div class="menu-item-info"><h4>' + color + this.shop[i].name + ' - ​' + this.shop[i].rank +'</span> <br> <span>' + this.shop[i].getStats() + '</span></h4></div><div class="menu-item-amount"><img src="assets/icons/gold.png"/><p>' + RL.Util.addCommas(this.shop[i].cost) + '</p></div></div>';
            }
            wrap.innerHTML = html;
            document.getElementById('shop-foot').innerHTML = '<p>Order by:</p><span id="shop-foot-type"> Type </span><p class = "td_tab_short"></p> <p>|</p><p class="td_tab_short"></p><span id="shop-foot-rarity">Rarity</span> <p class="td_tab_short"></p><p>|</p><p class="td_tab_short"></p><span id="shop-foot-name">Name </span>';
            this.addShopListeners();
            this.addShopSortListeners();
        }, 
        renderShopSell: function(){
            this.buyOrSell = 'sell';
            document.getElementById('shop-buy').style.color = '#ffffff33';
            document.getElementById('shop-sell').style.color = '#e5e5e5';
            var wrap = document.getElementById('mCSB_3_container');
            var inventory = this.game.player.inventory;
            var icon = '';
            var color = '';
            var html = '';
            
            for(var i = 0; i<inventory.length; i++){
                icon = '<img src="assets/sprites/' +  inventory[i][0].sprite + '.png"/>';
                switch(inventory[i][0].rank){
                    case 'S': color = '<span style="color:brown">'; break;
                    case 'A': color = '<span style="color:orchid">'; break;
                    case 'B': color = '<span style="color:#85B9E1ff">'; break;
                    case 'C': color = '<span style="color:cadetblue">'; break;
                    case 'D': color = '<span style="color:paleturquoise">'; break;
                    case 'E': color = '<span style="color:goldenrod">'; break;
                    case 'F': color = '<span style="color:peachpuff">'; break;
                }

                html += '<div class="menu-item" id="shop-sell-item-'+ i + '"><div class="menu-item-icon">' + icon + '</div><div class="menu-item-info"><h4>' + color + inventory[i][0].name + ' - ​' + inventory[i][0].rank +'</span><br> <span>' + inventory[i][0].getStats() + '</span></h4></div><div class="menu-item-amount"><h4>x' + inventory[i][1] + '</h4></div></div>';
            }
            wrap.innerHTML = html;
            document.getElementById('shop-foot').innerHTML = '<p>Order by:</p><span id="shop-sell-foot-type"> Type </span><p class = "td_tab_short"></p> <p>|</p><p class="td_tab_short"></p><span id="shop-sell-foot-rarity">Rarity</span> <p class="td_tab_short"></p><p>|</p><p class="td_tab_short"></p><span id="shop-sell-foot-name">Name </span>';
            this.addShopSellListeners();
            this.addShopSellSortListeners();
        },
        initStats: function(){
            var wrap = document.getElementById('stats-body');
            var icon = '';
            var color = '';
            var html = '';
            
            for(var i = 0; i<this.stats.length; i++){
                icon = RL.Util.mapGroupToIcon(this.stats[i].group);
                switch(this.stats[i].rank){
                    case 'S': color = '<span style="color:brown">'; break;
                    case 'A': color = '<span style="color:orchid">'; break;
                    case 'B': color = '<span style="color:#85B9E1ff">'; break;
                    case 'C': color = '<span style="color:cadetblue">'; break;
                    case 'D': color = '<span style="color:paleturquoise">'; break;
                    case 'E': color = '<span style="color:goldenrod">'; break;
                    case 'F': color = '<span style="color:peachpuff">'; break;
                }

                html += '<div class="menu-item" id="stats-item-'+ i + '"><div class="menu-item-icon">' + icon + '</div><div class="menu-item-info"><h4>' + color + this.stats[i].name + ' - ​' + this.stats[i].rank +'</span> <br> <span>' + this.stats[i].getStats() + '</span></h4></div></div>';
            }
            wrap.innerHTML = html;
        },
        renderStats: function(){
            var wrap = document.getElementById('mCSB_4_container');
            var icon = '';
            var color = '';
            var html = '';
            
            for(var i = 0; i< this.stats.length; i++){
                icon = RL.Util.mapGroupToIcon(this.stats[i].group);
                switch(this.stats[i].rank){
                    case 'S': color = '<span style="color:brown">'; break;
                    case 'A': color = '<span style="color:orchid">'; break;
                    case 'B': color = '<span style="color:#85B9E1ff">'; break;
                    case 'C': color = '<span style="color:cadetblue">'; break;
                    case 'D': color = '<span style="color:paleturquoise">'; break;
                    case 'E': color = '<span style="color:goldenrod">'; break;
                    case 'F': color = '<span style="color:peachpuff">'; break;
                }

                html += '<div class="menu-item" id="stats-item-'+ i + '"><div class="menu-item-icon">' + icon + '</div><div class="menu-item-info"><h4>' + color + this.stats[i].name + ' - ​' + this.stats[i].rank +'</span> <br> <span>' + this.stats[i].getStats() + '</span></h4></div></div>';
            }
            wrap.innerHTML = html;
        },

        initWeapon: function(){
            document.getElementById('skill-weapon').style.color = '#e5e5e5';
            document.getElementById('skill-skills').style.color = '#ffffff33';
            var wrap = document.getElementById('skill-body');
            var player = this.game.player;
            var html = '';
            var weaponConsoleName = player.weapon.getConsoleName();
            html += '<div class="weapon-icon"><img src="assets/sprites/' + weaponConsoleName.sprite + '.png"/></div><div class="newline"></div><div class="tr"><div class="td_weapon" >[Name: ' + this.game.console.wrap(player.weapon) + ']</div></div><div class="tr"><div class="td_weapon">Weapon Rank: '+ weaponConsoleName.rank + '</div></div><div class="tr"><div class="td_weapon">Modifiers: ' + weaponConsoleName.stats + '</div></div><div class="tr"><div class="td_weapon">Range: ' + weaponConsoleName.range+'</div></div>';
            wrap.innerHTML = html;
        },

        renderWeapon: function(){
            this.weaponOrSkills = 'weapon';
            document.getElementById('skill-weapon').style.color = '#e5e5e5';
            document.getElementById('skill-skills').style.color = '#ffffff33';
            var wrap = document.getElementById('mCSB_1_container');
            var player = this.game.player;
            
            var html = '';
            var weaponConsoleName = player.weapon.getConsoleName();
            html += '<div class="weapon-icon"><img src="assets/sprites/' + weaponConsoleName.sprite + '.png"/></div><div class="newline"></div><div class="tr"><div class="td_weapon">[Name: ' + this.game.console.wrap(player.weapon) + ']</div></div><div class="tr"><div class="td_weapon">Weapon Rank: '+ weaponConsoleName.rank + '</div></div><div class="tr"><div class="td_weapon">Modifiers: ' + weaponConsoleName.stats + '</div></div><div class="tr"><div class="td_weapon">Range: ' + weaponConsoleName.range+'</div></div>';
            wrap.innerHTML = html;
            
        },

        renderSkills: function(){
            this.weaponOrSkills = 'skills';
            document.getElementById('skill-weapon').style.color = '#ffffff33';
            document.getElementById('skill-skills').style.color = '#e5e5e5';
            var wrap = document.getElementById('mCSB_1_container');
            var player = this.game.player;
            
            var skillsHtml = '';

            for(var i = 0; i< player.skills.length; i++){
                var skillConsoleName = player.skills[i].getConsoleName();
                if(skillConsoleName.selected){
                    skillsHtml += '<div class="tr"><div class="td_yellow">' + skillConsoleName.name + '</div></div><div class="tr"><div class="td_dark">';
                    skillsHtml += skillConsoleName.description + '</div></div><div class="tr"><div class="td_dark"></div></div>';
                }
                else{
                    skillsHtml += '<div class="tr"><div class="td">' + skillConsoleName.name + '</div></div><div class="tr"><div class="td_dark">';
                    skillsHtml += skillConsoleName.description + '</div></div><div class="tr"><div class="td_dark"></div></div>';
                }
            }
            wrap.innerHTML = skillsHtml;
        },
    };

    root.RL.Menu = Menu;

}(this));
