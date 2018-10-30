import { sudoku, transpose}  from "./sudoku";

let logGrid = (s: sudoku) => {

    let output: (string | number)[] = [];

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

    output = s.cells.reduce((prev: string[], curr, index) => {
        return [
            ...prev,
            curr.value || ".",
            getGridSeparator(index + 1)
        ]
    }, output);

    output = s.cells.reduce((prev: string[], curr, index) => {
        return [
            ...prev,
            `\n${index} `,
            ...curr.options,
        ]
    }, output);

    console.log(output.join(""));


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

    let sudouku = transpose(input);
    logGrid(sudouku);
    expect(sudouku).toBeDefined();
});