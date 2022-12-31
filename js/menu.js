(function(root) {
    'use strict';

    /*
    * Menu class that manages inventory, shop, and stats UI
    */
    var Menu = function Menu(game) {
        this.game = game;
        this.shop = [new RL.Item(this.game, 'stinger'), new RL.Item(this.game, 'hp_potion'), new RL.Item(this.game, 'hp_potion'), new RL.Item(this.game, 'secret_rocks'), new RL.Item(this.game, 'whip_of_fortune'), new RL.Item(this.game, 'barans_blades')];
        this.stats = this.initializeAllStats();
        if(this.init){
            this.init();
        }
    };

    Menu.prototype = {
        constructor: Menu,

        game: null,

        shop: [],

        stats: [],

        inventoryItemConfirmIndex: -1,
        shopItemConfirmIndex: -1,

        startListening: function(){
            document.getElementById('pr-inventory').addEventListener('click', this.displayInventoryMenu);
            document.getElementById('pr-shop').addEventListener('click', this.displayShopMenu);
            document.getElementById('pr-stats').addEventListener('click', this.displayStatsMenu);

            document.getElementById('inventory-foot-type').addEventListener('click', () => {this.sortInventoryType()});
            document.getElementById('inventory-foot-rarity').addEventListener('click', () => {this.sortInventoryRarity()});
            document.getElementById('inventory-foot-name').addEventListener('click', () => {this.sortInventoryName()});

            document.getElementById('shop-foot-type').addEventListener('click', () => {this.sortShopType()});
            document.getElementById('shop-foot-rarity').addEventListener('click', () => {this.sortShopRarity()});
            document.getElementById('shop-foot-name').addEventListener('click', () => {this.sortShopName()});

            document.getElementById('stats-foot-type').addEventListener('click', () => {this.sortStatsType()});
            document.getElementById('stats-foot-rarity').addEventListener('click', () => {this.sortStatsRarity()});
            document.getElementById('stats-foot-name').addEventListener('click', () => {this.sortStatsName()});

            this.addInventoryListeners();
            this.addShopListeners();
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
        
        sortInventoryType: function(){
            document.getElementById('inventory-foot-type').style.color = '#e5e5e5';
            document.getElementById('inventory-foot-rarity').style.color = '#ffffff33';
            document.getElementById('inventory-foot-name').style.color = '#ffffff33';

            var toSort = this.game.player.inventory;
            this.game.player.inventory = RL.Util.sortArrayOfObjects(toSort, 'group');
            this.renderInventory();
        },

        sortInventoryRarity: function(){
            document.getElementById('inventory-foot-type').style.color = '#ffffff33';
            document.getElementById('inventory-foot-rarity').style.color = '#e5e5e5';
            document.getElementById('inventory-foot-name').style.color = '#ffffff33';

            var toSort = this.game.player.inventory;
            this.game.player.inventory = RL.Util.sortArrayOfObjects(toSort, 'rank');
            this.renderInventory();
        },

        sortInventoryName: function(){
            document.getElementById('inventory-foot-type').style.color = '#ffffff33';
            document.getElementById('inventory-foot-rarity').style.color = '#ffffff33';
            document.getElementById('inventory-foot-name').style.color = '#e5e5e5';

            var toSort = this.game.player.inventory;
            this.game.player.inventory = RL.Util.sortArrayOfObjects(toSort, 'name');
            this.renderInventory();
        },

        sortShopType: function(){
            document.getElementById('shop-foot-type').style.color = '#e5e5e5';
            document.getElementById('shop-foot-rarity').style.color = '#ffffff33';
            document.getElementById('shop-foot-name').style.color = '#ffffff33';

            this.shop = RL.Util.sortArrayOfObjects(this.shop, 'group');
            this.renderShop();
        },

        sortShopRarity: function(){
            document.getElementById('shop-foot-type').style.color = '#ffffff33';
            document.getElementById('shop-foot-rarity').style.color = '#e5e5e5';
            document.getElementById('shop-foot-name').style.color = '#ffffff33';

            this.shop = RL.Util.sortArrayOfObjects(this.shop, 'rank');
            this.renderShop();
        },

        sortShopName: function(){
            document.getElementById('shop-foot-type').style.color = '#ffffff33';
            document.getElementById('shop-foot-rarity').style.color = '#ffffff33';
            document.getElementById('shop-foot-name').style.color = '#e5e5e5';

            this.shop = RL.Util.sortArrayOfObjects(this.shop, 'name');
            this.renderShop();
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
            var group = inventory[slotNum].group;

            if (slotNum == this.inventoryItemConfirmIndex){
                if (group != 'material'){
                    this.game.player.useItem(slotNum);
                    this.renderInventory();
                }
                this.clearClickData();
            }
            else{
                this.inventoryItemConfirmIndex = slotNum;
                if(group=='healing')
                    this.game.console.logAskConfirmHeal(inventory[slotNum]);
                else if (group == 'weapon')
                    this.game.console.logAskConfirmEquip(inventory[slotNum]);
                else
                    this.game.console.logInspectMaterial(inventory[slotNum]);
            }
        },

        shopItemClicked: function(slotNum){
            var item = this.shop[slotNum];
            if (slotNum == this.shopItemConfirmIndex){
                if(this.game.player.gold >= item.cost){
                    this.game.player.gold -= item.cost;
                    this.shop.splice(slotNum, 1);
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
        
        clearClickData: function(){
            this.inventoryItemConfirmIndex = -1;
            this.shopItemConfirmIndex = -1;
        },

        addToInventory: function(item){
            this.game.player.inventory.push(item);
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
                switch(inventory[i].group) {
                    case 'healing': icon = '<img src="assets/icons/heal.png"/>'; break;
                    case 'weapon': icon = '<img src="assets/icons/weapon.png"/>'; break;
                    case 'material': icon = '<img src="assets/icons/drops.png"/>'; break;
                }
                switch(inventory[i].rank){
                    case 'S': color = '<span style="color:brown">'; break;
                    case 'A': color = '<span style="color:orchid">'; break;
                    case 'B': color = '<span style="color:darkolivegreen">'; break;
                    case 'C': color = '<span style="color:cadetblue">'; break;
                    case 'D': color = '<span style="color:paleturquoise">'; break;
                    case 'E': color = '<span style="color:goldenrod">'; break;
                    case 'F': color = '<span style="color:peachpuff">'; break;
                }

                html += '<div class="menu-item" id="inventory-item-'+ i + '"><div class="menu-item-icon">' + icon + '</div><div class="menu-item-info"><h4>' + color + inventory[i].name + ' - ' + inventory[i].rank +'</span> <br> <span>' + inventory[i].getStats() + '</span></h4></div></div>';
            }
            wrap.innerHTML = html;
        },

        renderInventory: function(){
            var inventory = this.game.player.inventory;
            var wrap = document.getElementById('mCSB_1_container');
            var icon = '';
            var color = '';
            var html = '';
            
            for(var i = 0; i<inventory.length; i++){
                switch(inventory[i].group) {
                    case 'healing': icon = '<img src="assets/icons/heal.png"/>'; break;
                    case 'weapon': icon = '<img src="assets/icons/weapon.png"/>'; break;
                    case 'material': icon = '<img src="assets/icons/drops.png"/>'; break;
                }
                switch(inventory[i].rank){
                    case 'S': color = '<span style="color:brown">'; break;
                    case 'A': color = '<span style="color:orchid">'; break;
                    case 'B': color = '<span style="color:darkolivegreen">'; break;
                    case 'C': color = '<span style="color:cadetblue">'; break;
                    case 'D': color = '<span style="color:paleturquoise">'; break;
                    case 'E': color = '<span style="color:goldenrod">'; break;
                    case 'F': color = '<span style="color:peachpuff">'; break;
                }

                html += '<div class="menu-item" id="inventory-item-'+ i + '"><div class="menu-item-icon">' + icon + '</div><div class="menu-item-info"><h4>' + color + inventory[i].name + ' - ' + inventory[i].rank +'</span> <br> <span>' + inventory[i].getStats() + '</span></h4></div></div>';
            }
            wrap.innerHTML = html;
            this.addInventoryListeners();
            this.clearClickData();
        }, 
        initShop: function(){
            var wrap = document.getElementById('shop-body');
            var icon = '';
            var color = '';
            var html = '';
            
            for(var i = 0; i< this.shop.length; i++){
                switch(this.shop[i].group) {
                    case 'healing': icon = '<img src="assets/icons/heal.png"/>'; break;
                    case 'weapon': icon = '<img src="assets/icons/weapon.png"/>'; break;
                    case 'material': icon = '<img src="assets/icons/drops.png"/>'; break;
                }
                switch(this.shop[i].rank){
                    case 'S': color = '<span style="color:brown">'; break;
                    case 'A': color = '<span style="color:orchid">'; break;
                    case 'B': color = '<span style="color:darkolivegreen">'; break;
                    case 'C': color = '<span style="color:cadetblue">'; break;
                    case 'D': color = '<span style="color:paleturquoise">'; break;
                    case 'E': color = '<span style="color:goldenrod">'; break;
                    case 'F': color = '<span style="color:peachpuff">'; break;
                }

                html += '<div class="menu-item" id="shop-item-'+ i + '"><div class="menu-item-icon">' + icon + '</div><div class="menu-item-info"><h4>' + color + this.shop[i].name + ' - ' + this.shop[i].rank +'</span> <br> <span>' + this.shop[i].getStats() + '</span></h4></div></div>';
            }
            wrap.innerHTML = html;
        },
        renderShop: function(){
            var wrap = document.getElementById('mCSB_2_container');
            var icon = '';
            var color = '';
            var html = '';
            
            for(var i = 0; i< this.shop.length; i++){
                switch(this.shop[i].group) {
                    case 'healing': icon = '<img src="assets/icons/heal.png"/>'; break;
                    case 'weapon': icon = '<img src="assets/icons/weapon.png"/>'; break;
                    case 'material': icon = '<img src="assets/icons/drops.png"/>'; break;
                }
                switch(this.shop[i].rank){
                    case 'S': color = '<span style="color:brown">'; break;
                    case 'A': color = '<span style="color:orchid">'; break;
                    case 'B': color = '<span style="color:darkolivegreen">'; break;
                    case 'C': color = '<span style="color:cadetblue">'; break;
                    case 'D': color = '<span style="color:paleturquoise">'; break;
                    case 'E': color = '<span style="color:goldenrod">'; break;
                    case 'F': color = '<span style="color:peachpuff">'; break;
                }

                html += '<div class="menu-item" id="shop-item-'+ i + '"><div class="menu-item-icon">' + icon + '</div><div class="menu-item-info"><h4>' + color + this.shop[i].name + ' - ' + this.shop[i].rank +'</span> <br> <span>' + this.shop[i].getStats() + '</span></h4></div></div>';
            }
            wrap.innerHTML = html;
            this.addShopListeners();
            this.clearClickData();
        }, 
        initStats: function(){
            var wrap = document.getElementById('stats-body');
            var icon = '';
            var color = '';
            var html = '';
            
            for(var i = 0; i<this.stats.length; i++){
                switch(this.stats[i].group) {
                    case 'healing': icon = '<img src="assets/icons/heal.png"/>'; break;
                    case 'combat': icon = '<img src="assets/icons/weapon.png"/>'; break;
                    case 'misc': icon = '<img src="assets/icons/stats.png"/>'; break;
                }
                switch(this.stats[i].rank){
                    case 'S': color = '<span style="color:brown">'; break;
                    case 'A': color = '<span style="color:orchid">'; break;
                    case 'B': color = '<span style="color:darkolivegreen">'; break;
                    case 'C': color = '<span style="color:cadetblue">'; break;
                    case 'D': color = '<span style="color:paleturquoise">'; break;
                    case 'E': color = '<span style="color:goldenrod">'; break;
                    case 'F': color = '<span style="color:peachpuff">'; break;
                }

                html += '<div class="menu-item" id="stats-item-'+ i + '"><div class="menu-item-icon">' + icon + '</div><div class="menu-item-info"><h4>' + color + this.stats[i].name + ' - ' + this.stats[i].rank +'</span> <br> <span>' + this.stats[i].getStats() + '</span></h4></div></div>';
            }
            wrap.innerHTML = html;
        },
        renderStats: function(){
            var wrap = document.getElementById('mCSB_3_container');
            var icon = '';
            var color = '';
            var html = '';
            
            for(var i = 0; i< this.stats.length; i++){
                switch(this.stats[i].group) {
                    case 'healing': icon = '<img src="assets/icons/heal.png"/>'; break;
                    case 'combat': icon = '<img src="assets/icons/weapon.png"/>'; break;
                    case 'misc': icon = '<img src="assets/icons/stats.png"/>'; break;
                }
                switch(this.stats[i].rank){
                    case 'S': color = '<span style="color:brown">'; break;
                    case 'A': color = '<span style="color:orchid">'; break;
                    case 'B': color = '<span style="color:darkolivegreen">'; break;
                    case 'C': color = '<span style="color:cadetblue">'; break;
                    case 'D': color = '<span style="color:paleturquoise">'; break;
                    case 'E': color = '<span style="color:goldenrod">'; break;
                    case 'F': color = '<span style="color:peachpuff">'; break;
                }

                html += '<div class="menu-item" id="stats-item-'+ i + '"><div class="menu-item-icon">' + icon + '</div><div class="menu-item-info"><h4>' + color + this.stats[i].name + ' - ' + this.stats[i].rank +'</span> <br> <span>' + this.stats[i].getStats() + '</span></h4></div></div>';
            }
            wrap.innerHTML = html;
            this.clearClickData();
        }, 
    };

    root.RL.Menu = Menu;

}(this));
