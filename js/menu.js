(function(root) {
    'use strict';

    var Menu = function Menu(game) {
        this.game = game;
        if(this.init){
            this.init();
        }
    };

    Menu.prototype = {
        constructor: Menu,

        game: null,

        // itemConfirm: false,
        itemConfirmIndex: -1,

        startListening: function(){
            document.getElementById('pr-inventory').addEventListener('click', this.displayInventoryMenu);
            document.getElementById('pr-shop').addEventListener('click', this.displayShopMenu);
            document.getElementById('pr-stats').addEventListener('click', this.displayStatsMenu);

            document.getElementById('inventory-foot-type').addEventListener('click', () => {this.sortInventoryType()});
            document.getElementById('inventory-foot-rarity').addEventListener('click', () => {this.sortInventoryRarity()});
            document.getElementById('inventory-foot-name').addEventListener('click', () => {this.sortInventoryName()});

            this.addInventoryListeners();
        },

        addInventoryListeners: function(){
            var inventory = this.game.player.inventory;
            for(let i = 0; i<inventory.length; i++){
                let item = document.getElementById('inventory-item-' + i);
                item.addEventListener('click', () => {this.itemClicked(i)});
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

                html += '<div class="inventory-item" id="inventory-item-'+ i + '"><div class="inventory-item-icon">' + icon + '</div><div class="inventory-item-info"><h4>' + color + inventory[i].name + ' - ' + inventory[i].rank +'</span> <br> <span>' + inventory[i].getStats() + '</span></h4></div></div>';
            }
            wrap.innerHTML = html;
        },

        itemClicked: function(slotNum){
            var inventory = this.game.player.inventory;
            var group = inventory[slotNum].group;

            if (slotNum == this.itemConfirmIndex){
                if (group != 'material'){
                    this.game.player.useItem(slotNum);
                    this.renderInventory();
                }
                this.clearClickData();
            }
            else{
                this.itemConfirmIndex = slotNum;
                if(group=='healing')
                    this.game.console.logAskConfirmHeal(inventory[slotNum]);
                else if (group == 'weapon')
                    this.game.console.logAskConfirmEquip(inventory[slotNum]);
                else
                    this.game.console.loginspectMaterial(inventory[slotNum]);
            }
        },
        
        clearClickData: function(){
            this.itemConfirmIndex = -1;
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

                html += '<div class="inventory-item" id="inventory-item-'+ i + '"><div class="inventory-item-icon">' + icon + '</div><div class="inventory-item-info"><h4>' + color + inventory[i].name + ' - ' + inventory[i].rank +'</span> <br> <span>' + inventory[i].getStats() + '</span></h4></div></div>';
            }
            wrap.innerHTML = html;
            this.addInventoryListeners();
            this.clearClickData();
        }, 
    };

    root.RL.Menu = Menu;

}(this));
