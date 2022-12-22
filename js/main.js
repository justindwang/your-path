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
    switch_skill: ['tab'],
};
var controlsEL = document.getElementById('controls');
var mapContainerEl = document.getElementById('map-container');
var consoleContainerEl = document.getElementById('console-container');
var consoleDirectionsEl = document.getElementById('console-directions');

// building controls section of html style="color:red;"
var controlsHtml = '';
controlsHtml += '<div class="tr"><div class="td_center_head">Action</div> <div class="td_tab">MMMMM</div><div class="td_center_head">Keys</div></div>';
for(var action in keyBindings){
    controlsHtml += '<div class="tr">';
    controlsHtml += '<div class="td_center">' + action + '</div>';
    controlsHtml += '<div class="td"></div>';
    var val = keyBindings[action];
    controlsHtml += '<div class="td_center">';
    controlsHtml += val.join(', ');
    controlsHtml += '</div>';
    controlsHtml += '</div>';
}
controlsEL.innerHTML = controlsHtml;

var mapCharToType = {
    '#': 'wall',
    '.': 'floor',
    'x': 'exit'
};

var rendererWidth = 25;
var rendererHeight = 25;

RL.ValidTargets.prototype.typeSortPriority = [RL.Entity, RL.Furniture, RL.Item];

// create the game instance
var game = new RL.Game(1);
var mapData = game.generateMap(100,100,1);

var floor1 = new RL.Floor(game, 1);
game.updatePalette();

game.map.loadTilesFromArrayString(mapData, mapCharToType, 'floor');

game.setMapSize(game.map.width, game.map.height);

game.entityManager.loadFromArrayString(mapData, floor1.entityCharToType);
game.itemManager.loadFromArrayString(mapData, floor1.itemsCharToType);
game.furnitureManager.loadFromArrayString(mapData, floor1.furnitureCharToType);

// add input keybindings
game.input.addBindings(keyBindings);

// set player starting position
let playerStartX = null;
let playerStartY = null;
do {
    playerStartX = RL.Util.random(1, game.map.width-1);
    playerStartY = RL.Util.random(1, game.map.height-1);
} while (game.getObjectsAtPostion(playerStartX, playerStartY).length > 0 || game.map.get(playerStartX, playerStartY).name !='Floor');
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
    hpBarEl: document.getElementById('stat-hp-bar'),
    mpEl: document.getElementById('stat-mp'),
    mpMaxEl: document.getElementById('stat-mp-max'),
    mpBarEl: document.getElementById('stat-mp-bar'),

    strengthEl: document.getElementById('stat-strength'),
    vitalityEl: document.getElementById('stat-vitality'),
    agilityEl: document.getElementById('stat-agility'),
    intelligenceEl: document.getElementById('stat-intelligence'),
    meleeWeaponNameEl: document.getElementById('stat-melee-weapon-name'),
    meleeWeaponStatsEl: document.getElementById('stat-melee-weapon-stats'),
    rangedWeaponNameEl: document.getElementById('stat-ranged-weapon-name'),
    rangedWeaponStatsEl: document.getElementById('stat-ranged-weapon-stats'),
    skillsEl: document.getElementById('stat-skills'),
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


