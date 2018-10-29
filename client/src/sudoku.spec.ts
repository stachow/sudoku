import * as sudoku from "./sudoku";

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

    let result = sudoku.transpose(input);
    expect(result).toBeDefined();
});