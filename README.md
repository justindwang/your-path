Your Path
=====================

A roguelike game for the browser written in js using [js-roguelike-skeleton](https://github.com/unstoppablecarl/js-roguelike-skeleton) built on top of [Escape-from-Ecma-Labs](https://github.com/unstoppablecarl/escape-from-ecma-labs)

Todo:

# design more mobs/floors/skills/items
<details>
<summary>(done)</summary>
<br>
- generalize melee/ranged weapon into one action (might be buggy)
- combine color and console color for items to match rarity
- apply stat modifiers from items 
- UI for equipping/changing weapons 
- change item attaching mechanic to add to inventory
- remove entities from canvas when killed 
- revamp door generation / fix bug where door is blocked by a wall
- ui to stay/go to next floor when reaching exit 
- display floor name
- remove grab functionality 
- keep target if object is not an entity
- change smash layer to show damage numbers 
- remove horde push bonus 
- remove wait action 
- change entity randomization function to % rates
- bug with seekingmeleeentity uncaught error object manager move (done for now)
- floor info when reaching new floor - display mobs/items and rarity (common, uncommon, rare, very rare)
    - mapping function for percent chance to rarity
</details>

- Loot tables for mobs
- items from chests/crates
- add mob item drops onto canvas
- add item from shop into inventory
- SHOP/stats
- implement money system
- add functionality to intelligence, agility, and vitality stats
- add luck stat
- mp regeneration mechanic

- implement shop item mechanics
- fast travel to different floors
- design skill learning mechanic 
    - purchasing runes: add skill from canvas/shop into inventory
    - from stats page / achievements
- add item stacking to shop ui and internally as item instance variable
- add multiplayer
- revamp ui to show item/skill ranks and/or range
- explore aoe damage
- add bosses
- add saving mechanic
