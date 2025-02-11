import React, { useState, useEffect } from 'react';
import styles from './Game2.module.css';
import wordbg from '../assets/wordbg.jpg';

const words = ["PUZZLE", "GAME", "FUN", "WORD", "SEARCH", "FIND", "PLAY"];
const gridSize = 7;

const Game2 = () => {
    const [grid, setGrid] = useState([]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [foundWords, setFoundWords] = useState(new Set());
    const [isSelecting, setIsSelecting] = useState(false);
    const [foundCells, setFoundCells] = useState([]);
    
    useEffect(() => {
        generatePuzzle();
        playSound('./src/components/WordHuntPuzzle/welcome.mp3'); // Play welcome sound when the game starts
    }, []);

    const playSound = (soundType) => {
        let audio;
        if (soundType === 'drag') {
            // Play dragging sound
            audio = new Audio('./src/components/WordHuntPuzzle/bell.mp3');
        } else if (soundType === 'correct') {
            // Play correct word found sound
            audio = new Audio('./src/components/WordHuntPuzzle/right_high.mp3');
        } else if (soundType === 'wrong') {
            // Play incorrect selection sound
            audio = new Audio('./src/components/WordHuntPuzzle/fail.mp3');
        } else if (soundType === 'welcome') {
            // Play welcome sound at the start of the game
            audio = new Audio('./src/components/WordHuntPuzzle/welcome.mp3');
        } else if (soundType === 'success') {
            // Play success sound when game is completed
            audio = new Audio('./src/components/WordHuntPuzzle/drag.mp3');
        }

        if(audio) {
            audio.play();
        }
    };

    const generatePuzzle = () => {
        let newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(""));
        const usedWords = [];
        setFoundCells([]);
        setFoundWords(new Set());

        for (const word of words) {
            if (placeWord(word, newGrid)) {
                usedWords.push(word);
            }
        }

        newGrid = fillEmptyCells(newGrid);
        setGrid(newGrid);
    };

    const placeWord = (word, currentGrid) => {
        const directions = [
            [0, 1], [1, 0], [1, 1], [-1, 1],
            [0, -1], [-1, 0], [-1, -1], [1, -1]
        ];

        for (let attempt = 0; attempt < 50; attempt++) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const [startX, startY] = [
                Math.floor(Math.random() * gridSize),
                Math.floor(Math.random() * gridSize)
            ];

            if (canPlaceWord(word, startX, startY, direction, currentGrid)) {
                currentGrid = placeWordOnGrid(word, startX, startY, direction, currentGrid);
                return true;
            }
        }
        return false;
    };

    const canPlaceWord = (word, startX, startY, [dx, dy], currentGrid) => {
        if (
            startX + dx * (word.length - 1) < 0 ||
            startX + dx * (word.length - 1) >= gridSize ||
            startY + dy * (word.length - 1) < 0 ||
            startY + dy * (word.length - 1) >= gridSize
        ) {
            return false;
        }

        for (let i = 0; i < word.length; i++) {
            const [x, y] = [startX + dx * i, startY + dy * i];
            if (currentGrid[y][x] !== "" && currentGrid[y][x] !== word[i]) {
                return false;
            }
        }

        return true;
    };

    const placeWordOnGrid = (word, startX, startY, [dx, dy], currentGrid) => {
        for (let i = 0; i < word.length; i++) {
            const [x, y] = [startX + dx * i, startY + dy * i];
            currentGrid[y][x] = word[i];
        }
        return currentGrid;
    };

    const fillEmptyCells = (currentGrid) => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (currentGrid[y][x] === "") {
                    currentGrid[y][x] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }
        return currentGrid;
    };

    const startSelection = (e) => {
        setIsSelecting(true);
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);
        setSelectedCells([{ x, y }]);
        playSound('drag');
    };

    const updateSelection = (e) => {
        if (!isSelecting) return;
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);

        if (selectedCells.some(cell => cell.x === x && cell.y === y)) return;

        const lastCell = selectedCells[selectedCells.length - 1];
        if (Math.abs(x - lastCell.x) <= 1 && Math.abs(y - lastCell.y) <= 1) {
            setSelectedCells(prevCells => [...prevCells, { x, y }]);
            playSound('drag');
        }
    };

    const endSelection = () => {
        if (!isSelecting) return;
        setIsSelecting(false);

        const selectedWord = selectedCells.map(cell => grid[cell.y][cell.x]).join("");
        const reversedWord = selectedWord.split("").reverse().join("");

        if (words.includes(selectedWord) || words.includes(reversedWord)) {
            const wordToMark = words.includes(selectedWord) ? selectedWord : reversedWord;
            markWordAsFound(wordToMark);
            setFoundCells(prevFoundCells => [...prevFoundCells, ...selectedCells]);
            playSound('correct');
        } else {
            playSound('wrong');
        }

        setSelectedCells([]);
        checkGameCompletion();
    };

    const markWordAsFound = (word) => {
        setFoundWords(prevWords => new Set(prevWords.add(word)));
    };

    const checkGameCompletion = () => {
        if (foundWords.size === words.length) {
            playSound('success'); // Play success sound when all words are found
            alert("Congratulations! You found all the words!");
        }
    };

    return (
        <div className={styles.container} onMouseUp={endSelection}>
            <div 
                style={{
                    backgroundImage: `url(${wordbg})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1
                }}
            ></div>
            <h1 className={styles.title}>Modern 7x7 Word Puzzle Game</h1>
            <button className={styles.button} onClick={generatePuzzle}>New Puzzle</button>
            <div className={styles.puzzle}>
                {grid.map((row, y) =>
                    row.map((cellValue, x) => {
                        const isSelected = selectedCells.some(c => c.x === x && c.y === y);
                        const isFound = foundCells.some(c => c.x === x && c.y === y);
                        return (
                            <div
                                key={`${x}-${y}`}
                                className={`${styles.cell} ${isSelected ? styles.selected : ''} ${isFound ? styles.found : ''}`}
                                data-x={x}
                                data-y={y}
                                onMouseDown={startSelection}
                                onMouseOver={updateSelection}
                            >
                                {cellValue}
                            </div>
                        );
                    })
                )}
            </div>
            <div className={styles.words}>
                {words.map(word => (
                    <div key={word} className={`${styles.word} ${foundWords.has(word) ? styles.found : ''}`}>
                        {word}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Game2;
