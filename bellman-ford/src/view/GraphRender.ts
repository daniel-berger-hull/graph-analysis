import { CIRCULAR_GRAPH_RENDERING  , CONCENTRIC_GRAPH_RENDERING  ,RANDOM_GRAPH_RENDERING , CUSTOM_GRAPH_RENDERING } from './RenderingConstants.js';


import { GraphObject, EdgeParams, GraphState }     from '../model/GraphModel.js'; 





//import  { determinePos } from './NodeSpaceLocator.js';
import  { determinePos } from './NodeSpaceLocator.js';




const DIRECTION_GRAPH : boolean = true;

// This class should only draw on the Canvas, and the calculations required, like the locations of the node shouhld be delegated to some other classes or functions...
// The reason is that the way we spread the nodes on a the screen can be done in many differents ways, but things like draw a node or segment alway stay the same and should be done in this class only


type Point = { x : number; y : number; }
type Vector = { dx : number; dy : number; }

type Test = {
    name: string;
    age: number;
}

export class GraphRender {

    #canvas : HTMLCanvasElement;   
    graphObject : GraphObject;
    graphState : GraphState;
    renderingMode : number;
    
    constructor(targetCanvas : HTMLCanvasElement, 
                graph : GraphObject, 
                gs : GraphState,
                renderingMode : number) {

        this.#validateParams(targetCanvas,graph);
    
        this.#canvas = targetCanvas;
        this.graphObject = graph;
        this.graphState = gs;
        this.renderingMode = renderingMode;
        this.#init();

     }
 
