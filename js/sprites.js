(function(root) {
    'use strict';

    var Sprites = {

        loadSprites: function() {
            const knight = new Image();
            knight.src = 'assets/icons/knight.png';
            this.knight = knight;

            const knightess = new Image();
            knightess.src = 'assets/icons/knightess.png';
            this.knightess = knightess;

            const warrior = new Image();
            warrior.src = 'assets/icons/warrior.png';
            this.warrior = warrior;

            const warrioress = new Image();
            warrioress.src = 'assets/icons/warrioress.png';
            this.warrioress = warrioress;

            const mage = new Image();
            mage.src = 'assets/icons/mage.png';
            this.mage = mage;

            const sorceress = new Image();
            sorceress.src = 'assets/icons/sorceress.png';
            this.sorceress = sorceress;

            const ranger = new Image();
            ranger.src = 'assets/icons/ranger.png';
            this.ranger = ranger;

            const archeress = new Image();
            archeress.src = 'assets/icons/archeress.png';
            this.archeress = archeress;

            const ninja = new Image();
            ninja.src = 'assets/icons/ninja.png';
            this.ninja = ninja;

            const kunoichi = new Image();
            kunoichi.src = 'assets/icons/kunoichi.png';
            this.kunoichi = kunoichi;

            const kendoka = new Image();
            kendoka.src = 'assets/icons/kendoka.png';
            this.kendoka = kendoka;

            const ivory_reaper = new Image();
            ivory_reaper.src = 'assets/icons/ivory_reaper.png';
            this.ivory_reaper = ivory_reaper;

            const flower_fighter = new Image();
            flower_fighter.src = 'assets/icons/flower_fighter.png';
            this.flower_fighter = flower_fighter;

            const black_swordsman = new Image();
            black_swordsman.src = 'assets/icons/black_swordsman.png';
            this.black_swordsman = black_swordsman;

            const archery_disciple = new Image();
            archery_disciple.src = 'assets/icons/archery_disciple.png';
            this.archery_disciple = archery_disciple;

            const preschooler = new Image();
            preschooler.src = 'assets/icons/preschooler.png';
            this.preschooler = preschooler;

            const kitsune = new Image();
            kitsune.src = 'assets/icons/kitsune.png';
            this.kitsune = kitsune;

            const businessman = new Image();
            businessman.src = 'assets/icons/businessman.png';
            this.businessman = businessman;

            const battle_maid = new Image();
            battle_maid.src = 'assets/icons/battle_maid.png';
            this.battle_maid = battle_maid;
        
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

            const skill_scrollF = new Image();
            skill_scrollF.src = 'assets/sprites/skill_scrollF.png';
            this.skill_scrollF = skill_scrollF;

            const skill_scrollE = new Image();
            skill_scrollE.src = 'assets/sprites/skill_scrollE.png';
            this.skill_scrollE = skill_scrollE;

            const skill_scrollD = new Image();
            skill_scrollD.src = 'assets/sprites/skill_scrollD.png';
            this.skill_scrollD = skill_scrollD;

            const skill_scrollC = new Image();
            skill_scrollC.src = 'assets/sprites/skill_scrollC.png';
            this.skill_scrollC = skill_scrollC;

            const skill_scrollB = new Image();
            skill_scrollB.src = 'assets/sprites/skill_scrollB.png';
            this.skill_scrollB = skill_scrollB;

            const skill_scrollA = new Image();
            skill_scrollA.src = 'assets/sprites/skill_scrollA.png';
            this.skill_scrollA = skill_scrollA;

            const skill_scrollS = new Image();
            skill_scrollS.src = 'assets/sprites/skill_scrollS.png';
            this.skill_scrollS = skill_scrollS;

            const wooden_sword = new Image();
            wooden_sword.src = 'assets/sprites/wooden_sword.png';
            this.wooden_sword = wooden_sword;

            const wooden_shield = new Image();
            wooden_shield.src = 'assets/sprites/wooden_shield.png';
            this.wooden_shield = wooden_shield;

            const javelin = new Image();
            javelin.src = 'assets/sprites/javelin.png';
            this.javelin = javelin;

            const nails = new Image();
            nails.src = 'assets/sprites/nails.png';
            this.nails = nails;

            const copper_dagger = new Image();
            copper_dagger.src = 'assets/sprites/copper_dagger.png';
            this.copper_dagger = copper_dagger;

            const job_change_ticket = new Image();
            job_change_ticket.src = 'assets/sprites/job_change_ticket.png';
            this.job_change_ticket = job_change_ticket;
        },
    };
    
    root.RL.Sprites = Sprites;

}(this));
