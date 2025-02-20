import React, { useEffect } from "react";
import k from "../InfiniteRunnerGame/kaplayCtx";
import disclaimer from "../InfiniteRunnerGame/scenes/disclaimer";
import mainMenu from "../InfiniteRunnerGame/scenes/mainMenu";
import game from "../InfiniteRunnerGame/scenes/game";
import gameover from "../InfiniteRunnerGame/scenes/gameover";
import Navbar from "./Navbar";

function Game1() {
  useEffect(() => {
    // Initialize Kaplay only when the component mounts
    k.width = 1920;
    k.height = 1080;
    k.letterbox = true;

    k.loadSprite("chemical-bg", "graphics/chemical-bg.png");
    k.loadSprite("platforms", "graphics/platforms.png");
    k.loadSprite("sonic", "graphics/sonic.png", {
      sliceX: 8,
      sliceY: 2,
      anims: {
        run: { from: 0, to: 7, loop: true, speed: 30 },
        jump: { from: 8, to: 15, loop: true, speed: 100 },
      },
    });
    k.loadSprite("ring", "graphics/ring.png", {
      sliceX: 16,
      sliceY: 1,
      anims: {
        spin: { from: 0, to: 15, loop: true, speed: 30 },
      },
    });
    k.loadSprite("motobug", "graphics/motobug.png", {
      sliceX: 5,
      sliceY: 1,
      anims: {
        run: { from: 0, to: 4, loop: true, speed: 8 },
      },
    });
    k.loadFont("mania", "fonts/mania.ttf");
    k.loadSound("destroy", "sounds/Destroy.wav");
    k.loadSound("hurt", "sounds/Hurt.wav");
    k.loadSound("hyper-ring", "sounds/HyperRing.wav");
    k.loadSound("jump", "sounds/Jump.wav");
    k.loadSound("ring", "sounds/Ring.wav");
    k.loadSound("city", "sounds/city.mp3");

    k.scene("disclaimer", disclaimer);
    k.scene("main-menu", mainMenu);
    k.scene("game", game);
    k.scene("gameover", gameover);

    k.go("disclaimer");

    return () => {
      // Clean up Kaplay when the component unmounts
      k.destroy();

    };
  }, []);

  return (
    <div>
      <Navbar/>
      <div id="game1"></div>
    </div>
  )
}

export default Game1;