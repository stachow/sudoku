type cellValue = {
    pos: number;
    x: number;
    y: number;
    z: number;
    value: number;
}

type cell = cellValue & {
    options: number[];
}

type sudoku = {
    cells: cell[];
    groupValuePositionOptions: {
        x: number[][][],
        y: number[][][],
        z: number[][][]
    }
}

const range1To9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const range0To8 = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function getCellIndices (pos: number) {
    const x = pos % 9;
    const y = Math.floor(pos / 9);
    const z = [
        "00", "01", "02",
        "10", "11", "12",
        "20", "21", "22"
    ].indexOf(`${Math.floor(x / 3)}${Math.floor(y / 3)}`);

    return { x, y, z };
}

function rebuildOptions(inpCells: cellValue[]): sudoku {
    let unique = (arr: any[]) => [...new Set(arr)];
    let inFirstNotSecond = (inArr: any[], notInArr: any[]) => inArr.filter(i => !notInArr.some(j => i === j));

    let getCellIndexPotentialValues = (accessor: (cell1: cellValue) => boolean) => inpCells.filter(accessor).map(c => c.value);

    let getCellPotentialValues = (cell: cellValue) => cell.value ? [] : unique(
        inFirstNotSecond(
            range1To9,
            [
                ...getCellIndexPotentialValues(inpCell => inpCell.x === cell.x),
                ...getCellIndexPotentialValues(inpCell => inpCell.y === cell.y),
                ...getCellIndexPotentialValues(inpCell => inpCell.z === cell.z)
            ]
        )
    );

    let cells = inpCells.map(inpCell => ({
        ...inpCell,
        options: getCellPotentialValues(inpCell)
    }));

    // for each group, for each value, which cells can it go in
    return {
        cells,
        groupValuePositionOptions: {
            x: range0To8.map(groupIndex => (range1To9.map(valueIndex => cells
                                                    .filter(cell => cell.x === groupIndex && cell.options.some(option => option === valueIndex))
                                                    .map(cell => cell.pos)))),
            y: [],
            z: []
        }
    };
}

function transpose(raw: number[]) {
    const cellsWithoutOptions = raw.map((value, pos) => ({ pos, ...getCellIndices(pos), value }));
    return rebuildOptions(cellsWithoutOptions);
}

export {
    sudoku,
    transpose
};