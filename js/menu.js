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

        startListening: function(){
            document.getElementById('pr-inventory').addEventListener('click', this.displayInventoryMenu);
            document.getElementById('pr-shop').addEventListener('click', this.displayShopMenu);
            document.getElementById('pr-stats').addEventListener('click', this.displayStatsMenu);

            document.getElementById('inventory-foot-type').addEventListener('click', this.sortInventoryType('type'));
            document.getElementById('inventory-foot-rarity').addEventListener('click', this.sortInventoryRarity('rarity'));
            document.getElementById('inventory-foot-name').addEventListener('click', this.sortInventoryName('name'));
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
            var toSort = this.game.player.inventory;
            for(var i = 0; i<toSort.length; i++){
                console.log(toSort[i].name);
            }
            sorted = RL.Util.sortArrayOfObjects(toSort, 'group');
            for(var j = 0; j<sorted.length; j++){
                console.log(sorted[i].name);
            }
            this.renderInventory(sorted);
        },

        sortInventoryRarity: function(){
            var toSort = this.game.player.inventory;
            for(var i = 0; i<toSort.length; i++){
                console.log(toSort[i].name);
            }
            sorted = RL.Util.sortArrayOfObjects(toSort, 'rank');
            for(var j = 0; j<sorted.length; j++){
                console.log(sorted[i].name);
            }
            this.renderInventory(sorted);
        },

        sortInventoryName: function(){
            var toSort = this.game.player.inventory;
            for(var i = 0; i<toSort.length; i++){
                console.log(toSort[i].name);
            }
            sorted = RL.Util.sortArrayOfObjects(toSort, 'name');
            for(var j = 0; j<sorted.length; j++){
                console.log(sorted[i].name);
            }
            this.renderInventory(sorted);
        },

        renderInventory: function(inventory){
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

                html += '<div class="inventory-item"><div class="inventory-item-icon">' + icon + '</div><div class="inventory-item-info"><h4>' + color + inventory[i].name + ' - ' + inventory[i].rank +'</span> <br> <span>' + inventory[i].getStats() + '</span></h4></div></div>';
            }
            wrap.innerHTML = html;
        }, 
    };

    root.RL.Menu = Menu;

}(this));
