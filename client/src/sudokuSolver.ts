export type solution = {
    initial: number[];
    sudoku: number[];
    moves:  move[];
}

type move = {
    pos: number,
    value: number,
    moveType: "Solid" | "Tenatative";
};

type analysis = {
    state: "Solved" | "Broken" | "Incomplete",
    cells: {
        pos: number;
        value: number;
        availableValues: number[];
    }[],
    groupOptions: {
        group: string,
        value: number,
        availablePositions: number[]
    }[];
}

const allGroupNames = ["x", "y", "z"]
                        .reduce((prev, curr) => [...prev, ...[0, 1, 2, 3, 4, 5, 6, 7, 8]
                                                        .map(n => curr + n)],
                        <string[]>[]);

function getAnalysis(sudoku: number[]) {
    const inFirstNotSecond = <T>(firstArr: T[], secondArr: T[]) =>
        firstArr.filter(i => !secondArr.some(j => i === j));

    const range1To9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const cellsWithGroups = sudoku.map((value, pos) => ({
        pos,
        value,
        groups: [
            `x${pos % 9}`,
            `y${Math.floor(pos / 9)}`,
            `z${[
                "00", "10", "20",
                "01", "11", "21",
                "02", "12", "22"
            ].indexOf(`${Math.floor((pos % 9) / 3)}${Math.floor(pos / 27)}`)}`]
    }));

    const groupsCurrentValues = allGroupNames.reduce((prev, curr) => {
        return ({...prev, [curr]: cellsWithGroups
                .filter(c => c.groups.some(g => g === curr) && c.value)
                .map(c => c.value) });
    }, <{[key: string]: number[]}>{});

    const cellsWithOptions = cellsWithGroups.map(cell => ({
        ...cell,
        availableValues: cell.value
        ? []
        : inFirstNotSecond<number>(
            range1To9,
            cell.groups
                .reduce((prev, curr) => [
                    ...prev,
                    ...groupsCurrentValues[curr]
                ],[]))
    }));

    const groupOptions = allGroupNames.reduce((prevGroup, group) => {
        return [
            ...prevGroup,
            ...range1To9.reduce((prevValue, value) => [
                    ...prevValue,
                    {
                        group,
                        value,
                        availablePositions: cellsWithOptions
                            .filter(cell => cell.groups.some(grp => grp === group)
                                        && cell.availableValues.some(opt => opt === value))
                            .map(c => c.pos)}
                ], [])
        ]}, []);

    const state = cellsWithOptions.every(cell => !!cell.value)
            ? "Solved"
            : cellsWithOptions.some(cell => !cell.value && !cell.availableValues.length)
                ? "Broken"
                : "Incomplete";

    return <analysis>{
        state,
        cells: cellsWithOptions.map(cell => {
            const {groups, ...rest} = cell;
            return rest;
        }),
        groupOptions
    };
}

function getNextSolidMoves(analysis: analysis): move[] {
    const nextMovesViaCellOptions = analysis.cells
            .filter(cell => cell.availableValues.length === 1)
            .map(cell => ({pos: cell.pos, value: cell.availableValues[0]}));

    const nextMovesViaGroupOptions = analysis.groupOptions
            .filter(grp => grp.availablePositions.length === 1)
            .map(grp => ({pos: grp.availablePositions[0], value: grp.value}));

    return [
        ...nextMovesViaCellOptions,
        ...nextMovesViaGroupOptions
        ]
        .reduce((prev, curr) => prev.some(i => i.pos === curr.pos) ? prev : [...prev, curr],
            <{pos: number, value: number}[]>[])
        .map(move => (<move>{...move, moveType: "Solid"}));
}

function getNextLevelTentativeMoves(analysis: analysis) {
    // return the cell with the least available options
    const nextMoveCell = analysis.cells
        .filter(c => !c.value)
        .sort((a, b) => a.availableValues.length - b.availableValues.length)[0];

    return nextMoveCell.availableValues
            .map(value => (<move>{pos: nextMoveCell.pos, value, moveType: "Tenatative"}));
}

function applyMoves(solution: solution, moves: move[]) {
    return <solution>{
        initial: solution.initial,
        sudoku : solution.sudoku.map((value, index) => {
            const foundMove = moves.find(move => move.pos === index);
            return foundMove ? foundMove.value : value;
        }),
        moves: [
            ...solution.moves,
            ...moves
        ]
    };
}

export function solve(sudoku: number[]) {

    const applySimpleSolving = (solution: solution): solution => {
        const nextSolidMoves = getNextSolidMoves(getAnalysis(solution.sudoku));
        return nextSolidMoves.length
            ? applySimpleSolving(applyMoves(solution, nextSolidMoves))
            : solution;
    };

    const applyTentativeSolving = (preMoveSolution: solution): solution => {
        const simplySolvedSolution = applySimpleSolving(preMoveSolution);
        const analysis = getAnalysis(simplySolvedSolution.sudoku);

        if (analysis.state === "Solved") {
            return simplySolvedSolution;
        }

        if (analysis.state === "Broken") {
            return null;
        }

        const nextLevelTentativeMoves = getNextLevelTentativeMoves(analysis);
        for (let i = 0; i < nextLevelTentativeMoves.length; i++) {
            const tentativelySolved = applyMoves(simplySolvedSolution, [nextLevelTentativeMoves[i]]);
            const nextLevelSolvedSudoku = applyTentativeSolving(tentativelySolved);
            if (nextLevelSolvedSudoku) {
                return nextLevelSolvedSudoku;
            }
        }

        return null;
    }

    return applyTentativeSolving(<solution>{
        initial: sudoku,
        sudoku: [...sudoku],
        moves: <move[]>[]
    });
}


