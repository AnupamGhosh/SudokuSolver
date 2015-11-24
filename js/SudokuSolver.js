var N = 9;
var grid = new Array(N);
for (i = 0; i < N; i++) {
    grid[i] = new Array(N);
}
var fixed = new Array(N);
var row = new Array(N);
var col = new Array(N);
var box = new Array(N);

onmessage = function (msg) {
    //console.log("worker");
    for (var i = 0; i < N; i++) {
        row[i] = 1;
        col[i] = 1;
        box[i] = 1;
        fixed[i] = 0;
    }
    for (var r = 0; r < N; r++) {
        for (var c = 0; c < N; c++) {
            grid[r][c] = msg.data[r][c];
            if (grid[r][c] > 0) {
                var x = parseInt(r / 3) * 3 + parseInt(c / 3);
                if ((row[r] | col[c] | box[x]) & 1 << grid[r][c]) {
                    postMessage(null);
                    return;
                } else {
                    fixed[r] |= 1 << c;
                    row[r] |= 1 << grid[r][c];
                    col[c] |= 1 << grid[r][c];
                    box[x] |= 1 << grid[r][c];
                }
            }
        }
    }
    if (solution(0)) {
        //console.log(grid[0]);
        postMessage(grid);
    } else {
        //console.log("no solution");
        postMessage(null);
    }
}


function solution(r) {
    if (r == N) {
        return true;
    }
    var colBit = ~fixed[r] & fixed[r] + 1; // rightmost 0-bit
    var c = numberOfTrailingZeros(colBit);
    if (c == N) { // row completed
        return solution(r + 1);
    }
    fixed[r] |= colBit; // assuming colBit index as correct
    var x = parseInt(r / 3) * 3 + parseInt(c / 3);
    // iterating over remaining [1-9], i.e. 0-values
    for (var mask = row[r] | col[c] | box[x]; mask < (1 << N + 1) - 1; mask |= mask + 1) {
        var value = ~mask & mask + 1;
        grid[r][c] = numberOfTrailingZeros(value);
        row[r] |= value; // remembers row[r] contains value
        col[c] |= value; // sets the value bit
        box[x] |= value;
        if (solution(r)) {
            return true;
        }
        row[r] ^= value; // clears the value bit
        col[c] ^= value;
        box[x] ^= value;
    }
    fixed[r] ^= colBit;
    return false;
}

function numberOfTrailingZeros(v) {
    var c = 16;
    v &= -v;
    if (v) c--;
    if (v & 0x00FF00FF) c -= 8;
    if (v & 0x0F0F0F0F) c -= 4;
    if (v & 0x33333333) c -= 2;
    if (v & 0x55555555) c -= 1;
    return c;
}