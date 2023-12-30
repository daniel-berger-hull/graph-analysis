

import { CIRCULAR_GRAPH_RENDERING  , CONCENTRIC_GRAPH_RENDERING  ,RANDOM_GRAPH_RENDERING, CUSTOM_GRAPH_RENDERING  } from './view/RenderingConstants.js';
// import { BellmanFord,GraphObject, Edge }  from './model/GraphModel.js';
import { GraphObject, EdgeParams, GraphState }  from './model/GraphModel.js'

import { BellmanFord, shortestPath }  from './model/PathFind.js';


import { GraphRender }   from './view/GraphRender.js';



const MAX_NODE_NUMBER : number   = 15;
const MAX_NODE_VALUE  : number   = 50;
const MAX_EDGE_NUMBER : number   = 2;

const ERROR_MESSAGE_TIMEOUT : number  = 3000;

//let renderingMode : number = CIRCULAR_GRAPH_RENDERING;
let renderingMode : number = CUSTOM_GRAPH_RENDERING;


type   HtmlControl =  HTMLElement | null;


let graphObject : GraphObject;
let graphObjectBellmanFord : GraphObject;
let graphState : GraphState;


/////////////////////////////////////////////////////////////////////////////////
/*                      EVENT HANDLERS SECTION                                */
/////////////////////////////////////////////////////////////////////////////////



const setEventHandlers  = () : void => {
    console.log("setEventHandlers");

  
     window.addEventListener("resize", windowResizeHandler );
     document.addEventListener('keydown', keydownHandler );


     setButtonClickHandler("dfs-button",dfsButtonClickHandler);
     setButtonClickHandler("dfs-all-path-button",dfsAllPathButtonClickHandler);
     setButtonClickHandler("disjkstras-button",disjkstrasButtonClickHandler);
     

     const radioButtons : string[] = ["circular-rendering","concentric-rendering","random-rendering","custom-rendering"];
     radioButtons.forEach( radioID => {
         const radioButton = document.getElementById(radioID) as HtmlControl;           
         if (radioButton != null) radioButton.addEventListener("click", renderingButtonClickHandler );
      });
}

const setButtonClickHandler  = (controlIDStr: string, handlerFunction : EventListenerOrEventListenerObject ) : void => {

    let control : HtmlControl;
    control = document.getElementById(controlIDStr);
    if ( control !== null)    control.addEventListener("click", handlerFunction );

}


const  keydownHandler = (event : KeyboardEvent)  => {

    if ( event.key === 'Escape') {   hideWarningMessage();  }
}


const windowResizeHandler = () => {

    let canvas = document.getElementById('graph-canvas') as HTMLCanvasElement;    
    canvas.width = window.innerWidth - 60;

    render();        
}

const dfsButtonClickHandler  = () => {

    let  strValue : string;
    let value : number = -1;

    const nodeControl = document.getElementById("NodeToWorkOn") as HTMLInputElement;
   
    if ( nodeControl !== null)    {
        strValue = nodeControl.value;
        value = parseInt(strValue);
    }
    
  
    if( isNaN(value) )   {
        displayWarningMessage("Not numeric value entered!");
        return;
    }
    

      if ( (value < 0) || (value > graphObject.size()) ) {
        displayWarningMessage("Invalid Node Index entered!");
        return;
      }
    
    //   graphObject.setSelectedNode(value);
      graphState.setSelectedNode(value);

      render();

}

const dfsAllPathButtonClickHandler  = () => {

  
    const nbrNodes = graphObject.size();

    console.log("Find path for all " + nbrNodes + "Nodes");

    // Need to implement this one...
    // for (let i=0;i<nbrNodes;i++) {

    //     graphObject.setSelectedNode(i);
    //     //const path = graphObject.DFS(i);

    //     const path : number[] =  BellmanFord(graphObject, i );

    
    //     console.log(`${i} - ${path}`);

    //     if (path.length === nbrNodes) 
    //         console.log("%cComplete",'color: #00ff00');
    //     else
    //         console.log(`%cPartial ${path.length}`,'color: #ff0000');
    // }

}


