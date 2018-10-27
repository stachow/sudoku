type options = {
    cells: number[][][];
    x: number[][];
    y: number[][];
    z: number[][];
}

export type sudoku = {
    values: number[][];
    options: options;
}

function getRange(start: number, n: number): number[] {
    return [...Array(n).keys()]
                .filter(i => i >= start);
}

function getBoxRanges(x: number, y: number): {xRange: number[], yRange: number[]} {
    let buildRange = (i: number) => {
        let start = i && 3 * Math.floor(i /3);
        return getRange(start, start + 2);
    }

    return {
        xRange: buildRange(x),
        yRange: buildRange(y)
    }
}

// function getOptions(values: number[][]):  options {
//     let getCellOptions = (x: number, y: number) => ([
//         ...values[x],
//         ...values.map(row => row[y])
//     ]);


//     let getZValues = (i: number) =>
// }

export function transpose(raw: number[]): sudoku  {
    let flatArray = raw.map(i => i || null);

    let dimensionLength = Math.sqrt(flatArray.length);
    let range = getRange(0, dimensionLength);
    let values = range
            .map(i => flatArray.slice(i * dimensionLength, (i + 1) * dimensionLength));

    return <sudoku>{
        values,
        options: null
    }
}
