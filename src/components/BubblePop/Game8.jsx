import React, { useState, useEffect, useRef } from 'react';
import styles from './Game8.module.css';
import highSound from '../BubblePop/high.mp3';
import lowSound from '../BubblePop/low.mp3';
import medSound from '../BubblePop/med.mp3';

const BP = {
    ui: {
        progressElm: null,
        introElm: null,
        levelsElm: null,
        levelMsg: null,
        startBtn: null,
        canvas: null,
        canvasWrapper: null,
        size: function(canvas) {
            if (canvas) {
                 canvas.width = window.innerWidth;
                 canvas.height = window.innerHeight;
            }
        },
        loadSounds: function() {
            const sounds = {
                high: new Audio(highSound),
                med: new Audio(medSound),
                low: new Audio(lowSound)
            };
            Object.values(sounds).forEach(sound => {
                sound.volume = 0.25;
            });
            return sounds;
        },
        ctx: null,
        mouse: {
            x: undefined,
            y: undefined
        }
    },
    util: {
        fadeIn: function(elem, ms) {
            if (!elem) return;
            elem.style.opacity = 0;
            elem.style.filter = "alpha(opacity=0)";
            elem.style.display = "inline-block";
            elem.style.visibility = "visible";
            if (ms) {
                let opacity = 0;
                const timer = setInterval(function() {
                    opacity += 50 / ms;
                    if (opacity >= 1) {
                        clearInterval(timer);
                        opacity = 1;
                    }
                    elem.style.opacity = opacity;
                    elem.style.filter = `alpha(opacity=${opacity * 100})`;
                }, 50);
            } else {
                elem.style.opacity = 1;
                elem.style.filter = "alpha(opacity=1)";
            }
        },
        fadeOut: function(elem, ms) {
            if (!elem) return;
            if (ms) {
                let opacity = 1;
                const timer = setInterval(function() {
                    opacity -= 50 / ms;
                    if (opacity <= 0) {
                        clearInterval(timer);
                        opacity = 0;
                        elem.style.display = "none";
                        elem.style.visibility = "hidden";
                    }
                    elem.style.opacity = opacity;
                    elem.style.filter = `alpha(opacity=${opacity * 100})`;
                }, 50);
            } else {
                elem.style.opacity = 0;
                elem.style.filter = "alpha(opacity=0)";
                elem.style.display = "none";
                elem.style.visibility = "hidden";
            }
        },
        randomColorGen: function() {
            let r = Math.floor(Math.random() * 255) + 1;
            let g = Math.floor(Math.random() * 255) + 1;
            let b = Math.floor(Math.random() * 255) + 1;
            let color = `${r}, ${g}, ${b}`;
            return color;
        }
    },
    bubblesQueue: [],
    bubble: function(x, y, dx, dy, radius, colors) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.origRadius = radius;
        this.radius = radius;
        this.minRadius = radius;
        this.colors = colors;

        this.draw = function() {
            BP.ui.ctx.beginPath();
            BP.ui.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            BP.ui.ctx.fillStyle = colors;
            BP.ui.ctx.fill();
        };

        this.update = function() {
             if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }
            this.x += this.dx;
            this.y += this.dy;

            if (
                BP.ui.mouse.x - this.x < this.radius &&
                BP.ui.mouse.x - this.x > -this.radius &&
                BP.ui.mouse.y - this.y < this.radius &&
                BP.ui.mouse.y - this.y > -this.radius &&
                this.radius !== 0
            ) {
                this.radius += BP.gamePlay.bubbleExpansionRate;
                if (this.radius > BP.gamePlay.maxExpansion) {
                  this.destroy(this.origRadius);
                }
            } else if (this.radius > this.minRadius && this.radius !== 0) {
                 this.radius -= BP.gamePlay.bubbleExpansionRate;
                BP.ui.mouse.x = 0;
                BP.ui.mouse.y = 0;
            }
             this.draw();
        };

         this.destroy = function(origRadius) {
            BP.gamePlay.playSound(origRadius);
            this.radius = 0;
            this.x = -10;
            this.y = -10;
            this.dx = 0;
            this.dy = 0;
            BP.gamePlay.bubblesPoppedPerLevel += 1;
            BP.gamePlay.bubblesPoppedTotal += 1;

           BP.gamePlay.checkProgress();
        };
    },
    bubbleMultiplier: function() {
          this.bubblesQueue = [];
            let bubbleNums =
                this.gamePlay.bubbleQnty - BP.gamePlay.bubblesPoppedPerLevel;

            for (let i = 0; i < bubbleNums; i++) {
                let radius = Math.floor(Math.random() * BP.gamePlay.maxRadius) + 25;
                let x = Math.random() * (window.innerWidth - radius * 2) + radius;
                let y = Math.random() * (window.innerHeight - radius * 2) + radius;
                let dx = (Math.random() - 0.5) * BP.gamePlay.speed;
                let dy = (Math.random() - 0.5) * BP.gamePlay.speed;
                let a = Math.random() * (1 - 0.15) + 0.15;
                let colors = `rgba(${BP.util.randomColorGen()} , ${a})`;
                 const args = [x, y, dx, dy, radius, colors];
                  this.bubblesQueue.push(new BP.bubble(...args));
            }
    },
    animate: function() {
        requestAnimationFrame(BP.animate);
        BP.ui.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        BP.bubblesQueue.forEach(function(item, i) {
            BP.bubblesQueue[i].update();
        });
    },
     gamePlay: {
        level: 0,
        bubbleQnty: 50,
        bubblesPoppedPerLevel: 0,
        bubblesPoppedTotal: 0,
        bubbleExpansionRate: 5,
        speed: 8,
        maxRadius: 45,
        maxExpansion: 150,
       setMouseCoords: function(event) {
        BP.ui.mouse.x = event.clientX;
        BP.ui.mouse.y = event.clientY;
      },
        start: function() {
            BP.gamePlay.level = 1;
            BP.ui.canvasWrapper.addEventListener(
                "mousemove",
                function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                     BP.gamePlay.setMouseCoords(event);
                },
                false
            );

            BP.ui.canvasWrapper.addEventListener(
                "click",
                function(event) {
                     event.preventDefault();
                    event.stopPropagation();
                    BP.gamePlay.setMouseCoords(event);
                },
                false
            );
             BP.gamePlay.speed = 3;
            BP.gamePlay.bubbleQnty = 8;
            BP.ui.canvas.classList.add(styles.active);
            BP.util.fadeOut(BP.ui.introElm, 200);
            BP.bubbleMultiplier();
            BP.gamePlay.stopwatch.startTimer();
        },
        stopwatch: {
            startTime: null,
            endTime: null,
            duration: 0,
            startTimer: function() {
                this.startTime = new Date();
            },
            stopTimer: function() {
                this.endTime = new Date();
            },
            resetTimer: function() {
                this.startTime = null;
                this.endTime = null;
                this.duration = 0;
            },
            showDuration: function() {
                let time = (this.endTime.getTime() - this.startTime.getTime()) / 1000;
                const secs = parseInt(time, 10);
                let minutes = Math.floor(secs / 60);
                let seconds = secs - minutes * 60;
                let formatTime;
                if (minutes > 0) {
                    let onesPlace = seconds < 10 ? "0" : "";
                    formatTime = `${minutes}:${onesPlace}${seconds}!`;
                } else {
                    formatTime = `${seconds} seconds!`;
                }
                return formatTime;
            }
        },
        checkProgress: function() {
            if (this.bubblesPoppedPerLevel === this.bubbleQnty) {
                BP.gamePlay.stopwatch.stopTimer();
                BP.gamePlay.level += 1;
                BP.ui.canvas.classList.remove(styles.active);
                this.showHideLevelMsg();
            }
        },
        showHideLevelMsg: function() {
             BP.ui.progressElm.innerHTML = `${
                this.bubblesPoppedPerLevel
            } bubbles popped in ${BP.gamePlay.stopwatch.showDuration()}`;
             this.bubblesPoppedPerLevel = 0;
           BP.gamePlay.stopwatch.resetTimer();

            let color = `color:rgba(${BP.util.randomColorGen()} , 1)`;
            BP.ui.levelMsg.setAttribute("style", color);
             BP.ui.levelMsg.innerHTML = `Level ${BP.gamePlay.level}`;
            const delayShowProgress = setTimeout(() => {
                clearTimeout(delayShowProgress);
                BP.util.fadeIn(BP.ui.progressElm, 800);
                const delayHideProgress = setTimeout(() => {
                    clearTimeout(delayHideProgress);
                    BP.util.fadeOut(BP.ui.progressElm, 600);
                }, 4800);
            }, 200);

            const delayShowLevel = setTimeout(() => {
                clearTimeout(delayShowLevel);
                BP.util.fadeIn(BP.ui.levelsElm, 800);
                const delayHideLevel = setTimeout(() => {
                    clearTimeout(delayHideLevel);
                   BP.util.fadeOut(BP.ui.levelsElm, 600);
                   this.nextLevel();
                }, 3000);
            }, 2000);
        },
         nextLevel: function() {
            BP.gamePlay.speed += 0.5;
            BP.gamePlay.bubbleQnty += 5;
            if (BP.gamePlay.maxRadius + 15 < BP.gamePlay.maxExpansion) {
                BP.gamePlay.maxExpansion -= 5;
            }
              const delayShowNext = setTimeout(() => {
                clearTimeout(delayShowNext);
                BP.bubbleMultiplier();
                BP.ui.canvas.classList.add(styles.active);
                BP.gamePlay.stopwatch.startTimer();
            }, 800);
        },
        playSound: function(origRadius) {
            this.sound = null;
            if (origRadius <= 34) {
                this.sound = BP.ui.loadSounds().high;
            } else if (origRadius > 34 && origRadius <= 42) {
                this.sound = BP.ui.loadSounds().med;
            } else {
                this.sound = BP.ui.loadSounds().low;
            }
           this.sound.play();
        }
    },
     bind: function(startButton,canvasWrapper,canvas) {
        startButton.addEventListener("click", this.gamePlay.start);
         window.addEventListener("resize", function() {
             BP.ui.size(canvas);
            if (BP.gamePlay.bubblesPoppedPerLevel !== 0 || BP.gamePlay.level === 0) {
                BP.bubbleMultiplier();
            }
        });
    },
    init: function(canvasRef, progressRef, introRef, levelsRef) {
          BP.ui.progressElm = progressRef;
          BP.ui.introElm = introRef;
          BP.ui.levelsElm = levelsRef;
          BP.ui.levelMsg = levelsRef.firstElementChild;
          BP.ui.canvasWrapper = canvasRef.parentNode;
          BP.ui.startBtn = introRef.querySelector(`.${styles.start}`);
          BP.ui.canvas = canvasRef;
          BP.ui.ctx = canvasRef.getContext("2d")
          this.ui.size(canvasRef)
          this.ui.loadSounds();
          this.bubbleMultiplier();
          this.animate();
          this.bind(BP.ui.startBtn,BP.ui.canvasWrapper, BP.ui.canvas);
     }
};
const Game8 = () => {
    const canvasRef = useRef(null);
    const progressRef = useRef(null);
    const introRef = useRef(null);
    const levelsRef = useRef(null);
     useEffect(() => {
         BP.init(canvasRef.current,progressRef.current,introRef.current,levelsRef.current);
    }, []);

    return (
        <>
            <div className={styles.intro} ref={introRef}>
                <h1 className='bubble-heading'>Bubble Pop!</h1>
                <button className={styles.start}>Start</button>
            </div>
            <div className={`${styles.progress}`} ref={progressRef}></div>
            <div className={styles.levels} ref={levelsRef}>
                <h1></h1>
            </div>
            <div id='canvas-wrapper' >
                <canvas id="canvas" ref={canvasRef} width="800" height="400">
                    Sorry, your browser doesn't support Canvas.
                </canvas>
            </div>
        </>
    );
};

export default Game8;