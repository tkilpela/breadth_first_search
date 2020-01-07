var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.scale(2,2);
var grid = [
['*', '*', '*' ,'*' ,'*' , '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
['*', ' ', ' ' ,' ' ,' ' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', '*' ,'*' ,'*' , ' ', ' ', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', ' ', ' ' ,'*' ,'*' , ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*'],
['*', '*', '*' ,'*' ,'*' , '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*']];

var start = [1, 5];
var finish = [9, 8];

grid[start[1]][start[0]] = 's';
grid[finish[0]][finish[1]] = 'f';

var walls = [];

var mousePosition = [];

/*
function heuristic(a, b){
    start[0], finish[0] = a;
    start[1], finish[1] = b;
    return Math.abs(start[0] - finish[0]) + abs(start[1] - finish[1])
}

function A_star(start, finish, heuristic){
    openSet = [start]

    cameFrom = new Map();

    gScore = new Map();
    gScore.set(start, 0);

    fScore = new Map();
    fScore.set(start, heuristic(start))

    while (openSet === undefined || openSet.length > 1){
        var current = Math.min(...openSet);
        if (current == finish) return reconstruct_path(cameFrom, current);
    }
}
*/

function drawCube(i, j, fill){
    ctx.beginPath();
    ctx.rect(i*40, j*40, 40, 40);
    if(fill == true){
        ctx.fillStyle = '#808080'
        ctx.fill();
    }
    else ctx.stroke();
}

function drawDot(x, y){
    ctx.beginPath();
    ctx.arc((x*40)+20, (y*40)+20, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF0000';
    ctx.fill();
}

function drawFinish(x, y){
    ctx.beginPath();
    ctx.arc((x*40)+20, (y*40)+20, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#0000FF';
    ctx.fill();
}

function drawFoundTile(x, y, distance){
    ctx.beginPath();
    //ctx.arc((x*40)+20, (y*40)+20, 2.5, 0, 2 * Math.PI);
    //ctx.fillStyle = '#FF0000';
    //ctx.fill();
    ctx.font = "15px Arial"
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillText(distance, (x*40)+2.5, (y*40)+14.5);
}

function onClick(event){
    var mouseX = (event.clientX - (c.offsetLeft - c.scrollLeft)) - 2;
    var mouseY = (event.clientY - (c.offsetTop - c.scrollTop)) - 2;
    console.log(Math.floor(mouseX/2) + ", " + Math.floor(mouseY/2));
    Math.floor(mouseX/2), Math.floor(mouseY/2)
}

function compareArrays(x, y){
    var i = JSON.stringify(x);
    var j = JSON.stringify(y);

    if(i == j) return true;
    else return false;
}

for(var i = 0; i < 16; i++){
    for(var j = 0; j < 12; j++){
        if(grid[j][i] == '*'){
            drawCube(i, j, true);
            walls.push([i, j]);
        }
        else{
            if(grid[j][i] == 's'){
                drawCube(i, j, false);
                drawDot(i, j);
            }
            else drawCube(i, j, false);
        }
    }
}

class Grid{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.boundaries = []
    }
    neighbors(id){
        var [x, y] = id;
        var results = [[x+1, y], [x, y-1], [x-1, y], [x, y+1]];
        var json = this.boundaries.map(JSON.stringify);
        results = results.filter(result => {
            [x, y] = result;
            return (0 < x && x < this.width-1) && (0 < y && y < this.height-1);
        });
        results = results.filter(result => {
            var search = JSON.stringify(result);
            return !json.includes(search);
        });
        
        return results;
    }
}

g = new Grid(16, 12);
g.boundaries = walls;

function breadth_first_search(grid, start, finish){
    var queue = [];
    queue.push(start);
    var shortest_path = []

    var distance = {};
    distance[start] = 0;
    while (queue.length > 0){
        var current = queue.shift();
        for(next of grid.neighbors(current)){
            if(!(next in distance)){
                shortest_path.push(next)
                queue.push(next);
                distance[next] = 1 + distance[current];
                drawFoundTile(next[0], next[1], distance[next]);
                //console.log(distance);
                if(next[0] == finish[0] && next[1] == finish[1]){
                    drawFinish(next[0], next[1]);
                    queue = [];
                    return shortest_path;
                }
            }
        }
        
    }
}

var path = breadth_first_search(g, start, finish);

console.log(path)