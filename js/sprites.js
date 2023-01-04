(function(root) {
    'use strict';

    var Sprites = {

        loadSprites: function() {
            const player = new Image();
            player.src = 'assets/sprites/boy.png';
            this.player = player;
        
            const crate = new Image();
            crate.src = 'assets/sprites/crate.png';
            this.crate = crate;
        
            const potion = new Image();
            potion.src = 'assets/sprites/potion.png';
            this.potion = potion;
        
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

            const oak_tree = new Image();
            oak_tree.src = 'assets/sprites/oak_tree.png';
            this.oak_tree = oak_tree;

            const leaf_pile = new Image();
            leaf_pile.src = 'assets/sprites/leaf_pile.png';
            this.leaf_pile = leaf_pile;

            const door = new Image();
            door.src = 'assets/sprites/door.png';
            this.door = door;

            const door_open = new Image();
            door_open.src = 'assets/sprites/door_open.png';
            this.door_open = door_open;

            const goblin = new Image();
            goblin.src = 'assets/sprites/goblin.png';
            this.goblin = goblin;

            const goblin_king = new Image();
            goblin_king.src = 'assets/sprites/goblin_king.png';
            this.goblin_king = goblin_king;

            const boulder = new Image();
            boulder.src = 'assets/sprites/boulder.png';
            this.boulder = boulder;

            const mud = new Image();
            mud.src = 'assets/sprites/mud.png';
            this.mud = mud;

            const puddle = new Image();
            puddle.src = 'assets/sprites/puddle.png';
            this.puddle = puddle;

            const mushroom = new Image();
            mushroom.src = 'assets/sprites/mushroom.png';
            this.mushroom = mushroom;
        },
    };
    
    root.RL.Sprites = Sprites;

}(this));