   #init()  {
        console.log('init');
        //Note the init may be removed later if no usage is done...
    }

    #validateParams(targetCanvas : HTMLCanvasElement, graph : GraphObject){

        if ( targetCanvas === null || typeof targetCanvas === "undefined") 
           throw "You MUST provide a valid Canvas object to the GraphRender class!";
        if ( graph === null || typeof graph === "undefined") 
           throw "You MUST provide a valid Graph object GraphRender class!";
    }

    #isValidRenderingMode(mode : number) {
        if (mode < CIRCULAR_GRAPH_RENDERING || mode > RANDOM_GRAPH_RENDERING)  return false;
        else
            return true;
    }

    getCanvas() : HTMLCanvasElement       {  return this.#canvas;         };
    getGraph() : GraphObject             {  return this.graphObject;    };
    getRenderingMode() : number           {  return this.renderingMode;  };    


    setCanvas(canvas:HTMLCanvasElement)   {  this.#canvas = canvas;       };
    setGraph(graph:GraphObject)          {  this.graphObject = graph;   };
    setRenderingMode(mode:number)         {  this.renderingMode = mode;  };    


    renderNode( context : CanvasRenderingContext2D, 
                position : Point,    // May not be the right type here...
                size : number , 
                value : string, 
                isHighlighted : boolean) {

        context.strokeStyle = "#FBED20";
        context.beginPath();
        context.arc(position.x, position.y, size, 0, 2 * Math.PI);

        context.fillStyle = (isHighlighted === true) ? 'blue' : 'white';

        context.fill();
        context.lineWidth = 2;
        context.stroke();

        context.textAlign = "center";
        context.textBaseline = "middle"; 
        context.font = "12px Arial";
        const label = value;

        context.fillStyle = "black";
        context.fillText(label, position.x+1, position.y+1);

        context.fillStyle = (isHighlighted === true) ? 'white' : "#0046BE";
        context.fillText(label, position.x, position.y);    
    }

  
    renderSegment (context : CanvasRenderingContext2D, 
                   startPos : Point, 
                   endPos : Point, 
                   color : string,
                   directionnal : boolean) {
    
        context.beginPath();
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(endPos.x, endPos.y);
        context.strokeStyle = color;
        context.lineWidth = 1;
        
        context.stroke(); 

        // For the graph where direction exist, draw top of arraw toward the end of the segment
        if ( directionnal ) {

            let direction : Vector  = { dx : (startPos.x - endPos.x), dy : (startPos.y - endPos.y) };
            //let direction : Vector  = { dx : (endPos.x - startPos.x), dy : (endPos.y - startPos.y) };
            direction.dx = direction.dx * 0.1;
            direction.dy = direction.dy * 0.1;
            // let newEndPos= { ... endPos};
            // newEndPos.x -=  direction.dx;
            // newEndPos.y -=  direction.dy;
            


            context.beginPath();
            // context.moveTo(endPos.x, endPos.y);
            // context.lineTo(endPos.x + direction.dx, endPos.y + direction.dy);
            // context.moveTo(newEndPos.x, newEndPos.y);
            // context.lineTo(newEndPos.x + direction.dx, newEndPos.y + direction.dy);

            // context.strokeStyle = "#FF0000";
            // context.stroke(); 

            const newX = (direction.dx*0.70710) - (direction.dy*0.70710);
            const newY = (direction.dx*0.70710) + (direction.dy*0.70710);

            let rotated : Vector = {  dx : newX, dy : newY };

            context.beginPath();
            context.moveTo(endPos.x, endPos.y);
            context.lineTo(endPos.x + rotated.dx, endPos.y + rotated.dy);
            // context.moveTo(newEndPos.x, newEndPos.y);
            // context.lineTo(newEndPos.x + rotated.dx, newEndPos.y + rotated.dy);
            

            //context.strokeStyle = "#FF0000";
            context.strokeStyle = color;
            
            context.stroke(); 

            const newX2 = (direction.dx*0.70710) + (direction.dy*0.70710);
            const newY2 = (direction.dx*-0.70710) + (direction.dy*0.70710);

            let rotated2 : Vector = {  dx : newX2, dy : newY2 };

            context.beginPath();
            context.moveTo(endPos.x, endPos.y);
            context.lineTo(endPos.x + rotated2.dx, endPos.y + rotated2.dy);

            context.strokeStyle = "#FF0000";
            context.stroke(); 


        }


    }

    renderLoopSegment (context : CanvasRenderingContext2D, 
                       position : Point, 
                       size : number, 
                       color : string) {
    
        context.beginPath();
        context.arc(position.x, position.y-(size*1.3), size, 0, 2 * Math.PI);

        context.lineWidth = 1;
        context.stroke();
        
    }

    drawSegments(ctx : CanvasRenderingContext2D, 
                graph : GraphObject, 
                nodePosArray : Point[]) {

        console.log("%c drawSegments","color: red");

        for (let i=0;i<graph.size();i++) {
            const startNodePos =   { x: nodePosArray[i].x,        
                                     y: nodePosArray[i].y };


            let edges : EdgeParams[] = graph.getEdgesForNode(i);    
            edges.forEach( nextEdge => { 

                if (nextEdge.toNode !== nextEdge.fromNode) {
                   // console.log(i + " to " + index);
                    const endNodePos =   { x: nodePosArray[nextEdge.toNode].x,   y: nodePosArray[nextEdge.toNode].y };
                    this.renderSegment(  ctx,  startNodePos,  endNodePos, "#00FF00", DIRECTION_GRAPH); 
                } else {
                    console.log("Render: an edge on the same node detected!"); 
                    this.renderLoopSegment (ctx, startNodePos,  10, "#00FF00");
                }
               
            });        
        }
    }

    drawNodes(ctx : CanvasRenderingContext2D, nodePosArray : Point[]) {

        // Draw the node on top of the segments...
        nodePosArray.forEach( (pos,index : number) => { 
            this.renderNode( ctx, pos, 10 ,  index.toString()  ,true) ; 
        });
    }

    drawPath(ctx : CanvasRenderingContext2D, graph : GraphObject,  graphState: GraphState,  nodePosArray : Point[]) {

        const startNodeIndex = graphState.getStartNodePath();
        const endNodeIndex = graphState.getEndNodePath();
        
        //const path = graph.DFS(seletectedNodeIndex);
      
        console.log("Display path from node :" + startNodeIndex);

        const path : number[] = graphState.getPaths()[endNodeIndex];
        let startIndex = path[0];
        let startNodePos =   { x: nodePosArray[startIndex].x,        
                               y: nodePosArray[startIndex].y };        

        for (let i=1;i<path.length;i++) {

            let endIndex = path[i];
            let endNodePos =   {   x: nodePosArray[endIndex].x,        
                                   y: nodePosArray[endIndex].y }; 

            //this.renderSegment(  ctx,  startNodePos,  endNodePos, "#FF0000"); 

            this.renderSegment(  ctx,  startNodePos,  endNodePos, "#FF0000", DIRECTION_GRAPH); 
            
            startNodePos = endNodePos;
                
        }

    }

    getCanvasSpecs () {

        return { width: this.#canvas.width,
                 height: this.#canvas.height};
    }

    draw() : void {

        console.log('Will draw using the GraphRender..');
        let ctx   = this.#canvas.getContext("2d");

        if (ctx === null)  return;

        const graph = this.graphObject;
        const graphState = this.graphState;

        const nodePositions = determinePos( graph, this.getCanvasSpecs(), this.getRenderingMode()  );

        this.drawSegments(ctx, graph, nodePositions);
        if (  graphState.isValid() )  this.drawPath(ctx, graph, graphState, nodePositions);
        this.drawNodes(ctx, nodePositions);
       
    }
}
