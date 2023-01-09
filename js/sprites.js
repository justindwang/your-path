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
        
            const hp_potion = new Image();
            hp_potion.src = 'assets/sprites/hp_potion.png';
            this.hp_potion = hp_potion;

            const mp_potion = new Image();
            mp_potion.src = 'assets/sprites/mp_potion.png';
            this.mp_potion = mp_potion;
        
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

            const fists = new Image();
            fists.src = 'assets/sprites/fists.png';
            this.fists = fists;

            const wolf_fang = new Image();
            wolf_fang.src = 'assets/sprites/wolf_fang.png';
            this.wolf_fang = wolf_fang;

            const rusty_dagger = new Image();
            rusty_dagger.src = 'assets/sprites/rusty_dagger.png';
            this.rusty_dagger = rusty_dagger;

            const kings_resent = new Image();
            kings_resent.src = 'assets/sprites/kings_resent.png';
            this.kings_resent = kings_resent;

            const sharp_rock = new Image();
            sharp_rock.src = 'assets/sprites/sharp_rock.png';
            this.sharp_rock = sharp_rock;

            const stinger = new Image();
            stinger.src = 'assets/sprites/stinger.png';
            this.stinger = stinger;

            const desolation = new Image();
            desolation.src = 'assets/sprites/desolation.png';
            this.desolation = desolation;

            const whip_of_fortune = new Image();
            whip_of_fortune.src = 'assets/sprites/whip_of_fortune.png';
            this.whip_of_fortune = whip_of_fortune;

            const barans_blades = new Image();
            barans_blades.src = 'assets/sprites/barans_blades.png';
            this.barans_blades = barans_blades;

            const excalibur = new Image();
            excalibur.src = 'assets/sprites/excalibur.png';
            this.excalibur = excalibur;

            const heavens_arrow = new Image();
            heavens_arrow.src = 'assets/sprites/heavens_arrow.png';
            this.heavens_arrow = heavens_arrow;

            const ascension_crystal = new Image();
            ascension_crystal.src = 'assets/sprites/ascension_crystal.png';
            this.ascension_crystal = ascension_crystal;

            const descension_crystal = new Image();
            descension_crystal.src = 'assets/sprites/descension_crystal.png';
            this.descension_crystal = descension_crystal;

            const coin_stash = new Image();
            coin_stash.src = 'assets/sprites/coin_stash.png';
            this.coin_stash = coin_stash;

            const wolf_fur = new Image();
            wolf_fur.src = 'assets/sprites/wolf_fur.png';
            this.wolf_fur = wolf_fur;

            const slime_goo = new Image();
            slime_goo.src = 'assets/sprites/slime_goo.png';
            this.slime_goo = slime_goo;

            const skill_scroll_f = new Image();
            skill_scroll_f.src = 'assets/sprites/skill_scroll_f.png';
            this.skill_scroll_f = skill_scroll_f;

            const skill_scroll_e = new Image();
            skill_scroll_e.src = 'assets/sprites/skill_scroll_e.png';
            this.skill_scroll_e = skill_scroll_e;

            const skill_scroll_d = new Image();
            skill_scroll_d.src = 'assets/sprites/skill_scroll_d.png';
            this.skill_scroll_d = skill_scroll_d;

            const skill_scroll_c = new Image();
            skill_scroll_c.src = 'assets/sprites/skill_scroll_c.png';
            this.skill_scroll_c = skill_scroll_c;

            const skill_scroll_b = new Image();
            skill_scroll_b.src = 'assets/sprites/skill_scroll_b.png';
            this.skill_scroll_b = skill_scroll_b;

            const skill_scroll_a = new Image();
            skill_scroll_a.src = 'assets/sprites/skill_scroll_a.png';
            this.skill_scroll_a = skill_scroll_a;

            const skill_scroll_s = new Image();
            skill_scroll_s.src = 'assets/sprites/skill_scroll_s.png';
            this.skill_scroll_s = skill_scroll_s;
        },
    };
    
    root.RL.Sprites = Sprites;

}(this));
