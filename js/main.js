var keyBindings = {
    up: ['↑', 'W'],
    down: ['↓', 'S'],
    left: ['←', 'A'],
    right: ['→', 'D'],
    // close: ['C'],
    open: ['O'],
    attack: ['E'],
    // ranged_attack: ['F'],
    // cancel: ['ESC']
    switch_skill: ['tab'],
    use_skill: ['R'],
};

var statElements = {
    nameEl: document.getElementById('stat-name'),
    levelEl: document.getElementById('stat-level'),
    jobEl: document.getElementById('stat-job'),
    titleEl: document.getElementById('stat-title'),
    goldEl: document.getElementById('stat-gold'),
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
    luckEl: document.getElementById('stat-luck'),
    weaponNameEl: document.getElementById('stat-weapon-name'),
    weaponStatsEl: document.getElementById('stat-weapon-stats'),
    weaponRangeEl: document.getElementById('stat-weapon-range'),
    skillsEl: document.getElementById('stat-skills'),
};

var controlsEL = document.getElementById('controls');
var mapContainerEl = document.getElementById('map-container');
var consoleContainerEl = document.getElementById('console-container');
var consoleDirectionsEl = document.getElementById('console-directions');
RL.Util.renderControlsHtml(controlsEL, keyBindings);

var mapCharToType = {
    '#': 'wall',
    '.': 'floor',
    'x': 'exit'
};

var mapHeight = 40;
var mapWidth = 40;
var rendererHeight = 25;
var rendererWidth = 25;

RL.ValidTargets.prototype.typeSortPriority = [RL.Entity, RL.Furniture, RL.Item];

// create the game instance
var game = new RL.Game(mapHeight, mapWidth, rendererHeight, rendererWidth);
game.renderer.resize(game.rendererWidth, game.rendererHeight);
game.renderer.layers = [
   
    new RL.RendererLayer(game, 'map',       {draw: false,   mergeWithPrevLayer: false}),
    
    
    new RL.RendererLayer(game, 'furniture', {draw: false,   mergeWithPrevLayer: true}),
    new RL.RendererLayer(game, 'item',      {draw: false,   mergeWithPrevLayer: true}),
    new RL.RendererLayer(game, 'entity',    {draw: false,   mergeWithPrevLayer: true}),
    new RL.RendererLayer(game, 'damage',    {draw: false,   mergeWithPrevLayer: true}), 

    new RL.RendererLayer(game, 'lighting',  {draw: true,    mergeWithPrevLayer: false}),
    new RL.RendererLayer(game, 'fov',       {draw: true,    mergeWithPrevLayer: false}),
    
];

game.input.addBindings(keyBindings);
RL.Util.merge(game.player, statElements);
game.player.renderHtml();
game.menu.startListening();
game.console.directionsEl = document.getElementById('console-directions');
mapContainerEl.appendChild(game.renderer.canvas);
consoleContainerEl.appendChild(game.console.el);

game.loadFloor();

// var mapData = game.generateMap();
// game.updatePalette();

// game.map.loadTilesFromArrayString(mapData, mapCharToType, 'floor');
// game.setMapSize(game.mapWidth, game.mapHeight);
// game.entityManager.loadFromArrayString(mapData, game.floor.entityCharToType);
// game.itemManager.loadFromArrayString(mapData, game.floor.itemsCharToType);
// game.furnitureManager.loadFromArrayString(mapData, game.floor.furnitureCharToType);
// game.generatePlayerStartPosition();
// game.setLighting(5);

game.start();
setInterval(function(){
    this.game.game_update();
}, 1000);

