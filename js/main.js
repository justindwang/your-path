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
};

var controlsEL = document.getElementById('controls');
var mapContainerEl = document.getElementById('map-container');
var consoleContainerEl = document.getElementById('console-container');
consoleContainerEl.classList.add('border-ui');
consoleContainerEl.classList.add('dark-background');
var consoleDirectionsEl = document.getElementById('console-directions');
RL.Util.renderControlsHtml(controlsEL, keyBindings);

var mapCharToType = {
    '#': 'wall',
    '.': 'floor',
    'x': 'exit'
};

var mapHeight = 25;
var mapWidth = 25;
var rendererHeight = 10;
var rendererWidth = 10;

RL.ValidTargets.prototype.typeSortPriority = [RL.Entity, RL.Furniture, RL.Item];

RL.Util.loadColorBounds();


// create the game instance
var game = new RL.Game(mapHeight, mapWidth, rendererHeight, rendererWidth);
console.log('yowtf');
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

// game.input.addBindings(keyBindings);
RL.Util.merge(game.player, statElements);
game.player.renderHtml();
game.menu.startListening();
game.console.directionsEl = document.getElementById('console-directions');
mapContainerEl.appendChild(game.renderer.canvas);
consoleContainerEl.appendChild(game.console.el);

game.loadFloor();

RL.Sprites.loadSprites();

window.onload = () => {
    game.start();
    setInterval(function(){
        this.game.game_update();
    }, 1000);
};






