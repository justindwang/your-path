(function() {
    'use strict';

    var proto = RL.Game.prototype;

    var NewGame = function Game(mapHeight, mapWidth, rendererHeight, rendererWidth){
        proto.constructor.call(this);
        this.furnitureManager = new RL.MultiObjectManager(this, RL.Furniture);
        this.itemManager = new RL.ObjectManager(this, RL.Item);
        this.smashLayer = new RL.Array2d();
        this.damageLayer = new RL.Array2d();
        this.mapHeight = mapHeight;
        this.mapWidth = mapWidth;
        this.rendererHeight = rendererHeight;
        this.rendererWidth = rendererWidth;
        this.floor = new RL.Floor(this, 1);
    };

    var newGamePrototype = {
        constructor: NewGame,

        maxRetries: 50,

        itemManager: null,

        furnitureManager: null,

        smashLayer: null,

        damageLayer: null,

        floor: null,

        mapHeight: null,
        mapWidth: null,
        rendererHeight: null,
        rendererWidth: null,

        paused: false,

        game_update: function(){
            if(!this.gameOver){
                this.entityManager.update();
                this.player.updateFov();

                this.lighting.update();
                this.renderer.draw();

                this.smashLayer.reset();
                this.damageLayer.reset();
                if(this.player.dead){
                    console.log('game over');
                }
                this.furnitureManager.update();
            }
            this.player.renderHtml();
            this.menu.renderStats();
            this.queueDraw = false;
        },

        /**
        * Handles user input actions.
        * @method onKeyAction
        * @param {String} action - Action triggered by user input.
        */
        onKeyAction: function(action) {
            if(!this.gameOver){
                var result = this.player.update(action);
                if(result){
                    if(action == 'switch_skill' || action == 'use_skill'){
                        this.player.renderHtml();
                        this.menu.renderStats();
                        this.queueDraw = false;
                        return;
                    }

                    // this.entityManager.update();
                    this.player.updateFov();

                    this.lighting.update();
                    this.renderer.setCenter(this.player.x, this.player.y);
                    this.renderer.draw();

                    this.smashLayer.reset();
                    this.damageLayer.reset();
                    if(this.player.dead){
                        console.log('game over');
                    }

                } else if(this.queueDraw){
                    this.renderer.draw();
                }
                this.furnitureManager.update();
            }
            this.queueDraw = false;
            this.menu.renderStats();
        },

        setMapSize: function(width, height){
            proto.setMapSize.call(this, width, height);
            this.itemManager.setSize(width, height);
            this.furnitureManager.setSize(width, height);
            this.smashLayer.setSize(width, height);
            this.damageLayer.setSize(width, height);
        },

        entityCanMoveThrough: function(entity, x, y, ignoreFurniture){
            ignoreFurniture = ignoreFurniture !== void 0 ? ignoreFurniture : false;
            if(!ignoreFurniture){
                var furniture = this.furnitureManager.getFirst(x, y, function(furniture){
                    return !furniture.passable;
                });
                if(furniture){
                    return false;
                }
            }

            return proto.entityCanMoveThrough.call(this, entity, x, y);
        },

        /**
        * Checks if an entity can move through and into a map tile and that tile is un-occupied.
        * @method entityCanMoveTo
        * @param {Entity} entity - The entity to check.
        * @param {Number} x - The x map tile coord to check.
        * @param {Number} y - The y map tile coord to check.
        * @return {Bool}
        */
        entityCanMoveTo: function(entity, x, y, ignoreFurniture){
            if(!this.entityCanMoveThrough(entity, x, y, ignoreFurniture)){
                return false;
            }
            // check if occupied by entity
            if(this.entityManager.get(x, y)){
                return false;
            }
            // nothing besides player can move to exit
            if(entity != this.player && this.map.get(x,y).type == 'exit')
                return false;
            return true;
        },
        entityMoveTo: function(entity, x, y){
            if(entity.bleeds){
                var hpRatio = entity.hp / entity.hpMax;
                var bleedChance = ( 1 - hpRatio) * 0.5;
                if(hpRatio < 1 && Math.random() < bleedChance){
                    this.map.get(entity.x, entity.y).blood += bleedChance * 0.5;
                }
            }
            proto.entityMoveTo.call(this, entity, x, y);
            var item = this.itemManager.get(x, y);
            if(item && item.canAttachTo(entity)){
                item.attachTo(entity);
                this.itemManager.remove(item);
            }
        },

        entityCanSeeThrough: function(entity, x, y){
            var tile = this.map.get(x, y);
            if(!tile || tile.blocksLos){
                return false;
            }
            var furniture = this.furnitureManager.getFirst(x, y, function(furniture){
                return furniture.blocksLos;
            });

            if(furniture){
                return false;
            }
            return true;
        },

        getObjectsAtPostion: function(x, y){
            var result = [];

            var entity = this.entityManager.get(x, y);
            if(entity){
                result.push(entity);
            }
            var furniture = this.furnitureManager.get(x, y);
            if(furniture){
                result = result.concat(furniture);
            }
            var item = this.itemManager.get(x, y);
            if(item){
                result.push(item);
            }
            return result;
        },

        onClick: function(x, y){
            var coords = this.renderer.mouseToTileCoords(x, y),
                tile = this.map.get(coords.x, coords.y);
            if(!tile){
                return;
            }

            // console.log('click', tile.x, tile.y);

            if(!this.player.fov.get(tile.x, tile.y)){
                return;
            }

            if(this.player.actionTargets && this.player.actionTargets.targets.length){
                var objects = this.getObjectsAtPostion(coords.x, coords.y);
                for(var i = objects.length - 1; i >= 0; i--){
                    var obj = objects[i];
                    var target = this.player.actionTargets.map.getFirst(tile.x, tile.y);
                    if(target){
                        this.player.actionTargets.setCurrent(target);
                        this.renderer.draw();
                        return;
                    }
                }
            }

            this.console.logTileInspect(tile, this.getObjectsAtPostion(tile.x, tile.y));
        },

        onHover: function(){

        },

        splatter: function(x, y, amount){
            var tile = this.map.get(x, y);
            tile.blood += amount;
            var adj = this.map.getAdjacent(x, y);
            for(var i = adj.length - 1; i >= 0; i--){
                var a = adj[i];
                a.blood += Math.random() * amount;
            }
        },

        bsp: function(array, max_iter){
            let vert_retries = 0;
            let hori_retries = 0;
            let n_iter = 0;
            let bspTree = [...array];
            let stack = [];
            stack.push([1, 1, bspTree[0].length-2, bspTree.length-2]);
            while (stack.length > 0) {
                if (n_iter >= max_iter)
                    return bspTree;
                else
                    n_iter++;
                let partition = stack.pop();
                let x1 = partition[0];
                let y1 = partition[1];
                let x2 = partition[2];
                let y2 = partition[3];
                if (RL.Util.random(0, 1) == 0){
                    //vertical split
                    let x = RL.Util.random(x1+1, x2-1);
                    let h = y2-y1;
                    while(x == Math.floor((x1+x2)/2) || x == Math.floor((x1+x2)/2) + 1){
                        vert_retries++;
                        if(vert_retries > this.maxRetries)
                            return bspTree;
                        x = RL.Util.random(x1 + 1, x2 - 1);
                    }
                    if((x-x1)/h < 0.45 || (x2-x)/h < 0.45){
                        stack.push(partition);
                        n_iter--;
                    }
                    else{
                        for (var k = y2; k >= y1; k--)
                            bspTree[x][k] = '#';
                        var mid = Math.floor((y1+y2)/2);
                        bspTree[x][mid - 1] = '+';
                        bspTree[x][mid] = '+';
                        bspTree[x][mid + 1] = '+';
                        stack.unshift([x1,y1, x-1, y2]);
                        stack.unshift([x+1,y1, x2, y2]);
                    }
                }
                else{
                    //horizontal split
                    let y = RL.Util.random(y1 + 1, y2 - 1);
                    let w = x2-x1;
                    while(y == Math.floor((y != (y1+y2)/2)) || y == Math.floor((y != (y1+y2)/2)) + 1){
                        hori_retries++;
                        if(hori_retries > this.maxRetries)
                            return bspTree;
                        y = RL.Util.random(y1 + 1, y2 - 1);
                    }
                    if( (y-y1)/w < 0.45 || (y2-y)/w < 0.45){
                        stack.push(partition);
                        n_iter--;
                    }
                    else{
                        for (var j = x2; j >= x1; j--)
                            bspTree[j][y] = '#';
                        var mid = Math.floor((x1+x2)/2);
                        bspTree[mid - 1][y] = '+';
                        bspTree[mid][y] = '+';
                        bspTree[mid + 1][y] = '+';

                        stack.unshift([x1,y1, x2, y-1]);
                        stack.unshift([x1,y+1, x2, y2]);    
                    }
                }
            }
            return bspTree;
        },

        addEntities: function(array){
            var _this = this;
            function replace_with_sample(char) {
                if(char == '#')
                    return '#';
                if(char == '+')
                    return '+';
                return RL.Util.getRandomFromRate(_this.floor.entities);
            }
            RL.Util.apply2D(array, replace_with_sample);

            // adding gate at random
            let x = null;
            let y = null;
            do {
                x = RL.Util.random(1, array[0].length-2);
                y = RL.Util.random(1, array.length-2);
            } while (array[x][y] != '.');
            array[x][y] = 'x';
        },

        generateMap: function(){
            var mapData = [];
            var s = ['#'];
            var t = ['#','#'];
            for(var i = this.mapWidth-3; i>=0; i--){
                s.push('.');
                t.push('#');
            }
            s.push('#');
            for(var j = this.mapHeight-3; j>=0; j--){
                var ss = [...s];
                mapData.push(ss);
            }
            mapData.push(t);
            mapData.unshift(t);
            mapData = this.bsp(mapData, Math.floor(Math.log2(this.mapHeight*this.mapWidth))-1);
            this.addEntities(mapData);
            for(var k = mapData.length - 1; k>=0; k--){
                mapData[k] = mapData[k].join('');
            }
            return mapData;
        },

        /**
         * Updates tile colors to the preset colors for x floor
         */
        updatePalette: function(){
            RL.Tile.Types['floor'].color = this.floor.floorColor;
            RL.Tile.Types['floor'].bgColor = this.floor.floorBgColor;
            RL.Tile.Types['wall'].color = this.floor.wallColor;
            RL.Tile.Types['wall'].bgColor = this.floor.wallBgColor;
            RL.Tile.Types['exit'].bgColor = this.floor.floorBgColor;
        },

        generatePlayerStartPosition: function(){
            let playerStartX = null;
            let playerStartY = null;
            do {
                playerStartX = RL.Util.random(1, this.map.width-1);
                playerStartY = RL.Util.random(1, this.map.height-1);
            } while (this.getObjectsAtPostion(playerStartX, playerStartY).length > 0 || this.map.get(playerStartX, playerStartY).name !='Floor');
            this.player.x = playerStartX;
            this.player.y = playerStartY;
        },
        setLighting: function(interval){
            var _this = this;
            _this.map.each(function(val, x, y){
                if((x+1) % interval === 0 && (y+1) % interval === 0){
                    var tile = _this.map.get(x, y);
                    if(tile.type !== 'wall'){
                        _this.lighting.set(x, y, 100, 100, 100);
                    }
                }
            });
            
        },

        loadFloor: function(){
            var mapData = this.generateMap();
            this.updatePalette();
            this.map.loadTilesFromArrayString(mapData, mapCharToType, 'floor');
            this.setMapSize(this.mapWidth, this.mapHeight);
            this.entityManager.loadFromArrayString(mapData, this.floor.entityCharToType);
            this.itemManager.loadFromArrayString(mapData, this.floor.itemsCharToType);
            this.furnitureManager.loadFromArrayString(mapData, this.floor.furnitureCharToType);
            this.generatePlayerStartPosition();
            this.setLighting(5);
            this.console.logCurrentFloor(this.floor);
        },

        goToFloor: function(number){
            if(RL.Floor.Data[number]){
                var y_n_exit = {
                    next_floor: ['Y'],
                    same_floor: ['N'],};
                this.input.removeBindings(y_n_exit);
                this.floor = new RL.Floor(this, number);
                this.map = new RL.Map(this);
                this.furnitureManager = new RL.MultiObjectManager(this, RL.Furniture);
                this.itemManager = new RL.ObjectManager(this, RL.Item);
                this.smashLayer = new RL.Array2d();
                this.damageLayer = new RL.Array2d();
                this.entityManager = new RL.ObjectManager(this, RL.Entity);
                this.loadFloor();
                this.menu.generateShop();
                this.menu.renderShop();
                this.start();
            }
            else{
                console.log('This is the last floor');
            }
        },
        generateCrateLoot: function(rates){
            var rank = RL.Util.getRandomFromRate(rates);
            var pool = this.getItemOfRank(rank);
            return RL.Util.selectRandomElement(pool);
        },
        getItemOfRank: function(rank){
            var pool = [];
            for (const [key, value] of Object.entries(RL.Item.Types)) {
                if(value.rank == rank && value.group!='material' && value.group!='special')
                    pool.push(key);
            }
            return pool;
        },
        randomItemOfRank: function(rank){
            var pool = this.getItemOfRank(rank);
            return RL.Util.selectRandomElement(pool);
        },
    };
    
    RL.Util.merge(NewGame.prototype, proto);
    RL.Util.merge(NewGame.prototype, newGamePrototype);

    RL.Game = NewGame;

}());
