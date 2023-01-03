(function(root) {
    'use strict';

    var Sprites = {

        player: null,
        crate: null,
        healing: null,
        weapon: null,
        material: null,
        bush: null,
        slime: null,
        wolf: null,
        exit: null,

        loadSprites: function() {
            const player = new Image();
            player.src = 'assets/sprites/boy.png';
            this.player = player;
        
            const crate = new Image();
            crate.src = 'assets/sprites/crate.png';
            this.crate = crate;
        
            const healing = new Image();
            healing.src = 'assets/sprites/healing.png';
            this.healing = healing;
        
            const material = new Image();
            material.src = 'assets/sprites/material.png';
            this.material = material;
        
            const weapon = new Image();
            weapon.src = 'assets/sprites/weapon.png';
            this.weapon = weapon;

            const bush = new Image();
            bush.src = 'assets/sprites/bush.png';
            this.bush = bush;

            const slime = new Image();
            slime.src = 'assets/sprites/slime.png';
            this.slime = slime;

            const wolf = new Image();
            wolf.src = 'assets/sprites/wolf.png';
            this.wolf = wolf;

            const exit = new Image();
            exit.src = 'assets/sprites/exit.png';
            this.exit = exit;
        },
    };
    
    root.RL.Sprites = Sprites;

}(this));