function disjkstrasButtonClickHandler()  {

    const startNode = document.getElementById("DisjkstrasStartNode") as HTMLInputElement;
    const endNode  = document.getElementById("DisjkstrasEndNode") as HTMLInputElement;
    
    const startNodeIndex =  parseInt(startNode.value);
    const endNodeIndex =  parseInt(endNode.value);
    
    if( isNaN(startNodeIndex) )   {
        displayWarningMessage("Not numeric value entered for start Node!");
        return;
    }  
    if( isNaN(endNodeIndex) )   {
        displayWarningMessage("Not numeric value entered for end Node!");
        return;
    }

    if ( (startNodeIndex < 0) || (startNodeIndex >= graphObject.getNbrNodes()) ) {
        displayWarningMessage("Invalid Start Node Index entered!");
        return;
    }

    if ( (endNodeIndex < 0) || (endNodeIndex >= graphObject.getNbrNodes()) ) {
       displayWarningMessage("Invalid End Node Index entered!");
       return;
      }
    
    // graphObject.setStartNodePath(startNodeIndex);
    // graphObject.setEndNodePath(endNodeIndex);
    graphState.setStartNodePath(startNodeIndex);
    graphState.setEndNodePath(endNodeIndex);


    //const results = shortestPath(graphObject,startNodeIndex);
    const results = shortestPath(graphObject,graphState);

    

    
    const distances = results.distances;
    const paths = results.nodesPath;

    console.log(`Dijkstra: Start/End Node [${startNodeIndex},${endNodeIndex}] , cost = ${distances[endNodeIndex]}`) ;
    console.log("Distances from Node 0 to node#");
    for (let i = 0; i < distances.length; ++i)
     // console.log(i + " --> " + distances[i]);
      console.log(` ${i} --> ${distances[i]}, ${paths[i].length} Nodes,  Path: ${paths[i]}`);
      render();

}






function renderingButtonClickHandler(event : UIEvent) : void  {


   if (event == null || event.currentTarget == null)  return;

    //Should use something more specific, like the HtmlInputRadioButton  class, but it not working...
    const selectedRadio : any = event.currentTarget;
     
    if (selectedRadio.id === "circular-rendering") {
        console.log("Click circular-rendering");
        renderingMode = CIRCULAR_GRAPH_RENDERING;
    } else if ( selectedRadio.id === "concentric-rendering") {
        console.log("Click concentric-rendering");
        renderingMode = CONCENTRIC_GRAPH_RENDERING;
    } else if ( selectedRadio.id === "random-rendering") {
        console.log("Click random-rendering");
        renderingMode = RANDOM_GRAPH_RENDERING;
    } else if ( selectedRadio.id === "custom-rendering") {
        console.log("Click custom-rendering");
        renderingMode = CUSTOM_GRAPH_RENDERING;
    }

    render();
}



// Note: Should remove this method, as it relies on the old version of the GraphObject
function initBellman () : void {

    const NBR_NODES : number = 5;
    
    graphObjectBellmanFord = new GraphObject(NBR_NODES);

    graphObjectBellmanFord.addEdgeWithWeight(0, 1, 1);
    graphObjectBellmanFord.addEdgeWithWeight(0, 2, 4);
    graphObjectBellmanFord.addEdgeWithWeight(1, 2, 3);
    graphObjectBellmanFord.addEdgeWithWeight(1, 3, 2);
    graphObjectBellmanFord.addEdgeWithWeight(1, 4, 2);
    graphObjectBellmanFord.addEdgeWithWeight(3, 2, 5);
    graphObjectBellmanFord.addEdgeWithWeight(3, 1, 1);
    graphObjectBellmanFord.addEdgeWithWeight(4, 3, 3);

    // console.log(`initBellman Graph size is ${graphObject.size()}`);
    
    // BellmanFord(graphObject, 0);
}

