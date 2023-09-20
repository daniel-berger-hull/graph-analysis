import { GraphObject }      from '../model/GraphModel';

import { CIRCULAR_GRAPH_RENDERING  , CONCENTRIC_GRAPH_RENDERING  ,RANDOM_GRAPH_RENDERING  } from './RenderingConstants.js';


export type CanvasSpecs = { width: number; height: number; };
export type Position    = { xCenter: number; yCenter : number; }
export type Point       = { x: number; y : number; }


export function determinePos(graph : GraphObject, canvasSpecs : CanvasSpecs, renderingType : number) :  Point[] {

 
    let xCenter = canvasSpecs.width / 2;
    let yCenter = canvasSpecs.height / 2;

    let dim = (xCenter > yCenter) ? yCenter: xCenter;
    const radius = Math.round( dim  * 0.75);

    const emptyArray : Point[] = [];

    switch (renderingType) {
        case CIRCULAR_GRAPH_RENDERING:
            return  circularAnglePositions( graph.size(), {xCenter: xCenter, yCenter: yCenter}, radius );
        case CONCENTRIC_GRAPH_RENDERING:
            return  concentricPositions( graph, {xCenter: xCenter, yCenter: yCenter}, radius );
        case RANDOM_GRAPH_RENDERING:
            return randomPositions(graph  ,   {xCenter: xCenter, yCenter: yCenter},radius);  

    }

    console.log('%cdeterminePos: Should not return an empty array!!!','color:red');
    return  emptyArray;
                                         
}


function circularAnglePositions(n : number, centerPos : Position, radius : number ) : Point[]{
    let positions : Point[] = [];
    const angle = 2*Math.PI / n;

    let currentAngle = 0;
    for (let i=0;i<n;i++) {

        const x = centerPos.xCenter - Math.round( radius * Math.sin(currentAngle) ); 
        const y = centerPos.yCenter - Math.round( radius * Math.cos(currentAngle) ); 

        //console.log( i + " [x,y] = " + x + "," + y);
        currentAngle += angle;

        positions.push( {x:x, y:y} );
    }

    return positions;
}


function concentricPositions(graph : GraphObject, centerPos : Position, radius : number ) :  Point[] {

    const n =  graph.size();
    let positions : Point[] = [];
//    let finalPositions = new Array(n);
    let finalPositions :  Point[]= [];
    
   
    

    //If there are to few  nodes (Like 4 or less), there is no point to use concentric circle for the rendering, and simple circle rendering will be ok...
    if (n <= 4)   return  circularAnglePositions( n, centerPos, radius );

    radius = 60;
  

    const nodeListByEdgeCount = getEdgeCountByNode(graph);

    //    3-[B], 2-[A,D], 1-[C]

    console.log("Display Nodes by edges count:")

    for (const edgeCount of nodeListByEdgeCount.keys()) {   

        console.log(`key ${edgeCount} --> ${nodeListByEdgeCount.get(edgeCount)}`);        
        const nodeList = nodeListByEdgeCount.get(edgeCount);

        let positionsAtThisLevel : Point[] = [];
        if (nodeList.length > 1)
            positionsAtThisLevel = circularAnglePositions( nodeList.length, centerPos , radius );
        else
            positionsAtThisLevel.push( {x:centerPos.xCenter, y:centerPos.yCenter}  );
1

        positions = positions.concat(positionsAtThisLevel);

        //Transfer the positions in the final postion array...
        
        //// nodeList should be an array of node index here?

        //********************************************************** */
//         nodeList.forEach( nodeIndex : number => {  

//             const nextPos = positionsAtThisLevel.pop();
// //            finalPositions[nodeIndex] = nextPos;
// //            finalPositions.push(nextPos);
//             finalPositions.push( {x:0, y:0} );
//         });


        radius += 60;
    }


    //positions =  randomPositions(graph , centerPos,radius);  

    // return positions;
    return finalPositions;
}


// function concentricPositions(graph : GraphObject, centerPos : Position, radius : number ) :  Point[] {


function randomPositions(graph : GraphObject, centerPos : Position, radius : number )  :  Point[] {
    const n =  graph.size();
    let positions = [];
 

    for (let i=0;i<n;i++) {

        const x = centerPos.xCenter - Math.round( 2 * radius * Math.random() - radius); 
        const y = centerPos.yCenter - Math.round( 2 * radius * Math.random() - radius); 

        positions.push( {x:x, y:y} );
    }

    return positions;


}



  //   This method sorts the  node by edges count (most edge at the top) and returns a map where the key-value is the EdgeCount-NodeList
  //   For instance, for the Nodes:
  //        A (2 edges), B (3 edges), C (1 edge) and D (2 edges)
  //        the node A & D will be grouped toghetter under the key '2'
  //    Result:   3-[B], 2-[A,D], 1-[C]
  //    Note: the keys of the map will be sorted in reversed order, as it will be more convenient for the rendering, as the nodes with the 
  //          highest edges count has to be placed first (in the center), and we go with nodes with lower and lower edges count toward the outside
  function getEdgeCountByNode(graph : GraphObject)  {


    const nodeListByEdgeCount = new Map();
    let positions = [];
    const n =  graph.size();



    // 1 - Group the nodes by their edges connected to them... The map object 'nodeListByEdgeCount' should end up with a key-pair of 'edgeCount'-'List Of index of nodes'
    for (let i=0;i<n;i++){
      const edges = graph.getEdgesForNode(i);
      const edgeCount = edges.length;

      let nodeList = nodeListByEdgeCount.get(edgeCount);

      if (nodeList === undefined) {
          nodeList = [i];
      } else {
          nodeList.push(i);
      }

      nodeListByEdgeCount.set(edgeCount, nodeList);
    }


   

    // 2 - Get the index in the node-map-by-edge (nodeListByEdgeCount) in reverse order. The nodes at the beginning (with most edge connection) will be first, and placed in the center and we are going outward, with the nodes with less and less edge connections...
    let nodeIndexes = [];
    for (const x of nodeListByEdgeCount.keys()) {   nodeIndexes.push(x)   }
    nodeIndexes.sort(function(a, b){return b - a});


    // Will return the result in another map, but this time, with the keys correctly inserted in reverse order...
    const resultMap = new Map();
    nodeIndexes.forEach (nodeIndex => { 

        resultMap.set(nodeIndex, nodeListByEdgeCount.get(nodeIndex));
    })

    return resultMap;

}
