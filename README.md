Your Path
=====================

A roguelike game for the browser written in js using [js-roguelike-skeleton](https://github.com/unstoppablecarl/js-roguelike-skeleton) built on top of [Escape-from-Ecma-Labs](https://github.com/unstoppablecarl/escape-from-ecma-labs)

Todo:
<details>
<summary>(done)</summary>
<br>
- generalize melee/ranged weapon into one action (might be buggy)
<br>
- combine color and console color for items to match rarity
<br>
- apply stat modifiers from items <br>
- UI for equipping/changing weapons <br>
- change item attaching mechanic to add to inventory<br>
- remove entities from canvas when killed <br>
- revamp door generation / fix bug where door is blocked by a wall<br>
- ui to stay/go to next floor when reaching exit <br>
- display floor name<br>
- remove grab functionality <br>
- keep target if object is not an entity<br>
- change smash layer to show damage numbers <br>
- remove horde push bonus <br>
- remove wait action <br>
- change entity randomization function to % rates<br>
- bug with seekingmeleeentity uncaught error object manager move (done for now)<br>
- floor info when reaching new floor - display mobs/items and rarity (common, uncommon, rare, very rare)<br>
    - mapping function for percent chance to rarity<br>
- Loot tables for mobs<br>
- add mob item drops onto canvas<br>
- floors can have crates that drop items <br>
- items can be purchased from shop <br>
- aggro range for mobs can be set <br>
- added stats/achievements tab <br>
- implemented basic stat tracking mechanic <br>
- add item stacking to shop ui and internally as item instance variable <br>
- added gold system and ability to sell items <br>
- added luck stat and crit chance <br>
- added vitality and intelligence mp gain and hp gain formulas <br>
- agility now increases dodge chance <br>
- added sprites to canvas <br>
- clean up unneeded chars/colors <br>
- mp regeneration mechanic <br>
- shop items are now randomly generated each floor <br>
</details>

## design more mobs/floors/skills/items
## implement classes/jobs

- fast travel to different floors
- design skill learning mechanic 
    - purchasing runes: add skill from canvas/shop into inventory
    - from stats page / achievements
- add multiplayer
- revamp ui to show item/skill ranks and/or range
- explore aoe damage
- add bosses
- add saving mechanic
- add personalization ui (e.g. job/name selection)
- explore rendering images instead of characters on canvas
- handle post game over functionality/bugs
- make crits stand out more
- fix bug/feature? where you can push furniture onto items
- add buffs