function initDijkstra(nbrNodes : number) {

    graphObject = new GraphObject(nbrNodes);


    graphObject.addDoubleEdgeWithWeight(0, 1, 4);
    graphObject.addDoubleEdgeWithWeight(0, 7, 8);
    graphObject.addDoubleEdgeWithWeight(1, 2, 8);
    graphObject.addDoubleEdgeWithWeight(1, 7, 11);
    graphObject.addDoubleEdgeWithWeight(2, 3, 7);
    graphObject.addDoubleEdgeWithWeight(2, 8, 2);
    graphObject.addDoubleEdgeWithWeight(2, 5, 4);
    graphObject.addDoubleEdgeWithWeight(3, 4, 9);
    graphObject.addDoubleEdgeWithWeight(3, 5, 14);
    graphObject.addDoubleEdgeWithWeight(4, 5, 10);
    graphObject.addDoubleEdgeWithWeight(5, 6, 2);
    graphObject.addDoubleEdgeWithWeight(6, 7, 1);
    graphObject.addDoubleEdgeWithWeight(6, 8, 6);
    graphObject.addDoubleEdgeWithWeight(7, 8, 7);

  
    /// Graph #2 start here...
    // Note Nov 17: Would can't use it for now, till the array of letter problem , in the PathFind.js :: shortestPath method is not fixex...
    graphObject.addDoubleEdgeWithWeight(9,0, 7);
    graphObject.addDoubleEdgeWithWeight(10,9, 10);
    graphObject.addDoubleEdgeWithWeight(11, 10, 8);
    graphObject.addDoubleEdgeWithWeight(15, 11,12);
    graphObject.addDoubleEdgeWithWeight(12, 15, 2);
    graphObject.addDoubleEdgeWithWeight(9, 12, 6);
    graphObject.addDoubleEdgeWithWeight(14, 12, 5);
    graphObject.addDoubleEdgeWithWeight(13, 14, 9);
    graphObject.addDoubleEdgeWithWeight(5, 11, 3);
    graphObject.addDoubleEdgeWithWeight(6, 10, 3);
    

    graphState = new GraphState();

    graphState.setGraphObject(graphObject);

    //shortestPath(graphObject,0);
}

/////////////////////////////////////////////////////////////////////////////////
/*                        CORE METHODS  SECTION                                */
/////////////////////////////////////////////////////////////////////////////////

export const init = () : void => {

    // const nbrNodes = 9;
    const nbrNodes = 16;

    initBellman();
    initDijkstra(nbrNodes);
    setEventHandlers();
}


export const render = () : void=> {

    console.log("Render called...");

    updateGraphDetailSection();

    var canvas = document.getElementById("graph-canvas") as HTMLCanvasElement;

    if (canvas === null)  return;

    canvas.width = window.innerWidth - 60;

    //let renderObject = new GraphRender(canvas,graphObject,renderingMode);
    let renderObject = new GraphRender(canvas,graphObject,graphState,renderingMode);
    
    renderObject.draw();
}



/////////////////////////////////////////////////////////////////////////////////
/*                        UTILITY METHODS  SECTION                             */
/////////////////////////////////////////////////////////////////////////////////


const displayWarningMessage = (msg : string) : void => {

    let errorWarningSection : HtmlControl;
    errorWarningSection = document.getElementById("warning-section");

    let errorWarningMsg : HtmlControl;
    errorWarningMsg = document.getElementById("error-warning-msg");
    

    if ( errorWarningSection !== null)    errorWarningSection.style.visibility = "visible" 
    if ( errorWarningMsg !== null)        errorWarningMsg.innerHTML = msg;


    window.setTimeout(hideWarningMessage, ERROR_MESSAGE_TIMEOUT );
} 

const hideWarningMessage = () : void => {


    let errorWarningSection : HtmlControl;
    errorWarningSection = document.getElementById("warning-section");

    let errorWarningMsg : HtmlControl;
    errorWarningMsg = document.getElementById("error-warning-msg");

    if ( errorWarningSection !== null)   errorWarningSection.style.visibility = "hidden"
    if ( errorWarningMsg !== null)       errorWarningMsg.innerHTML = " ";
    
}

// The Graph Detail Section is at the bottom of the screen, under the Canvas
const updateGraphDetailSection  = () : void => {

    
    // The detail section list the node and edge count, right underneat the HTML Canvas...
    const nbrNodes : number =  graphObject.getNbrNodes();
    let nodeCount : HtmlControl;
    nodeCount = document.getElementById("NodeTotalCount");
    if ( nodeCount !== null)    nodeCount.innerHTML = nbrNodes.toString();

    const nbrEdges : number =  graphObject.getNbrEdges();
    let edgeCount : HTMLSpanElement | null;
    edgeCount = document.getElementById("EdgeTotalCount");
    if ( edgeCount !== null)    edgeCount.innerHTML = nbrEdges.toString();
    


    console.log("Display content of graphObject\n" +  graphObject.toString());
  
}


const getRandomEdgeIndexes = (currentIndex : number ,nbrNodes : number) : number[] => {

    const nbrEdges = Math.round( Math.random() * MAX_EDGE_NUMBER ) + 1;
    const indexes : number[] = [];


    for (let j=0;j<nbrEdges; ) {

        const otherNodeIndex = Math.round( Math.random() * (nbrNodes-1) );

        if ( !indexes.includes(otherNodeIndex) && otherNodeIndex !== currentIndex ){
            
            indexes.push(otherNodeIndex);
            j++;
        }
    }

    return indexes;
}





