import { makepuzzle } from "sudoku";
import { solve } from "./sudokuSolver";
import { ratepuzzle } from "sudoku";

let logGrid = (sudoku: number[]) => {

    let getGridSeparator = (i: number /* 1 -based */) => {
        if (i === 81) {
            return `   ${i - 1}`;
        } else if (i % 27 === 0) {
            return `   ${i - 1}\n${"-".repeat(17)}\n`
        } else if (i % 9 === 0) {
            return `   ${i - 1}\n`
        } else if (i % 3 === 0) {
            return "|"
        } else {
            return " "
        }
    };

    let grid = sudoku.reduce((prev, curr, index) => {
        return [
            ...prev,
            // "(" + index + ")",
            (curr || "."),
            getGridSeparator(index + 1)
        ]
    }, <number[]>[]);

    console.log(grid.join(""));
};

let hard =
`8,0,0,0,0,0,0,0,0,
0,0,3,6,0,0,0,0,0,
0,7,0,0,9,0,2,0,0,
0,5,0,0,0,7,0,0,0,
0,0,0,0,4,5,7,0,0,
0,0,0,1,0,0,0,3,0,
0,0,1,0,0,0,0,6,8,
0,0,8,5,0,0,0,1,0,
0,9,0,0,0,0,4,0,0`;

let sudoku = hard.split(",").map(i => parseInt(i, 10));
const solution = solve(sudoku);
logGrid(solution.sudoku);
console.log(solution.moves.filter(move => move.moveType === "Tenatative").length);

// for (let i = 0; i <= 1000; i++) {
//     let rawPuzzle = makepuzzle();
//     const solution = solve(rawPuzzle.map(i => i === null ? 0 : ++i));
//     console.log(solution.moves.filter(move => move.moveType === "Tenatative").length);
// }

