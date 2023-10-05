const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');

let start = { x: 50, y: 20 };
let end = { x: 100, y: 200 };
let start2 = {x : 100, y:200};
let end2 = {x: 300 , y: 200};

let startPoint = { x: 100, y: 200 };
let controlPoint = { x: 300, y: 50 };
let endPoint = { x: 500, y: 200 };
const ballRadius = 10;
junctions_l = [{start_x: 50, start_y:20, end_x: 100, end_y:200}];
junction_c = [{ start_x: 100, start_y: 200 , end_x: 500, end_y: 200, control_point_x: 300, control_point_y:50 }]
let t = 0; // Parameter for linear interpolation

const SPEED = 2;
const ENEMY_SPEED = 1;
//let path3 = new StraightPath(node3, node2);


//DIRECTIONS
const R = "right";
const L =  "left";
const U = "up";
const D = "down";
const UR ="upright";
const UL = "upleft";
const DR = "downright";
const DL = "downleft"; 




class Node{
    constructor(coordinates){
        this.coordinates = coordinates;
        //this.heuristic = 0;
        this.paths = [];
        this.currentpath = this.paths[0];  
        
    }

    addConnection(path, direction){
        this.paths.push({path, direction});
    }

    checkPathExists(direction){
        const mp = this.paths.findIndex(pathObj => pathObj.direction == direction);
        if(mp !=-1){
            return this.paths[mp];
        }else{
            return false;
        }
    }
    //user checking - ifexists - set direction and path || priority check with the  direction
    //free flow - ifexists -set direction and path || priority check with  direction

    setPathByDirection(direction){
        
        // get the direction, there is two cases here
        // 1) the user's input - if a direction such as exist it is returned else it goes to priority check
        // 2) free flow - the direction of the previous direction is followed, '' '' it goes to priority check 
        /*let restricts = {
            "right":["upleft", "downleft"],
            "left": ["upright", "downright"],
            "up":["downleft", "downright"],
            "down":["upleft", "upright"]
        }*/
        const check = this.checkPathExists(direction);
        
        if(check){
            return check;
        }else {
            const priorityMap = {
                "right"  :  [UR, DR],
                "left":     [UL, DL],
                "up":       [UR, UL],
                "down":     [DR, DL],
                "upleft":   [L , U],
                "upright":  [R,  U],
                "downleft": [L,  D],
                "downright":[R,  D]
            };
          
            const alternativeDirections = priorityMap[direction];
     
            
            for (const altDirection of alternativeDirections) {
                const pathInAltDirection = this.paths.find(pathObj => pathObj.direction === altDirection);
                if (pathInAltDirection) {
                    return pathInAltDirection ;//this.currentpath = pathInAltDirection;
                }else{
                    return false;
                }
            }
        //let path = this.getPath();
        //if(path){
        //    return path;
        //}else{
        //    return false;
        //}


        }
        //return false;
    }


    searchPath(node){
        const mp = this.paths.findIndex(pathObj => pathObj.path.end_node == node);
        if(mp!=-1){
            return this.paths[mp]; //NEED TO SET THIS.CURRPATH = THIS.PATHS[mp]
        }
        else{
            return false;
        }
    }

    getCurrDirection(){
        return this.currentpath.direction;
    }

    getPath(){
        //let pa = this.paths[this.currentpathindex];
        if (this.paths.length > 0){
            
            const rd = Math.random();
  // Scale and shift the random decimal to the desired range
            const randomNumber = Math.floor(rd * ( this.paths.length ));
            return this.paths[randomNumber];
            
           /*
            const mp = this.paths.findIndex(pathObj => pathObj.direction != prev_direction);
            if(mp  != - 1){
                return this.paths[mp];
            }
            else{
                return false;
            }
            */
        }
    }

    draw(){
        context.fillStyle = 'green';
        context.beginPath();
        context.arc(this.coordinates.x, this.coordinates.y, 5, 0, Math.PI * 2);
        context.fill();

    }
}

class StraightPath{
    constructor(start_node, end_node){
        this.start_node = start_node;
        this.end_node = end_node;
        this.start = start_node.coordinates;
        this.end = end_node.coordinates;
    }

    draw(){
        context.strokeStyle = 'black';
        context.beginPath();
        context.moveTo(this.start.x , this.start.y);
        context.lineTo(this.end.x, this.end.y);
        context.stroke();
        }

