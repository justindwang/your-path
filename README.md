Your Path
=====================

A roguelike game for the browser written in js using [js-roguelike-skeleton](https://github.com/unstoppablecarl/js-roguelike-skeleton) built on top of [Escape-from-Ecma-Labs](https://github.com/unstoppablecarl/escape-from-ecma-labs)

Play the latest version [here](https://justindwang.github.io/your-path/)

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
- added fast travel and special items <br>
- added individual weapon/item sprites <br>
- item prices are now displayed in the shop <br>
- added David Merfield's random color generator <br>
- added ui for allocatable stat points upon level up<br>
- added code for base jobs <br>
- added start menu with name/job selection <br>
- added skill scroll item and skill learning/forgetting ui<br>
- added mana costs to skill ui <br>
- added single target damaging skills <br>
- removed open keybinding <br>
- added aoe and multi-target skills <br>
- fix controls display <br>
- added job change ui <br>
- added job change tickets <br>
</details>

Todo:
### design more mobs/floors/skills/items
### balance the game bro
- add general skill methods to run after map generation (default void) and passives to run on game_update or player_update
    - on hit passive effects to run on attack / skill usage (mana/life steal, chance to not consume mana etc)
- add class specific skills eg. preschooler temper tantrum skill
- add avatar selection menu
- fix skill descriptions display (wrapping when there is scrollbar)
- revamp item/skill descriptions ui
- fix damage numbers being cut off
- add bosses
- add saving mechanic
- make crits stand out more
- fix bug/feature? where you can push furniture onto items
- add buffs
- add weapon classes
- add quests
- add multiplayer
- revamp tile mapping/generation
- add more background tiles / materials to floors
- add attack animations
- adjust damage calculations based on different stats/jobs
- disable keyholds 
- upgrade skills with dupes