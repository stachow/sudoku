export type sudoku = number[];

export type state = "Solved" | "Broken" | "Incomplete";

export type move = {
    pos: number,
    value: number
};

export type analysis = {
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
                                                                .map(n => curr + n)], <string[]>[]);

export function getAnalysis(sudoku: sudoku) {
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
            ...range1To9.reduce((prevValue, value) => {
                return [
                    ...prevValue,
                    {group, value,
                        availablePositions: cellsWithOptions
                                    .filter(cell => cell.groups.some(grp => grp === group)
                                                && cell.availableValues.some(opt => opt === value))
                                    .map(c => c.pos)}
                ]}, [])
        ]}, []);

    return <analysis>{
        cells: cellsWithOptions.map(cell => {
            const {groups, ...rest} = cell;
            return rest;
        }),
        groupOptions
    };
}

export function getNextSolidMoves(analysis: analysis) {
    const nextMovesViaCellOptions = analysis.cells
            .filter(cell => cell.availableValues.length === 1)
            .map(cell => ({pos: cell.pos, value: cell.availableValues[0]}));

    const nextMovesViaGroupOptions = analysis.groupOptions
            .filter(grp => grp.availablePositions.length === 1)
            .map(grp => ({pos: grp.availablePositions[0], value: grp.value}));

    const sortedUniqueMoves = [
        ...nextMovesViaCellOptions,
        ...nextMovesViaGroupOptions
        ].reduce((prev, curr) => prev.some(i => i.pos === curr.pos) ? prev : [...prev, curr],
            <{pos: number, value: number}[]>[])
        .sort((a, b) => a.pos - b.pos);

    return sortedUniqueMoves;
}

export function getNextTentativeMoves(analysis: analysis) {
    const nextMoveCell = analysis.cells
        .filter(c => !c.value)
        .sort((a, b) => a.availableValues.length - b.availableValues.length)[0];

    return nextMoveCell.availableValues.map(value => ({pos: nextMoveCell.pos, value}));
}

export function applyMoves(sudoku: sudoku, nextMoves: move[]) {
    return sudoku.map((value, index) => {
        const foundMove = nextMoves.find(move => move.pos === index);
        return foundMove ? foundMove.value : value;
    });
}

export function getState(analysis: analysis): state {
    return analysis.cells.every(cell => !!cell.value)
        ? "Solved"
        : analysis.cells.some(cell => !cell.value && !cell.availableValues.length)
            ? "Broken"
            : "Incomplete";
}