    interpolate(tval){
        
        const InterpX = this.start.x + (this.end.x - this.start.x) * tval;
        const InterpY = this.start.y + (this.end.y - this.start.y) * tval;
        return { InterpX, InterpY };
    }

    Length() {
        return Math.sqrt(Math.pow(this.end.x - this.start.x, 2) + Math.pow(this.end.y - this.start.y, 2));
    }

    Length_custom(start){
        return Math.sqrt(Math.pow(this.end.x - start.x, 2) + Math.pow(this.end.y - start.y, 2));

    }


}
//const start = { x: 100, y: 200 };
//const end = { x: 285.71, y: 200 }; // Adjust the x-coordinate to achieve the desired length


/*let graph = new Graph();
graph.addNode(node1);
graph.addNode(node2);
graph.addNode(node3);
graph.addPath(path1);
graph.addPath(path2);
*/
class Curves{
    constructor(start_node, controlPoint_1, controlPoint_2, end_node){
        this.start_node = start_node;
        this.end_node = end_node;
        this.control_point_1 = controlPoint_1;
        this.control_point_2 = controlPoint_2;
        this.start = start_node.coordinates;
        this.end = end_node.coordinates;
    }

    draw(){
        context.strokeStyle = "blue";
        context.beginPath();
        context.moveTo(this.start.x, this.start.y);
        context.bezierCurveTo(
            this.control_point_1.x, this.control_point_1.y,
            this.control_point_2.x, this.control_point_2.y,
            this.end.x, this.end.y
        );
        context.stroke();
    }

    interpolate(tval){
        const InterpX = (1 - tval) ** 3 * this.start.x
            + 3 * tval * (1 - tval) ** 2 * this.control_point_1.x
            + 3 * tval ** 2 * (1 - tval) * this.control_point_2.x
            + tval ** 3 * this.end.x;

        const InterpY = (1 - tval) ** 3 * this.start.y
                + 3 * tval * (1 - tval) ** 2 * this.control_point_1.y
                + 3 * tval ** 2 * (1 - tval) * this.control_point_2.y
                + tval ** 3 * this.end.y;
        
        return { InterpX, InterpY };

    }

    length(){
            //  De Casteljau's algorithm baby
            let numSegments = 50;
            const points = [];
            for (let t = 0; t <= numSegments; t++) {
              const u = t / numSegments;
              const u1 = 1 - u;
              const point = [
                u1 * u1 * u1 * this.start.x + 3 * u * u1 * u1 * this.control_point_1.x + 3 * u * u * u1 * 
                this.control_point_2.x +  u * u * u * this.end.x,
                u1 * u1 * u1 * this.start.y + 3 * u * u1 * u1 * this.control_point_1.y + 3 * u * u * u1 * 
                this.control_point_2.y + u * u * u * this.end.y];
              points.push(point);
            }
          

            let totalLength = 0;
            for (let i = 1; i < points.length; i++) {
              const dx = points[i][0] - points[i - 1][0];
              const dy = points[i][1] - points[i - 1][1];
              totalLength += Math.sqrt(dx * dx + dy * dy);
            }
          
            return totalLength;
          
    }

}

function calculateDistance(node1, node2) {
    //Manhattan distance baby
    const dx = Math.abs(node1.x - node2.y);
    const dy = Math.abs(node2.x - node2.y);

    return dx + dy;
  }

class Graph{
    constructor(){
        this.nodes = [];
        this.paths = [];
    }

    addNode(node){
        this.nodes.push(node);
    }

    addPath(path){
        this.paths.push(path);
    }

    addNodesToGraph(nodeList) {
        nodeList.forEach(node => {
            this.nodes.push(node);
        });
    }

    addPathsToGraph(Pathslist){
        Pathslist.forEach(path => {
            this.paths.push(path);
          });
    }

    calculateH(endNode){
        this.nodes.forEach(node => {
            const distance = calculateDistance(node, endNode); // Calculate distance (Manhattan or Euclidean)
            node.heuristic = distance;
        });
    }

    drawNodes(){
        this.nodes.forEach(node =>{
            node.draw();
        });
    }

    drawPaths(){
        this.paths.forEach(path =>{
            path.draw();
        })
    }

