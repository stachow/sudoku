type cellValue = {
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
    groupOptions: {
        x: number[][],
        y: number[][],
        z: number[][]
    }
}

const range0To8 = [0, 1, 2, ,3, 4, 5, 6, 7, 8];
const range1To9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function getCellGroups (pos: number) {
    const x = pos % 9;
    const y = Math.floor(pos / 9);
    const z = [
        "00", "01", "02",
        "10", "11", "12",
        "20", "21", "22"
    ].indexOf(`${Math.floor(x / 3)}${Math.floor(y / 3)}`);

    return { x, y, z };
}

function rebuildCellOptions(inpCells: cellValue[]) {
    let unique = (arr: any[]) => [...new Set(arr)];
    let inFirstNotSecond = (inArr: any[], notInArr: any[]) => inArr.filter(i => !notInArr.some(j => i === j));

    let getCellUnusedValues = (cell: cellValue) => cell.value ? [] : unique(
        inFirstNotSecond(range1To9,
            [
                ...inpCells.filter(c => c.x === cell.x).map(c => c.value),
                ...inpCells.filter(c => c.y === cell.y).map(c => c.value),
                ...inpCells.filter(c => c.z === cell.z).map(c => c.value)
            ]
        )
    );

    return inpCells.map(inpCell => ({
        ...inpCell,
        options: getCellUnusedValues(inpCell)
    }));
}

function transpose(raw: number[]) {
    const cellsWithoutOptions = raw.map((value, index) => ({ ...getCellGroups(index), value }));
    const cells = rebuildCellOptions(cellsWithoutOptions);

    return <sudoku>{ cells }
}

export {
    sudoku,
    transpose
};