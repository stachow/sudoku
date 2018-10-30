import { sudoku, transpose}  from "./sudoku";

let logGrid = (s: sudoku) => {

    let getGridSeparator = (i: number /* 1 -based */) => {
        if (i === 81) {
            return "";
        } else if (i % 27 === 0) {
            return `\n${"-".repeat(11)}\n`
        } else if (i % 9 === 0) {
            return "\n"
        } else if (i % 3 === 0) {
            return "|"
        }
    };

    let grid = s.cells.reduce((prev, curr, index) => {
        return [
            ...prev,
            /* "(" + curr.pos + ")" + */(curr.value || "."),
            getGridSeparator(index + 1)
        ]
    }, []);

    let cells = s.cells.reduce((prev, curr) => {
        return [
            ...prev,
            `\n${curr.pos <= 9 ? " " : ""}${curr.pos}: ${curr.x}${curr.y}${curr.z}: `,
            ...curr.options,
        ]
    }, []);

    let groups = s.groupValuePositionOptions.x.reduce((groupPrev, groupCurr, groupIndex) => {
        return [
            ...groupPrev,

            groupCurr.reduce((valuePrev, valueCurr, valueIndex) => {
                return [
                    ...valuePrev,
                    `x${groupIndex}${valueIndex + 1}: ${valueCurr}`,
                    "\n"
                ]
            }, []).join(""),
        ]
    }, []);

    console.log([...grid, "\n", ...cells, "\n", ...[]].join(""));
    console.log(groups.join(""));
};

test("foo", () => {

    let input = [
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

    let soduku = transpose(input);
    logGrid(soduku);
    expect(soduku).toBeDefined();
});