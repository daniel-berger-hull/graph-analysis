
"use strict";


import { GraphRender}   from './view/GraphRender.js';
import { BellmanFord, GraphObject, Edge }  from './model/GraphModel.js';
import { CIRCULAR_GRAPH_RENDERING  , CONCENTRIC_GRAPH_RENDERING  ,RANDOM_GRAPH_RENDERING  } from './view/RenderingConstants.js';
 

const MAX_NODE_NUMBER = 15;
const MAX_NODE_VALUE  = 50;
const MAX_EDGE_NUMBER  = 2;

const ERROR_MESSAGE_TIMEOUT = 3000;


let graphObject;




let renderingMode = CIRCULAR_GRAPH_RENDERING;



/////////////////////////////////////////////////////////////////////////////////
/*                      EVENT HANDLERS SECTION                                */
/////////////////////////////////////////////////////////////////////////////////


const setEventHandlers  = () => {
    console.log("setEventHandlers");

  
     window.addEventListener("resize", windowResizeHandler );
     document.addEventListener('keydown', keydownHandler );


     const dfsButton = document.getElementById("dfs-button");
     dfsButton.addEventListener("click", dfsButtonClickHandler );

     const dfsAllPathButton = document.getElementById("dfs-all-path-button");
     dfsAllPathButton.addEventListener("click", dfsAllPathButtonClickHandler );


    //  const radioButtons = ["circular-rendering","concentric-rendering","random-rendering"];


    //  radioButtons.forEach( radioID => {

    //     const radioButton = document.getElementById(radioID);
    //     radioButton.addEventListener("click", renderingButtonClickHandler );

    //  });
     

}

const  keydownHandler = (event)  => {
        
    if ( event.key === 'Escape') {
     
        hideWarningMessage();
    }
   
}


const windowResizeHandler = () => {


    const canvas = document.getElementById("graph-canvas");
    canvas.width = window.innerWidth - 60;

    render();        
}

const dfsButtonClickHandler  = () => {

    const value = document.getElementById("NodeToWorkOn").value;

    if( isNaN(value) )   {
        displayWarningMessage("Not numeric value entered!");
        return;
    }
    

      if ( (value < 0) || (value > graph.size()) ) {

        displayWarningMessage("Invalid Node Index entered!");
        return;
      }
    
      graph.setSelectedNode(value);

      render();

}

const dfsAllPathButtonClickHandler  = () => {


    const nbrNodes = graph.size();

    console.log("Find path for all " + nbrNodes + "Nodes");

    for (let i=0;i<nbrNodes;i++) {

        graph.setSelectedNode(i);
        const path = graph.DFS(i);
        console.log(`${i} - ${path}`);

        if (path.length === nbrNodes) 
            console.log("%cComplete",'color: #00ff00');
        else
            console.log(`%cPartial ${path.length}`,'color: #ff0000');
    }
}


function initBellman () {

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
    
    // BellmanFord(graphObject, 0);
}





/////////////////////////////////////////////////////////////////////////////////
/*                        CORE METHODS  SECTION                                */
/////////////////////////////////////////////////////////////////////////////////

export const init = () => {


    initBellman();
    setEventHandlers();
}



export const render = () => {

    console.log("Render called...");
    var canvas = document.getElementById("graph-canvas");
    canvas.width = window.innerWidth - 60;

    BellmanFord(graphObject, 0);

    // Before
    // let renderObject = new GraphRender(canvas,graph,renderingMode);
    // renderObject.draw();
    // updateGraphDetailSection();

    let renderObject = new GraphRender(canvas,graphObject,renderingMode);
    renderObject.draw();
    //updateGraphDetailSection();

    console.log("Render called...");


     
   
}



/////////////////////////////////////////////////////////////////////////////////
/*                        UTILITY METHODS  SECTION                             */
/////////////////////////////////////////////////////////////////////////////////


const displayWarningMessage = (msg) => {


    const errorWarningSection  = document.getElementById("warning-section");
    const errorWarningMsg  = document.getElementById("error-warning-msg");


    errorWarningSection.style = "visibility: visible;"
    errorWarningMsg.innerHTML = msg;


    window.setTimeout(hideWarningMessage, ERROR_MESSAGE_TIMEOUT );
} 

const hideWarningMessage= () => {

    const errorWarningSection  = document.getElementById("warning-section");
    const errorWarningMsg  = document.getElementById("error-warning-msg");

    errorWarningSection.style = "visibility: hidden;"
    errorWarningMsg.innerHTML = " "

}




// The Graph Detail Section is at the bottom of the screen, under the Canvas
const updateGraphDetailSection  = () => {

    
    const nbrNodes =  graph.size();
    for (let i=0;i<nbrNodes;i++) {

        const nodeValue = Math.round( Math.random() * MAX_NODE_VALUE ) + 1;    
        console.log(i + " value is " + " nodeValue, edges --> " + graph.getEdgesForNode(i));
    }

    document.getElementById("NodeTotalCount").innerHTML = nbrNodes;
}



const getRandomEdgeIndexes = (currentIndex,nbrNodes) => {

    const nbrEdges = Math.round( Math.random() * MAX_EDGE_NUMBER ) + 1;
    const indexes = [];


    for (let j=0;j<nbrEdges; ) {

        const otherNodeIndex = Math.round( Math.random() * (nbrNodes-1) );

        if ( !indexes.includes(otherNodeIndex) && otherNodeIndex !== currentIndex ){
            
            indexes.push(otherNodeIndex);
            j++;
        }
    }

    return indexes;
}