    connect_grid(){

        /*
        let numRows = 3;
        let numCols = 5;
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
              const currentNode = this.nodes[i * numCols + j];
              if (j < numCols - 1) {
                const rightNode = this.nodes[i * numCols + j + 1];
                if (rightNode) {
                  const path = new StraightPath(currentNode, rightNode);
                  currentNode.addConnection(path, R);
                  rightNode.addConnection(path, L);
                }
              }
              if (j > 0) {
                const leftNode = this.nodes[i * numCols + j - 1];
                if (leftNode) {
                  const path = new StraightPath(currentNode, leftNode);
                  currentNode.addConnection(path, L);
                  leftNode.addConnection(path, R);
                }
              }
              if (i < numRows - 1) {
                const downNode = this.nodes[(i + 1) * numCols + j];
                if (downNode) {
                  const path = new StraightPath(currentNode, downNode);
                  currentNode.addConnection(path, D);
                  downNode.addConnection(path, U);
                }
              }
              if (i > 0) {
                const upNode = this.nodes[(i - 1) * numCols + j];
                if (upNode) {
                  const path = new StraightPath(currentNode, upNode);
                  currentNode.addConnection(path, U);
                  upNode.addConnection(path, D);
                }
              }
            }
          }
          */
    }

    generate_grid(){
        let numRows = 3;
        let numCols = 3;
        const nodeSpacing = 200;
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
            const x = 50 + j * nodeSpacing;
            const y = 50 + i * nodeSpacing;
            const node = new Node({ x , y });
       
            gameGraph.addNode(node);
            }
        }
    }

    SourceNode(){
        return this.nodes[0];
    }
    


}




const controlPoint1 = { x: 121.43, y: 20 };
const controlPoint2 = { x: 242.86, y: 380 };

let node1 = new Node({x: 50, y: 50});
let node2 = new Node({x: 250, y: 50});
let node3 = new Node({x: 450, y: 50});
let node4 = new Node({x: 50, y: 250});
let node5 = new Node({x: 250, y: 250});
let node6 = new Node({x: 450, y: 250});
let node7 = new Node({x: 50, y: 450});
let node8 = new Node({x: 250, y: 450});
let node9 = new Node({x: 450, y: 450});

let path12 = new StraightPath(node1, node2);
let path14 = new StraightPath(node1, node4);

let path21 = new StraightPath(node2, node1);
let path23 = new StraightPath(node2, node3);
let path25 = new StraightPath(node2, node5);

let path32 = new StraightPath(node3, node2);
let path36 = new StraightPath(node3, node6);

let path45 = new StraightPath(node4, node5);
let path41 = new StraightPath(node4, node1);
let path47 = new StraightPath(node4, node7);

let path52 = new StraightPath(node5, node2);
let path56 = new StraightPath(node5, node6);
let path54 = new StraightPath(node5, node4);
let path58 = new StraightPath(node5, node8);

let path63 = new StraightPath(node6, node3);
let path65 = new StraightPath(node6, node5);
let path69 = new StraightPath(node6, node9);

let path74 = new StraightPath(node7, node4);
let path78 = new StraightPath(node7, node8);

let path85 = new StraightPath(node8, node5);
let path87 = new StraightPath(node8, node7);
let path89 = new StraightPath(node8, node9);

let path96 = new StraightPath(node9, node6);
let path98 = new StraightPath(node9, node8);

node1.addConnection(path12, R);
node1.addConnection(path14, D);

node2.addConnection(path21, L);
node2.addConnection(path23, R);
node2.addConnection(path25, D);

node3.addConnection(path32, L);
node3.addConnection(path36, D);

node4.addConnection(path45, R);
node4.addConnection(path41, U);
node4.addConnection(path47, D);

node5.addConnection(path52, U);
node5.addConnection(path56, R);
node5.addConnection(path54, L);
node5.addConnection(path58, D);

node6.addConnection(path63, U);
node6.addConnection(path65, L);
node6.addConnection(path69, D);

node7.addConnection(path74, U);
node7.addConnection(path78, R);

node8.addConnection(path85, U);
node8.addConnection(path87, L);
node8.addConnection(path89, R);

node9.addConnection(path96, U);
node9.addConnection(path98, L);

