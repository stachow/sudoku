declare module "sudoku" {
    export function makepuzzle(): number[];
    export function ratepuzzle(puzzle: number[], samples: number): number;
}