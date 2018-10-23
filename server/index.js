const sudoku = require("sudoku");
var http = require("http");

http.createServer((req, res) => {

    res.setHeader('Content-Type', 'application/json');

    const puzzle = sudoku.makepuzzle();

    res.write(JSON.stringify(puzzle));
    res.end();

}).listen(8080);