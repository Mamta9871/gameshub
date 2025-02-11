import React, { useRef, useEffect, useState } from 'react';
import styles from './Game17.module.css';

const Game17 = () => {
  const canvasRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  let lastframe = 0;
  let fpstime = 0;
  let framecount = 0;
  let fps = 0;
  let level = {
        x: 4,           // X position
        y: 83,          // Y position
        width: 0,       // Width, gets calculated
        height: 0,      // Height, gets calculated
        columns: 15,    // Number of tile columns
        rows: 14,       // Number of tile rows
        tilewidth: 40,  // Visual width of a tile
        tileheight: 40, // Visual height of a tile
        rowheight: 34,  // Height of a row
        radius: 20,     // Bubble collision radius
        tiles: []       // The two-dimensional tile array
    };
    let player = {
        x: 0,
        y: 0,
        angle: 0,
        tiletype: 0,
        bubble: {
                    x: 0,
                    y: 0,
                    angle: 0,
                    speed: 1000,
                    dropspeed: 900,
                    tiletype: 0,
                    visible: false
                },
        nextbubble: {
                        x: 0,
                        y: 0,
                        tiletype: 0
                    }
    };

  let neighborsoffsets = [[[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]], // Even row tiles
                            [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]];
  let bubblecolors = 7;
  let gamestates = { init: 0, ready: 1, shootbubble: 2, removecluster: 3, gameover: 4 };
  let gamestate = gamestates.init;
  let score = 0;
  let turncounter = 0;
  let rowoffset = 0;
  let animationstate = 0;
  let animationtime = 0;
  let showcluster = false;
  let cluster = [];
  let floatingclusters = [];
  let images = [];
  let bubbleimage;
  let loadcount = 0;
  let loadtotal = 0;
  let preloaded = false;

  const Tile = function(x, y, type, shift) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.removed = false;
        this.shift = shift;
        this.velocity = 0;
        this.alpha = 1;
        this.processed = false;
    };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
      
    const loadImages = (imagefiles) => {
        // Initialize variables
        loadcount = 0;
        loadtotal = imagefiles.length;
        preloaded = false;
        // Load the images
        const loadedimages = [];
        for (let i = 0; i < imagefiles.length; i++) {
            const image = new Image();
            image.onload = function () {
                loadcount++;
                if (loadcount === loadtotal) {
                    preloaded = true;
                }
            };
            image.src = imagefiles[i];
            loadedimages[i] = image;
        }
        return loadedimages;
    }
    const init = () => {
    
      images = loadImages(["https://github.com/NCristina/Bubble-shooter-game/blob/master/bubble-sprites3.png?raw=true"]);
      bubbleimage = images[0];
        
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mousedown", onMouseDown);

        for (let i = 0; i < level.columns; i++) {
            level.tiles[i] = [];
            for (let j = 0; j < level.rows; j++) {
                level.tiles[i][j] = new Tile(i, j, 0, 0);
            }
        }

        level.width = level.columns * level.tilewidth + level.tilewidth/2;
        level.height = (level.rows-1) * level.rowheight + level.tileheight;

        player.x = level.x + level.width/2 - level.tilewidth/2;
        player.y = level.y + level.height;
        player.angle = 90;
        player.tiletype = 0;

        player.nextbubble.x = player.x - 2 * level.tilewidth;
        player.nextbubble.y = player.y;

      newGame();
      main(0);
    };

    const main = (tframe) => {
        window.requestAnimationFrame(main);

        if (!initialized) {
             context.clearRect(0, 0, canvas.width, canvas.height);

            drawFrame(context);

             const loadpercentage = loadcount/loadtotal;
            context.strokeStyle = "#56c204";
            context.lineWidth=3;
            context.strokeRect(18.5, 0.5 + canvas.height - 51, canvas.width-37, 32);
            context.fillStyle = "#56c204";
            context.fillRect(18.5, 0.5 + canvas.height - 51, loadpercentage*(canvas.width-37), 32);

            const loadtext = "Loaded " + loadcount + "/" + loadtotal + " images";
            context.fillStyle = "#000000";
            context.font = "16px Verdana";
            context.fillText(loadtext, 18, 0.5 + canvas.height - 63);

            if (preloaded) {
                setTimeout(() => {
                    setInitialized(true);
                }, 1000);
            }
        } else {
            update(tframe, context);
            render(context,canvas);
        }
    }

    const update = (tframe,context) => {
      const dt = (tframe - lastframe) / 1000;
      lastframe = tframe;

      updateFps(dt);

      if (gamestate === gamestates.ready) {
      } else if (gamestate === gamestates.shootbubble) {
          stateShootBubble(dt, context);
      } else if (gamestate === gamestates.removecluster) {
          stateRemoveCluster(dt, context);
      }
  };
    const setGameState = (newgamestate) => {
        gamestate = newgamestate;
        animationstate = 0;
        animationtime = 0;
    }
    const stateShootBubble = (dt, context) => {
    player.bubble.x += dt * player.bubble.speed * Math.cos(degToRad(player.bubble.angle));
        player.bubble.y += dt * player.bubble.speed * -1*Math.sin(degToRad(player.bubble.angle));

        if (player.bubble.x <= level.x) {
            player.bubble.angle = 180 - player.bubble.angle;
            player.bubble.x = level.x;
        } else if (player.bubble.x + level.tilewidth >= level.x + level.width) {
            player.bubble.angle = 180 - player.bubble.angle;
            player.bubble.x = level.x + level.width - level.tilewidth;
        }
        if (player.bubble.y <= level.y) {
            player.bubble.y = level.y;
            snapBubble(context);
            return;
        }

    for (let i=0; i<level.columns; i++) {
      for (let j=0; j<level.rows; j++) {
        const tile = level.tiles[i][j];
        if (tile.type < 0) {
          continue;
        }
        const coord = getTileCoordinate(i, j);
        if (circleIntersection(player.bubble.x + level.tilewidth/2,
              player.bubble.y + level.tileheight/2,
              level.radius,
              coord.tilex + level.tilewidth/2,
              coord.tiley + level.tileheight/2,
              level.radius)) {

          snapBubble(context);
          return;
        }
      }
    }
  }
  const stateRemoveCluster = (dt, context) => {
    if (animationstate === 0) {
        resetRemoved();
        for (let i=0; i<cluster.length; i++) {
           cluster[i].removed = true;
        }
        score += cluster.length * 100;
        floatingclusters = findFloatingClusters();

            if (floatingclusters.length > 0) {
                for (let i=0; i<floatingclusters.length; i++) {
                    for (let j=0; j<floatingclusters[i].length; j++) {
                        const tile = floatingclusters[i][j];
                        tile.shift = 0;
                        tile.shift = 1;
                        tile.velocity = player.bubble.dropspeed;

                        score += 100;
                    }
                }
            }

        animationstate = 1;
    }
      if (animationstate === 1) {
        let tilesleft = false;
          for (let i=0; i<cluster.length; i++) {
              const tile = cluster[i];
              if (tile.type >= 0) {
                  tilesleft = true;
                  tile.alpha -= dt * 15;
                    if (tile.alpha < 0) {
                        tile.alpha = 0;
                    }

                    if (tile.alpha === 0) {
                        tile.type = -1;
                        tile.alpha = 1;
                    }
              }
          }

    for (let i=0; i<floatingclusters.length; i++) {
      for (let j=0; j<floatingclusters[i].length; j++) {
        const tile = floatingclusters[i][j];
        if (tile.type >= 0) {
            tilesleft = true;
            tile.velocity += dt * 700;
            tile.shift += dt * tile.velocity;
          tile.alpha -= dt * 8;
            if (tile.alpha < 0) {
              tile.alpha = 0;
            }
            if (tile.alpha === 0 || (tile.y * level.rowheight + tile.shift > (level.rows - 1) * level.rowheight + level.tileheight)) {
                tile.type = -1;
                tile.shift = 0;
                tile.alpha = 1;
            }
        }
      }
    }
      if (!tilesleft) {
            nextBubble();

             let tilefound = false
            for (let i=0; i<level.columns; i++) {
                for (let j=0; j<level.rows; j++) {
                    if (level.tiles[i][j].type !== -1) {
                        tilefound = true;
                        break;
                    }
                }
            }

        if (tilefound) {
            setGameState(gamestates.ready);
        } else {
            setGameState(gamestates.gameover);
        }
      }
    }
  }

    const snapBubble = (context) => {
        const centerx = player.bubble.x + level.tilewidth/2;
        const centery = player.bubble.y + level.tileheight/2;
        let gridpos = getGridPosition(centerx, centery);

         if (gridpos.x < 0) {
            gridpos.x = 0;
        }
        if (gridpos.x >= level.columns) {
            gridpos.x = level.columns - 1;
        }
        if (gridpos.y < 0) {
            gridpos.y = 0;
        }
        if (gridpos.y >= level.rows) {
            gridpos.y = level.rows - 1;
        }
        let addtile = false;
        if (level.tiles[gridpos.x][gridpos.y].type !== -1) {
            for (let newrow=gridpos.y+1; newrow<level.rows; newrow++) {
                if (level.tiles[gridpos.x][newrow].type === -1) {
                    gridpos.y = newrow;
                    addtile = true;
                    break;
                }
            }
        } else {
            addtile = true;
        }

        if (addtile) {
            player.bubble.visible = false;
            level.tiles[gridpos.x][gridpos.y].type = player.bubble.tiletype;
              if (checkGameOver()) {
                  return;
              }

              cluster = findCluster(gridpos.x, gridpos.y, true, true, false);
              if (cluster.length >= 3) {
                  setGameState(gamestates.removecluster);
                  return;
              }
        }
        turncounter++;
        if (turncounter >= 5) {
            addBubbles();
            turncounter = 0;
            rowoffset = (rowoffset + 1) % 2;

            if (checkGameOver()) {
                return;
            }
        }
        nextBubble();
        setGameState(gamestates.ready);
    };
    const checkGameOver = () => {
      for (let i=0; i<level.columns; i++) {
            if (level.tiles[i][level.rows-1].type !== -1) {
                nextBubble();
                setGameState(gamestates.gameover);
                return true;
            }
        }
        return false;
    }
    const addBubbles = () => {
      for (let i=0; i<level.columns; i++) {
          for (let j=0; j<level.rows-1; j++) {
             level.tiles[i][level.rows-1-j].type = level.tiles[i][level.rows-1-j-1].type;
          }
      }

      for (let i=0; i<level.columns; i++) {
          level.tiles[i][0].type = getExistingColor();
      }
    }
    const findColors = () => {
      const foundcolors = [];
      const colortable = [];
      for (let i=0; i<bubblecolors; i++) {
        colortable.push(false);
      }
      for (let i=0; i<level.columns; i++) {
          for (let j=0; j<level.rows; j++) {
              const tile = level.tiles[i][j];
              if (tile.type >= 0) {
                  if (!colortable[tile.type]) {
                      colortable[tile.type] = true;
                      foundcolors.push(tile.type);
                  }
              }
          }
      }
      return foundcolors;
    }
    const findCluster = (tx, ty, matchtype, reset, skipremoved) => {
      if (reset) {
        resetProcessed();
      }
      const targettile = level.tiles[tx][ty];
      const toprocess = [targettile];
      targettile.processed = true;
        const foundcluster = [];
        while (toprocess.length > 0) {
            const currenttile = toprocess.pop();
          if (currenttile.type === -1) {
                continue;
            }
            if (skipremoved && currenttile.removed) {
                continue;
            }
            if (!matchtype || (currenttile.type === targettile.type)) {
                foundcluster.push(currenttile);
                const neighbors = getNeighbors(currenttile);
                for (let i=0; i<neighbors.length; i++) {
                    if (!neighbors[i].processed) {
                        toprocess.push(neighbors[i]);
                        neighbors[i].processed = true;
                    }
                }
            }
        }
        return foundcluster;
    }
    const findFloatingClusters = () => {
      resetProcessed();
        const foundclusters = [];
        for (let i=0; i<level.columns; i++) {
            for (let j=0; j<level.rows; j++) {
                const tile = level.tiles[i][j];
                if (!tile.processed) {
                  const foundcluster = findCluster(i, j, false, false, true);
                  if (foundcluster.length <= 0) {
                    continue;
                  }
                  let floating = true;
                    for (let k=0; k<foundcluster.length; k++) {
                        if (foundcluster[k].y === 0) {
                          floating = false;
                            break;
                        }
                    }
                  if (floating) {
                        foundclusters.push(foundcluster);
                    }
                }
            }
        }
        return foundclusters;
    }
    const resetProcessed = () => {
        for (let i=0; i<level.columns; i++) {
            for (let j=0; j<level.rows; j++) {
                level.tiles[i][j].processed = false;
            }
        }
    }
    const resetRemoved = () => {
        for (let i=0; i<level.columns; i++) {
            for (let j=0; j<level.rows; j++) {
                level.tiles[i][j].removed = false;
            }
        }
    }
    const getNeighbors = (tile) => {
      const tilerow = (tile.y + rowoffset) % 2;
        const neighbors = [];
      const n = neighborsoffsets[tilerow];
        for (let i=0; i<n.length; i++) {
            const nx = tile.x + n[i][0];
            const ny = tile.y + n[i][1];
            if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {
              neighbors.push(level.tiles[nx][ny]);
            }
        }
        return neighbors;
    }
    const updateFps = (dt) => {
      if (fpstime > 0.25) {
        fps = Math.round(framecount / fpstime);
        fpstime = 0;
        framecount = 0;
      }
      fpstime += dt;
      framecount++;
    };
    const drawCenterText = (context, text, x, y, width) => {
      const textdim = context.measureText(text);
      context.fillText(text, x + (width-textdim.width)/2, y);
    }
    const render = (context,canvas) => {
        drawFrame(context);

        const yoffset =  level.tileheight/2;

        context.fillStyle = "#dbdbdb";
        context.fillRect(level.x - 4, level.y - 4, level.width + 8, level.height + 4 - yoffset);

        renderTiles(context);
         context.fillStyle = "#c4c4c4";
        context.fillRect(level.x - 4, level.y - 4 + level.height + 4 - yoffset, level.width + 8, 2*level.tileheight + 3);

         context.fillStyle = "#ffffff";
        context.font = "18px Verdana";
        const scorex = level.x + level.width - 150;
        const scorey = level.y+level.height + level.tileheight - yoffset - 8;
        drawCenterText(context, "Score:", scorex, scorey, 150);
        context.font = "24px Verdana";
        drawCenterText(context, score, scorex, scorey+30, 150);

        if (showcluster) {
            renderCluster(context, cluster, 255, 128, 128);
            for (let i=0; i<floatingclusters.length; i++) {
              const col = Math.floor(100 + 100 * i / floatingclusters.length);
              renderCluster(context, floatingclusters[i], col, col, col);
            }
        }
        renderPlayer(context);

        if (gamestate === gamestates.gameover) {
             context.fillStyle = "rgba(0, 0, 0, 0.8)";
            context.fillRect(level.x - 4, level.y - 4, level.width + 8, level.height + 2 * level.tileheight + 8 - yoffset);

             context.fillStyle = "#ffffff";
            context.font = "24px Verdana";
            drawCenterText(context, "Game Over!", level.x, level.y + level.height / 2 + 10, level.width);
            drawCenterText(context, "Click to start", level.x, level.y + level.height / 2 + 40, level.width);
        }
    }
     const drawFrame = (context) => {
         context.fillStyle = "#e8eaec";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#01121c";
        context.fillRect(0, 0, canvas.width, 79);
         context.fillStyle = "#ffffff";
        context.font = "24px Verdana";
         context.fillText("Bubble Shooter", 10, 37);
        context.fillStyle = "#ffffff";
         context.font = "12px Verdana";
        context.fillText("Fps: " + fps, 13, 57);
    }
     const renderTiles = (context) => {
        for (let j=0; j<level.rows; j++) {
            for (let i=0; i<level.columns; i++) {
                const tile = level.tiles[i][j];
                const shift = tile.shift;
                const coord = getTileCoordinate(i, j);

                if (tile.type >= 0) {
                    context.save();
                    context.globalAlpha = tile.alpha;
                  drawBubble(context, coord.tilex, coord.tiley + shift, tile.type);
                    context.restore();
                }
            }
        }
    }
     const renderCluster = (context,cluster, r, g, b) => {
      for (let i=0; i<cluster.length; i++) {
          const coord = getTileCoordinate(cluster[i].x, cluster[i].y);
        context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          context.fillRect(coord.tilex+level.tilewidth/4, coord.tiley+level.tileheight/4, level.tilewidth/2, level.tileheight/2);
      }
    }
    const renderPlayer = (context) => {
        const centerx = player.x + level.tilewidth/2;
      const centery = player.y + level.tileheight/2;
        context.fillStyle = "#7a7a7a";
        context.beginPath();
        context.arc(centerx, centery, level.radius+12, 0, 2*Math.PI, false);
        context.fill();
        context.lineWidth = 2;
         context.strokeStyle = "#8c8c8c";
        context.stroke();

        context.lineWidth = 2;
        context.strokeStyle = "#000033";
        context.beginPath();
        context.moveTo(centerx, centery);
        context.lineTo(centerx + 1.5*level.tilewidth * Math.cos(degToRad(player.angle)), centery - 1.5*level.tileheight * Math.sin(degToRad(player.angle)));
        context.stroke();
      drawBubble(context, player.nextbubble.x, player.nextbubble.y, player.nextbubble.tiletype);
      if (player.bubble.visible) {
        drawBubble(context, player.bubble.x, player.bubble.y, player.bubble.tiletype);
      }
    }
    const getTileCoordinate = (column, row) => {
        let tilex = level.x + column * level.tilewidth;
        if ((row + rowoffset) % 2) {
          tilex += level.tilewidth/2;
        }
      const tiley = level.y + row * level.rowheight;
      return { tilex: tilex, tiley: tiley };
    }
    const getGridPosition = (x, y) => {
      let gridy = Math.floor((y - level.y) / level.rowheight);
      let xoffset = 0;
        if ((gridy + rowoffset) % 2) {
            xoffset = level.tilewidth / 2;
        }
        const gridx = Math.floor(((x - xoffset) - level.x) / level.tilewidth);
        return { x: gridx, y: gridy };
    }
    const drawBubble = (context,x, y, index) => {
       if (index < 0 || index >= bubblecolors)
            return;
      context.drawImage(bubbleimage, index * 40, 0, 40, 40, x, y, level.tilewidth, level.tileheight);
    }
      const newGame = () => {
        score = 0;
        turncounter = 0;
        rowoffset = 0;
        setGameState(gamestates.ready);
        createLevel();
        nextBubble();
        nextBubble();
    }
     const createLevel = () => {
      for (let j=0; j<level.rows; j++) {
            let randomtile = randRange(0, bubblecolors-1);
          let count = 0;
          for (let i=0; i<level.columns; i++) {
              if (count >= 2) {
                let newtile = randRange(0, bubblecolors-1);
                if (newtile === randomtile) {
                      newtile = (newtile + 1) % bubblecolors;
                }
                randomtile = newtile;
                  count = 0;
              }
                count++;
                if (j < level.rows/2) {
                  level.tiles[i][j].type = randomtile;
                } else {
                    level.tiles[i][j].type = -1;
                }
            }
        }
    }
    const nextBubble = () => {
      player.tiletype = player.nextbubble.tiletype;
      player.bubble.tiletype = player.nextbubble.tiletype;
        player.bubble.x = player.x;
      player.bubble.y = player.y;
        player.bubble.visible = true;
      const nextcolor = getExistingColor();
      player.nextbubble.tiletype = nextcolor;
    }
     const getExistingColor = () => {
        const existingcolors = findColors();
        let bubbletype = 0;
        if (existingcolors.length > 0) {
          bubbletype = existingcolors[randRange(0, existingcolors.length-1)];
        }
        return bubbletype;
    }
    const randRange = (low, high) => {
        return Math.floor(low + Math.random()*(high-low+1));
    }
    const shootBubble = () => {
        player.bubble.x = player.x;
        player.bubble.y = player.y;
        player.bubble.angle = player.angle;
        player.bubble.tiletype = player.tiletype;
        setGameState(gamestates.shootbubble);
    }
    const circleIntersection = (x1, y1, r1, x2, y2, r2) => {
        const dx = x1 - x2;
        const dy = y1 - y2;
      const len = Math.sqrt(dx * dx + dy * dy);
        if (len < r1 + r2) {
          return true;
        }
      return false;
    }
    const radToDeg = (angle) => {
      return angle * (180 / Math.PI);
    }
    const degToRad = (angle) => {
        return angle * (Math.PI / 180);
    }
    const onMouseMove = (e) => {
       const pos = getMousePos(canvas, e);
        let mouseangle = radToDeg(Math.atan2((player.y+level.tileheight/2) - pos.y, pos.x - (player.x+level.tilewidth/2)));
          if (mouseangle < 0) {
            mouseangle = 180 + (180 + mouseangle);
        }
        const lbound = 8;
        const ubound = 172;
       if (mouseangle > 90 && mouseangle < 270) {
            if (mouseangle > ubound) {
                mouseangle = ubound;
            }
        } else {
            if (mouseangle < lbound || mouseangle >= 270) {
                mouseangle = lbound;
            }
        }
        player.angle = mouseangle;
    }
     const onMouseDown = (e) => {
        if (gamestate === gamestates.ready) {
          shootBubble();
      } else if (gamestate === gamestates.gameover) {
        newGame();
      }
    }
     const getMousePos = (canvas, e) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }

    init();

    // Cleanup function (optional but good practice)
    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mousedown', onMouseDown);
      }
    }
  }, []); // Empty dependency array ensures this runs once after the initial render

  return (
    <div >
      <canvas id="game17canvas" ref={canvasRef} className={styles.game17canvas} width="628" height="628" />
    </div>
  );
};

export default Game17;