//class junction
let gameGraph = new Graph();
gameGraph.addNodesToGraph([node1, node2, node3, node4, node5, node6, node7, node8, node9]);
gameGraph.addPathsToGraph([path12, path14, path21, path23, path25, path32, path36, path41, path45, path47, path52,
    path54, path56, path58, path63, path65, path69, path74, path78, path85, path87, path89, path96, path98])



class Enemy{
    constructor(firstNode){
        this.currentNode = firstNode;
        this.player_node = node9;
        this.player_curr = null;
        this.t = 1;
        this.radius = 5;
        this.speed = 0;
        this.x = this.currentNode.coordinates.x;
        this.y = this.currentNode.coordinates.y;
        this.scatterState = false;
        this.direction = null;
        this.currpath = null;
        this.pathList = [];
        this.IdleState = true;
        this.check=false;
        //this.fetchPath();
        //this.setPath();
    }

    
    move() {
            this.t += this.speed;
            if (this.t >= 1) {
            this.t = 0;
            let c = this.currpath.path.end_node;
            this.currentNode = c;
            this.setPath();
            
            
        } 
    }

    detectCollision(){
       
        const distance = Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2));
        if (distance <= this.radius + ball.radius) {
            console.log("collided");
          } else {
            return false;
        
    }
        
    }

    trigger(){
      
        this.fetchPath();
        this.setPath();
        this.IdleState = false;
        
    }
    //checkNode(){
    //    if(this.t >= 0.8 && this.currpath!=null){
    //        return this.currpath.path.end_node;
    //    }else{
    //        return this.currentNode;
    //    }
    //}

    fetchPath(){
        let cameFrom = this.findPath(this.player_node);
        let pathList = this.backtrack(cameFrom, this.player_node);

        //if(pathList && pathList.length<=2){
           // pathList.unshift(this.player_path.start_node);
        //}
        //collision detection
        
        if(pathList){
            this.pathList = pathList.slice(1);
            //if(this.pathList.length <=2){
            //if(this.currpath!=null && this.currpath.path.end_node == this.player_node ){

                this.pathList.push(this.player_curr);
               // console.log("juju")
           // }
            
        }else{
            console.log("nope");
            return false;
        }

       // console.log(pathList);

    }

    OnthePathway(){
        return this.t < 1 && this.t > 0 ;
    }

    setPath(){
        
        // do the a* start search - gets back the path as a lis
        // iterate through the path, throught shift(),
        if(this.pathList.length!=0){
        let end_node = this.pathList.shift();
        let path = this.currentNode.searchPath(end_node);
        
        //this.currpath = path;
        //this.direction = path.direction;
        //this.t = 0;
        if(this.currpath != null && this.OnthePathway() ){
            //console.log(this.currpath, path);
            if(this.currpath != path){
                //console.log("current" , this.currpath, "path", path, "endnode", end_node);
                this.pathList.unshift(end_node);      
                this.reverse();
            }
        }else{
            this.currpath = path;
            this.direction = path.direction;
            this.t = 0;
        }
        this.speed = 1/(this.currpath.path.Length()/ENEMY_SPEED);
    }
    
    else{
       
        this.IdleState = true;
        this.t=1;
    }
}
      
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    calculatePos(){
        //const currenPath = this.currentNode.setPathByDirection("down");
        //if(currenPath){
        const position = this.currpath.path.interpolate(this.t);
        this.x = position.InterpX;
        this.y = position.InterpY;
    
    }

    reverse(){
        let c = this.currpath.path.end_node;
        let Path = c.searchPath(this.currentNode);
        this.currentNode = c;
        this.currpath = Path;
        this.t = 1 -  this.t;
        this.direction = Path.direction;

        }
    
    update(){
        if(this.IdleState == false){
            this.move();
            this.calculatePos();
        }
        this.draw(context);
        if(this.check){
            this.detectCollision();
        }
     
    }

   
    findPath(end_node){
        
        let start_node = this.currentNode;
        
        //console.log(start_node);
        let openList = [start_node];
        let closedList = new Set();
        let cameFrom = new Map(); 

        let gScore = new Map();
        let fScore = new Map();
        
        
        gScore.set(start_node, 0);
        fScore.set(start_node, calculateDistance(start_node.coordinates, end_node.coordinates));
    
        //console.log("x,y", this.x, this.y, start_node.coordinates);
        //console.log("first", calculateDistance(start_node.coordinates, end_node.coordinates));
        while (openList.length>0){
            openList.sort((a, b) => fScore.get(a) - fScore.get(b));
            let current = openList.shift();
            //console.log("choose", current.coordinates, fScore[current]);
            if(current == end_node){
                return cameFrom;
                //return this.backtrack(cameFrom, end_node);
            }

            closedList.add(current);
        
            for(let Path of current.paths){
                let neighbor = Path.path.end_node;
                if(closedList.has(neighbor)){
                    continue;
                }

                let tentgScore = 0;
                if (Path == this.currpath){
                tentgScore = gScore.get(current) + Path.path.Length_custom({x:this.x, y:this.y});
                    
                }else{
                tentgScore = gScore.get(current) + Path.path.Length(); 
                }

                if(!openList.includes(neighbor) || tentgScore < gScore.get(neighbor)){
                    cameFrom.set(neighbor, current); // Use set() for Map
                    gScore.set(neighbor, tentgScore);
                    fScore.set(neighbor, tentgScore + calculateDistance(neighbor.coordinates, end_node.coordinates));
                    //console.log("set", neighbor.coordinates, fScore[neighbor]);

                    if(!openList.includes(neighbor)){
                        openList.push(neighbor);
                    }
                }
            }
        }

        return null;

    }
    

    backtrack(cameFrom, current){
        let path = [current];
        while (cameFrom.has(current)) { // Use has() for Map
            current = cameFrom.get(current); // Use get() for Map
            path.unshift(current);
        }
        return path;
    }


}

