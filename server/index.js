const sudoku = require("sudoku");
const http = require("http");

http.createServer((_, res) => {
    let puzzle = sudoku.makepuzzle()
                    .map(i => i === null ? 0 : ++i);

    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(puzzle));
    res.end();

}).listen(process.env.PORT || 5000);