var Grid = new Array(9);
for (var i = 0; i < 9; i++) {
    Grid[i] = new Array(9);
}
var badBox = "";

window.onload = function () {
    reset();
    document.getElementById("solve-btn").addEventListener("click", takeInput);
    document.getElementById("reset-btn").addEventListener("click", reset);
    document.getElementsByClassName("grid-container")[0].addEventListener("click", function () {
        $(badBox).popover('hide')
    });
    document.getElementsByClassName("no-sln")[0].addEventListener("click", function () {
        //console.log("in no-soln");
        $('.no-sln').removeClass("front");
        $('.no-sln').addClass("back");
    });
    //$('.grid-container:eq(0)').click(function () {
    //    console.log("hidden");
    //    $(badBox).popover('hide');
    //});
    //$('.no-soln:eq(0)').click(function () {
    //    console.log("in no-soln");
    //    $('.no-sln').removeClass("front");
    //    $('.no-sln').addClass("back");
    //});
}

function takeInput() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var boxId = "box" + i + j;
            var box = document.getElementById(boxId);
            if (!box.validity.valid) {
                badBox = '#' + boxId;
                $(badBox).popover({ content: "Number between 1-9", placement: "bottom" });
                $(badBox).popover('show')
                return;
            }
            Grid[i][j] = Number(box.value);
        }
    }
    if (window.Worker) {
        var solver = new Worker("js/SudokuSolver.js");
        solver.postMessage(Grid);
        solver.onmessage = function (msg) {
            var ans = msg.data;
            if (ans == null) {
                //console.log("No soln");
                $('.no-sln').removeClass("back");
                $('.no-sln').addClass("front");
                return;
            }
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    var boxId = "box" + i + j;
                    document.getElementById(boxId).disabled = true;
                    if (Grid[i][j] == 0) {
                        document.getElementById(boxId).style.color = "#cccccc";
                        document.getElementById(boxId).value = ans[i][j];
                    }
                }
            }
            solver.terminate();
        };
    } else {
        alert("Browser not supported");
    }
}

function reset() {
    $(badBox).popover('hide');
    $('.no-sln').removeClass("front");
    $('.no-sln').addClass("back");
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var boxId = "box" + i + j;
            document.getElementById(boxId).disabled = false;
            document.getElementById(boxId).style.color = "black";
            document.getElementById(boxId).value = "";
        }
    }
}