class Ball{
    constructor(firstNode){
        this.currentNode = firstNode;
        this.t = 1;
        this.speed = 0;
        this.x = this.currentNode.coordinates.x;
        this.y = this.currentNode.coordinates.y;
        this.IdleState = true;
        this.user_direction = null;
        this.direction = null;
        this.currpath = null;
        this.radius = 9;
        //this.setPath(); // - switching to drunk pac-man (note: this.direction should not be null )
        
    }
    isJunction(){    
        return this.t>=0.7 ;
        
    }

    setDirection(direction){
        this.user_direction = direction;

        if(this.IdleState == true){
            this.direction = this.user_direction;
            this.user_direction = null;
            this.deactivateIdleState();
            this.setPath();
        }
    }

    move() {
            this.t += this.speed;
            if (this.t > 1 ) {
            this.t = 0;
            let c = this.currpath.path.end_node;//this.currentNode.curr....
            this.currentNode = c;
            if(this.user_direction!=null){
                this.direction = this.user_direction;
                this.user_direction = null;
            }
            this.setPath();
            
            }
        
      }

    reverse(){
            let c = this.currpath.path.end_node;
            let Path = c.searchPath(this.currentNode);
            this.currentNode = c;
            this.currpath = Path;
            this.t = 1 -  this.t;
            this.direction = Path.direction;

    }

    pendState(){
        this.t = 1;
        this.IdleState = true;
    }

    deactivateIdleState(){
        this.t=0;
        this.IdleState = false;
    }
      

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    initializePath(){
        let currenPath = this.currentNode.getPath();
        this.currpath = currenPath;
    }

    PathValidate(direction){
        
        let node;
        if(this.currpath){
            node = this.currpath.path.end_node;
        }else{
            node = this.currentNode;
        }
        let Path = node.checkPathExists(direction);
        
        if(Path){         
            return true
        }else{
            return false
        }
        
    
    }
    

    setPath(){
        //console.log(performance.now());
        let currenPath = this.currentNode.setPathByDirection(this.direction);

        if(currenPath){
            this.currpath =  currenPath;
            this.direction = currenPath.direction;
            
            //take the length of the line
            //divide it by the SPEED to get how many iterations
            // based on the iterations calculate the inc, 1/iterations = inc;
            this.speed = 1/(this.currpath.path.Length()/SPEED);

            blinky.player_node = this.currpath.path.end_node;
            blinky.player_curr = this.currentNode; //this.currpath.path;
            blinky.trigger();
        }else{
            this.pendState();
        }
        
    }

    calculatePos(){
   
        const position = this.currpath.path.interpolate(this.t);
        this.x = position.InterpX;
        this.y = position.InterpY;
       
    }


    update(){
        if(this.IdleState == false){
            this.move();
            this.calculatePos();
        }
        this.draw(context);
     
    }

    

}



