

import { CIRCULAR_GRAPH_RENDERING  , CONCENTRIC_GRAPH_RENDERING  ,RANDOM_GRAPH_RENDERING  } from './view/RenderingConstants.js';
import { BellmanFord,GraphObject, Edge }  from './model/GraphModel.js';
import { GraphRender}   from './view/GraphRender.js';



const MAX_NODE_NUMBER : number = 15;
const MAX_NODE_VALUE : number   = 50;
const MAX_EDGE_NUMBER : number  = 2;

const ERROR_MESSAGE_TIMEOUT : number  = 3000;


let renderingMode : number = CIRCULAR_GRAPH_RENDERING;


type   HtmlControl =  HTMLElement | null;


let graphObject : GraphObject;

/////////////////////////////////////////////////////////////////////////////////
/*                      EVENT HANDLERS SECTION                                */
/////////////////////////////////////////////////////////////////////////////////



const setEventHandlers  = () : void => {
    console.log("setEventHandlers");

  
     window.addEventListener("resize", windowResizeHandler );
     document.addEventListener('keydown', keydownHandler );

     let dfsButton : HtmlControl;
     dfsButton = document.getElementById("dfs-button");
     if ( dfsButton !== null)    dfsButton.addEventListener("click", dfsButtonClickHandler );


     let dfsAllPathButton : HtmlControl;
     dfsAllPathButton = document.getElementById("dfs-all-path-button");
     if ( dfsAllPathButton !== null)    dfsAllPathButton.addEventListener("click", dfsAllPathButtonClickHandler );


    //  const radioButtons = ["circular-rendering","concentric-rendering","random-rendering"];


    //  radioButtons.forEach( radioID => {

    //     const radioButton = document.getElementById(radioID);
    //     radioButton.addEventListener("click", renderingButtonClickHandler );

    //  });
     

}

const  keydownHandler = (event : KeyboardEvent)  => {

        
    if ( event.key === 'Escape') {
     
       hideWarningMessage();
    }
   
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
    
      graphObject.setSelectedNode(value);

      render();

}

const dfsAllPathButtonClickHandler  = () => {

  

    //*** */
    const nbrNodes = graphObject.size();

    console.log("Find path for all " + nbrNodes + "Nodes");

    for (let i=0;i<nbrNodes;i++) {

        graphObject.setSelectedNode(i);
        //const path = graphObject.DFS(i);

        const path : number[] =  BellmanFord(graphObject, i );

      

        // export function BellmanFord(graph : GraphObject, src : number) {


       



        console.log(`${i} - ${path}`);

        if (path.length === nbrNodes) 
            console.log("%cComplete",'color: #00ff00');
        else
            console.log(`%cPartial ${path.length}`,'color: #ff0000');
    }
    //** */
}

function initBellman () : void {

    const V = 5;
    const E = 8;
    graphObject = new GraphObject(V, E);

    graphObject.edge[0] = new Edge(0, 1, 1);
    graphObject.edge[1] = new Edge(0, 2, 4);
    graphObject.edge[2] = new Edge(1, 2, 3);
    graphObject.edge[3] = new Edge(1, 3, 2);
    graphObject.edge[4] = new Edge(1, 4, 2);
    graphObject.edge[5] = new Edge(3, 2, 5);
    graphObject.edge[6] = new Edge(3, 1, 1);
    graphObject.edge[7] = new Edge(4, 3, 3);

    console.log(`initBellman Graph size is ${graphObject.size()}`);
    
    // BellmanFord(graphObject, 0);
}

/////////////////////////////////////////////////////////////////////////////////
/*                        CORE METHODS  SECTION                                */
/////////////////////////////////////////////////////////////////////////////////

export const init = () : void => {

    initBellman();
    setEventHandlers();
}


export const render = () : void=> {

    console.log("Render called...");

    updateGraphDetailSection();

    var canvas = document.getElementById("graph-canvas") as HTMLCanvasElement;

    if (canvas === null)  return;

    canvas.width = window.innerWidth - 60;

    BellmanFord(graphObject, 0);

    // Before
    // let renderObject = new GraphRender(canvas,graph,renderingMode);
    // renderObject.draw();
    // updateGraphDetailSection();

    let renderObject = new GraphRender(canvas,graphObject,renderingMode);
    renderObject.draw();
    //updateGraphDetailSection();

    //console.log("Render called...");

   
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

const hideWarningMessage= () : void => {


    let errorWarningSection : HtmlControl;
    errorWarningSection = document.getElementById("warning-section");

    let errorWarningMsg : HtmlControl;
    errorWarningMsg = document.getElementById("error-warning-msg");

    if ( errorWarningSection !== null)   errorWarningSection.style.visibility = "hidden"
    if ( errorWarningMsg !== null)       errorWarningMsg.innerHTML = " ";
    
}

// The Graph Detail Section is at the bottom of the screen, under the Canvas
const updateGraphDetailSection  = () : void => {

    
    const nbrNodes : number =  graphObject.size();
    for (let i=0;i<nbrNodes;i++) {

        const nodeValue : number = Math.round( Math.random() * MAX_NODE_VALUE ) + 1;    

        let edgesArray : Edge[] = graphObject.getEdgesForNode(i);


//        console.log(i + " value is " + " nodeValue, edges --> " + graphObject.getEdgesForNode(i));
        console.log(i + " value is " + " nodeValue, edges --> " );
        edgesArray.forEach((edge) => {
            console.log(`From/To [${edge.src},${ edge.dest}], weight of ${edge.weight}`);

        });   
    }

    let nodeCount : HtmlControl;
    nodeCount = document.getElementById("NodeTotalCount");
    if ( nodeCount !== null)    nodeCount.innerHTML = nbrNodes.toString();

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





