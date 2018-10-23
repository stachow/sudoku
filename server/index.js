const sudoku = require("sudoku");
const http = require("http");

http.createServer((req, res) => {

    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(sudoku.makepuzzle()));
    res.end();

}).listen(process.env.PORT || 5000);