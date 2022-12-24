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
    };

    root.RL.Menu = Menu;

}(this));
