type sudoku = number[];

type baseCell = {
    pos: number;
    groups: string[];
    value: number;
}

type cell = baseCell & {
    options: number[];
}

type analysis = {
    cells: cell[];
    groupOptions: {group: string, value: number, options: number[]}[];
}

const range1To9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const range0To8 = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const allGroupNames = ["x", "y", "z"]
                        .reduce((prev, curr) => [...prev, ...range0To8.map(n => curr + n)], <string[]>[]);

function getCellGroups (pos: number) {
    const x = pos % 9;
    const y = Math.floor(pos / 9);
    const z = [
        "00", "01", "02",
        "10", "11", "12",
        "20", "21", "22"
    ].indexOf(`${Math.floor(x / 3)}${Math.floor(y / 3)}`);

    return [`x${x}`, `y${y}`, `z${z}`];
}

function rebuildOptions(inCells: baseCell[]): analysis {
    const inFirstNotSecond = <T>(firstArr: T[], secondArr: T[]) => firstArr.filter(i => !secondArr.some(j => i === j));

    const groupsCurrentValues = allGroupNames.reduce((prev, curr) => {
        return ({...prev, [curr]: inCells.filter(c => c.groups.some(g => g === curr) && c.value).map(c => c.value) });
    }, <{[key: string]: number[]}>{});

    const getCellOptions = (cell: baseCell) => cell.value
            ? []
            : inFirstNotSecond<number>(range1To9, cell.groups.reduce((prev, curr) => [...prev, ...groupsCurrentValues[curr]],[]));

    const cells = inCells.map(inpCell => ({
        ...inpCell,
        options: getCellOptions(inpCell)
    }));

    const groupOptions = allGroupNames.reduce((prevGroup, group) => {
        return [
            ...prevGroup,
            ...range1To9.reduce((prevValue, value) => {
                return [
                    ...prevValue,
                    {group, value,
                        options: cells.filter(cell => cell.groups.some(grp => grp === group)
                                                && cell.options.some(opt => opt === value))
                                    .map(c => c.pos)}
                ]}, [])
        ]}, []);

    return {
        cells,
        groupOptions
    };
}

function getAnalysis(sudoku: sudoku) {
    const baseCells = sudoku.map((value, pos) => ({ pos, groups: getCellGroups(pos), value }));
    return rebuildOptions(baseCells);
}

function getNextMoves(analysis: analysis) {
    const nextMovesViaOnCellOptions = analysis.cells
            .filter(cell => cell.options.length === 1)
            .map(cell => ({pos: cell.pos, value: cell.options[0]}));

    const nextMovesViaGroupOptions = analysis.groupOptions
            .filter(grp => grp.options.length === 1)
            .map(grp => ({pos: grp.options[0], value: grp.value}));

    return [...new Set([
        ...nextMovesViaOnCellOptions,
        ...nextMovesViaGroupOptions
    ])];
}

function applyMoves(sudoku: sudoku, nextMoves: {pos: number, value: number}[]) {
    return sudoku.map((value, index) => {
        let foundMove = nextMoves.find(move => move.pos === index);
        return foundMove ? foundMove.value : value;
    });
}

export {
    analysis,
    getAnalysis,
    getNextMoves,
    applyMoves
};