import { analysis, getAnalysis, getNextSolidMoves, applyMoves, getNextTentativeMoves, sudoku, getState, move } from "./sudoku";

let logGrid = (sudoku: sudoku) => {

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
    }, []);

    console.log(grid.join(""));
};

let logAnalysis = (analysis: analysis) => {
    console.log(analysis.cells.filter(cell => cell.availableValues.length));
    console.log(analysis.groupOptions.filter(cell => cell.availablePositions.length));
}

test("solve rig", () => {

    let inputSudoku = [
        9,0,7,  0,0,3,  5,0,0,
        0,0,0,  0,0,0,  7,1,2,
        0,0,0,  0,0,5,  0,0,4,

        7,9,0,  0,2,0,  0,0,0,
        0,1,5,  0,0,0,  0,0,0,
        2,0,0,  1,0,0,  0,0,0,

        0,8,0,  7,0,0,  3,0,0,
        0,0,4,  0,6,0,  0,0,1,
        0,2,0,  0,3,0,  0,0,8
    ];

    const solve = (sudoku: sudoku):  sudoku => {

        const applySimpleSolving = (sudoku: sudoku): sudoku => {
            // logGrid(sudoku);
            const analysis = getAnalysis(sudoku);
            const nextSolidMoves = getNextSolidMoves(analysis);
            return nextSolidMoves.length
                ? applySimpleSolving(applyMoves(sudoku, nextSolidMoves))
                : sudoku;
        };

        const applyTentativeSolving = (sudoku: sudoku, nextMoves: move[], alternateMoves: move[]): sudoku => {
            console.log(nextMoves, alternateMoves);
            const appliedMoveSudoku = applySimpleSolving(applyMoves(sudoku, nextMoves));
            const appliedMoveAnalysis = getAnalysis(appliedMoveSudoku);
            const appliedMoveState = getState(appliedMoveAnalysis);

            if (appliedMoveState === "Solved") {
                return appliedMoveSudoku;
            } else if (appliedMoveState === "Broken") {
                const [candidateNextMove, ...candidateAlternateMoves] = alternateMoves;
                return applyTentativeSolving(sudoku, [candidateNextMove], candidateAlternateMoves);
            } else if (appliedMoveState === "Incomplete") {
                const [candidateNextMove, ...candidateAlternateMoves] = getNextTentativeMoves(appliedMoveAnalysis);
                return applyTentativeSolving(appliedMoveSudoku, [candidateNextMove], candidateAlternateMoves);
            }
        }

        return applyTentativeSolving(sudoku, [], []);
    }

    const finalSudoku = solve(inputSudoku);
    logGrid(finalSudoku);

    expect(finalSudoku).toBeDefined();
});