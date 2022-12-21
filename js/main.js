var keyBindings = {
    up: ['↑', 'W'],
    down: ['↓', 'S'],
    left: ['←', 'A'],
    right: ['→', 'D'],
    // close: ['C'],
    // open: ['O'],
    melee_attack: ['E'],
    ranged_attack: ['F'],
    wait: ['space'],
    // cancel: ['ESC']
};
var controlsEL = document.getElementById('controls');
var mapContainerEl = document.getElementById('map-container');
var consoleContainerEl = document.getElementById('console-container');
var consoleDirectionsEl = document.getElementById('console-directions');
var controlsHtml = '';
controlsHtml += '<div class="tr"><div class="td">Action</div> <div class="td">Keys</div></div>';
for(var action in keyBindings){
    controlsHtml += '<div class="tr">';
    controlsHtml += '<div class="td">' + action + '</div>';

    var val = keyBindings[action];
    controlsHtml += '<div class="td">';
    controlsHtml += val.join(', ');
    controlsHtml += '</div>';
    controlsHtml += '</div>';
}

    controlsEL.innerHTML = controlsHtml;

// var mapData = [
//     '############################',
//     '#h................#........#',
//     '#.......2.........+......#5#',
//     '#.................#+########',
//     '#.................+z...SSSU#',
//     '#.................#z.i.....#',
//     '#...hh............+..TTTT..#',
//     '#..hTTh...........#z.Tha...#',
//     '#...hh......h.....##########',
//     '#.................#.......4#',
//     '#...hh............#........#',
//     '#..hTTh...........+...hh...#',
//     '#...hh.........h..#...TT...#',
//     '#.b...............#..hTTh..#',
//     '#...hh.....------.#...TT...#',
//     '#..hTTh....------.#..hTTh..#',
//     '#...hh............#...TT...#',
//     '#..........------.#..hTTh..#',
//     '#..........------.#...TTm..#',
//     '#.................+...hh...#',
//     '#.................#........#',
//     '#.................#.TTTTTTT#',
//     '###+##########+#############',
//     '#...zzzzzzz......3#........#',
//     '#..z..............#........#',
//     '#...z......zzzzzz.#........#',
//     '#.................#........#',
//     '#...zzzzzzz.......#........#',
//     '##############+#############',
//     '#...........#...#.#........#',
//     '#...........#...#.#........#',
//     '#...........##x##.#........#',
//     '#.................#........#',
//     '#.................#........#',
//     '############################',
// ];

var mapCharToType = {
    '#': 'wall',
    '.': 'floor',
    'x': 'exit'
};

// var entityCharToType = {
//     z: 'zombie',
//     i: 'slime'
// };

// var furnitureCharToType = {
//     h: 'chair',
//     T: 'table',
//     S: 'shelves',
//     U: 'trashcan',
//     '-': 'box',
//     '+': 'door'
// };

// var itemsCharToType = {
//     '2': 'umbrella',
//     '3': 'folding_chair',
//     '4': 'meat_tenderizer',
//     '5': 'pointy_stick',
//     m: 'medkit',
//     b: 'bandage',
//     a: 'asprin',
// };

var playerStartX = 24;
var playerStartY = 7;
var rendererWidth = 25;
var rendererHeight = 25;

RL.ValidTargets.prototype.typeSortPriority = [RL.Entity, RL.Furniture, RL.Item];

// create the game instance
var game = new RL.Game(1);
var mapData = game.generateMap(40,40,1);
var entityCharToType = RL.Floor.Data[1].entityCharToType;
var furnitureCharToType = RL.Floor.Data[1].furnitureCharToType;
var itemsCharToType = RL.Floor.Data[1].itemsCharToType;

game.updatePalette();

game.map.loadTilesFromArrayString(mapData, mapCharToType, 'floor');

game.setMapSize(game.map.width, game.map.height);

game.entityManager.loadFromArrayString(mapData, entityCharToType);
game.itemManager.loadFromArrayString(mapData, itemsCharToType);
game.furnitureManager.loadFromArrayString(mapData, furnitureCharToType);

// add input keybindings
game.input.addBindings(keyBindings);

// set player starting position
game.player.x = playerStartX;
game.player.y = playerStartY;

game.renderer.resize(rendererWidth, rendererHeight);

game.renderer.layers = [
    new RL.RendererLayer(game, 'map',       {draw: false,   mergeWithPrevLayer: false}),

    new RL.RendererLayer(game, 'furniture', {draw: false,   mergeWithPrevLayer: true}),
    new RL.RendererLayer(game, 'item',      {draw: false,   mergeWithPrevLayer: true}),
    new RL.RendererLayer(game, 'entity',    {draw: false,   mergeWithPrevLayer: true}),
    new RL.RendererLayer(game, 'damage',    {draw: false,   mergeWithPrevLayer: true}),

    new RL.RendererLayer(game, 'lighting',  {draw: true,    mergeWithPrevLayer: false}),
    new RL.RendererLayer(game, 'fov',       {draw: true,    mergeWithPrevLayer: false}),
];

mapContainerEl.appendChild(game.renderer.canvas);
consoleContainerEl.appendChild(game.console.el);
game.console.directionsEl = document.getElementById('console-directions');

var statElements = {
    nameEl: document.getElementById('stat-name'),
    levelEl: document.getElementById('stat-level'),
    jobEl: document.getElementById('stat-job'),
    titleEl: document.getElementById('stat-title'),
    hpEl: document.getElementById('stat-hp'),
    hpMaxEl: document.getElementById('stat-hp-max'),
    mpEl: document.getElementById('stat-mp'),
    mpMaxEl: document.getElementById('stat-mp-max'),

    strengthEl: document.getElementById('stat-strength'),
    vitalityEl: document.getElementById('stat-vitality'),
    agilityEl: document.getElementById('stat-agility'),
    intelligenceEl: document.getElementById('stat-intelligence'),
    meleeWeaponNameEl: document.getElementById('stat-melee-weapon-name'),
    meleeWeaponStatsEl: document.getElementById('stat-melee-weapon-stats'),
    rangedWeaponNameEl: document.getElementById('stat-ranged-weapon-name'),
    rangedWeaponStatsEl: document.getElementById('stat-ranged-weapon-stats'),
};
RL.Util.merge(game.player, statElements);

game.player.renderHtml();

// game.furnitureManager.add(25, 7, 'chest');

game.map.each(function(val, x, y){
    if((x+1) % 5 === 0 && (y+1) % 5 === 0){
        var tile = game.map.get(x, y);
        if(tile.type !== 'wall'){
            game.lighting.set(x, y, 100, 100, 100);
        }
    }
});

game.start();