let ball = new Ball(node9);
let blinky = new Enemy(node1);

//draw------------------------------------------------------
function drawBall(x, y) {
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fill();
}
function drawline(){
    context.fillStyle = 'green';
    context.beginPath();
    context.arc(50, 20, 5, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = 'black';
    context.beginPath();
    context.moveTo(50, 20);
    context.lineTo(100, 200);
    context.stroke();

    context.beginPath();
    context.arc(100, 200, 5, 0, Math.PI * 2);
    context.fill();
}

function drawCurve(){
    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
    context.stroke();

    context.fillStyle = 'green';
    context.beginPath();
    context.arc(endPoint.x,endPoint.y, 5, 0, Math.PI * 2);
    context.fill();
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

//---------------------------------------------------------------------------------
//TESTING
function interpolateQuadraticBezier(t) {
    const x = (1 - t) * (1 - t) * startPoint.x + 2 * (1 - t) * t * controlPoint.x + t * t * endPoint.x;
    const y = (1 - t) * (1 - t) * startPoint.y + 2 * (1 - t) * t * controlPoint.y + t * t * endPoint.y;
    return { x, y };
}

function curvelen(start, control_p, end) {
    let totalLength = 0;
    let numSegments = 50;
    for (let t = 0; t < numSegments; t++) {
      const t0 = t / numSegments;
      const t1 = (t + 1) / numSegments;
      
      const x0 = (1 - t0) * (1 - t0) * start.x + 2 * (1 - t0) * t0 * control_p.x + t0 * t0 * end.x;
      const y0 = (1 - t0) * (1 - t0) * start.y + 2 * (1 - t0) * t0 * control_p.y + t0 * t0 * end.y;
      
      const x1 = (1 - t1) * (1 - t1) * start.x + 2 * (1 - t1) * t1 * control_p.x + t1 * t1 * end.x;
      const y1 = (1 - t1) * (1 - t1) * start.y + 2 * (1 - t1) * t1 * control_p.y + t1 * t1 * end.y;
      
      const dx = x1 - x0;
      const dy = y1 - y0;
      
      totalLength += Math.sqrt(dx * dx + dy * dy);
    }
    
    return totalLength;
  }

function curvemove(){
    const point = interpolateQuadraticBezier(t);
    drawBall(point.x, point.y);

    t += 0.01;
    t = Math.min(Math.max(t, 0), 1);
}

let nextPathDirection = null; 

function testCheck() {
  if((nextPathDirection == 'up'|| nextPathDirection == 'down') && (ball.direction == 'right' || ball.direction == 'left')){
    if(0.8 <= ball.t >=1 && ball.currpath.path.end_node.searchDirection(nextPathDirection) ){
        return true
    }else{
        return false
    }
  }
  if((nextPathDirection == 'right'|| nextPathDirection == 'left') && (ball.direction == 'up' || ball.direction == 'down')){
    if(0.8 <= ball.t >=1 && ball.currpath.path.end_node.searchDirection(nextPathDirection) ){
        return true
    }else{
        return false
    }
  }
  
}
//-------------------------------------------------------------------------------------------------------

function isNotrestricted(direction){
    /*
    restricted_map = {
        "right" : [UL, DL],
        "left" : [UR, DR],
        "up" : [DL, DR],
        "down" : [UL, UR],
        "upleft": [D, R],
        "upright":[D, L],
        "downleft":[U, R],
        "downright":[U, L]

    };
    const r_directions = restricted_map[ball.direction];
            
    for (const dir of r_directions) {
        if (dir == direction){
            console.log("restricted");
            return false
        }
    }*/
    return true    
}
// why the fuck did i wrote this?? well here's why dumbass - 
// to when the ball returns true for isJunction() and tries to do a reverse direction , instead of doing reverse it began 
//  to check for existing paths in the direction and starts choosing them (which we want in the case of UR, DR, UL, DL) 
//(not in this code, but in the previous update), so to get around this, we did another function, which added a generic 
// case for L, R, U, D, because whenever the ball is going in those directions obviously a path exists in the opposite  
//  direction , so running the function PathValidate(direction) is pointless,  so for these guyz we 
// just allow the reverse, and for UR.... those menaces, we first run PathValidate(direction) and then if false , 
// allow the reverse.

function validateR(direction){
    val = {
        "left": R,
        "right": L,
        "up": D,
        "down": U
    }
    if(ball.direction != null){ 
        if(val[direction] == ball.direction){
            return true;
        }else{
            return false;
        }
    }
    return false;

}
function IsReverse(direction){
    
    reverse_map={
        "left":[DR, UR, R],
        "right":[DL, UL, L],
        "up":[D],
        "down":[U]
    }
    const r_directions = reverse_map[direction];
    if(ball.direction != null){    
        for (const dir of r_directions) {
            if (dir == ball.direction){
                return true
            }
        }
    }
    return false    
}
// Define a variable to keep track of pressed arrow keys
const pressedKeys = {};

// Arrow key codes
const ARROW_UP = 38;
const ARROW_DOWN = 40;
const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;

// Add event listeners for keydown and keyup events
document.addEventListener('keydown', (event) => {
  pressedKeys[event.keyCode] = true;
  event.preventDefault();
  handleArrowCombinations();
});

document.addEventListener('keyup', (event) => {
  pressedKeys[event.keyCode] = false;
});

// Function to handle arrow key combinations
//the user can choose the direction when they reach a junction.
//2 cases - 
// if the user made the direction in the junction: then as so will be done
// else the case goes to reverse.

function handleArrowCombinations() {
    const isArrowDown = pressedKeys[ARROW_DOWN];
    const isArrowUp = pressedKeys[ARROW_UP];
    const isArrowLeft = pressedKeys[ARROW_LEFT];
    const isArrowRight = pressedKeys[ARROW_RIGHT];

    if (ball.isJunction()) {
        if (isArrowDown && isArrowRight && ball.PathValidate(DR)) {
            ball.setDirection(DR);
        } else if (isArrowDown && isArrowLeft ) {
            if(ball.PathValidate(DL)){ 
                ball.setDirection(DL);
            }
        } else if (isArrowUp && isArrowRight && ball.PathValidate(UR)) {
            ball.setDirection(UR);
        } else if (isArrowUp && isArrowLeft && ball.PathValidate(UL)) {
  
            ball.setDirection(UL);
        } else if (isArrowLeft){
                if(validateR(L)){
                    if(ball.IdleState == true){
                        ball.setDirection(L);
                    }else{
                        ball.reverse();
                    }
                }else if(ball.PathValidate(L)){
                    ball.setDirection(L);
                }else if(IsReverse(L)){
                    ball.reverse();
                }
             //ball.reverse();
        }
        else if (isArrowRight){
            if(validateR(R)){
                if(ball.IdleState == true){
                    ball.setDirection(R);
                }else{
                    ball.reverse();
                }
            }else if(ball.PathValidate(R)){
                ball.setDirection(R);
            }else if(IsReverse(R)){
                ball.reverse();
            }
            //ball.reverse();
        }
        else if (isArrowDown){
            if(validateR(D)){
                if(ball.IdleState == true){
                    ball.setDirection(D);
                }else{
                    ball.reverse();
                }
            }else if(ball.PathValidate(D)){
                ball.setDirection(D);
            }else if(IsReverse(D)){
                ball.reverse();
            }
                //ball.reverse();
        }
        else if (isArrowUp){
            if(validateR(U)){
                if(ball.IdleState == true){
                    ball.setDirection(U);
                }else{
                    ball.reverse();
                }
            }else if(ball.PathValidate(U)){
                ball.setDirection(U);
            }else if(IsReverse(U)){
                ball.reverse();
            }
        }
    }else{
        if(isArrowLeft && IsReverse(L)){
            ball.reverse();
        }
        if(isArrowRight && IsReverse(R)){
            ball.reverse();
        }
        if(isArrowUp && IsReverse(U)){
            ball.reverse();
        }
        if(isArrowDown && IsReverse(D)){
            ball.reverse();
        }
    }
}

/*

document.addEventListener('keydown', (event) => {
  switch (event.keyCode) {
    case 37:
        ball.reverse();
        console.log("left");
        break;
    case 39:
        console.log("right");
        break;
  }
});

*/

function run() {
    clearCanvas();
    
    
    //blinky.update();
    //
    
    gameGraph.drawNodes();
    gameGraph.drawPaths();

    ball.update();
    blinky.update();
    //drawline();
    //drawCurve();
    requestAnimationFrame(run);
    
}

run();

