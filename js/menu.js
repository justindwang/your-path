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
            var inventoryButtonEl = document.getElementById('pr-inventory');
            var shopButtonEl = document.getElementById('pr-shop');
            var statsButtonEl = document.getElementById('pr-stats');
 
            inventoryButtonEl.addEventListener('click', this.displayInventoryMenu);
            shopButtonEl.addEventListener('click', this.displayShopMenu);
            statsButtonEl.addEventListener('click', this.displayStatsMenu);
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
