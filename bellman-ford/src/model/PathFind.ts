 
import { GraphObject, EdgeParams, GraphState }  from './GraphModel.js'


const INF = 2147483647;


export function BellmanFord(graph : GraphObject,  src : number) {
    
     const V = graph.getNbrNodes();
     const E = graph.getNbrEdges();
     const dist : number[] = [];
     
     for (let i = 0; i < V; i++) {
         dist[i] = Number.MAX_SAFE_INTEGER;
     }
     dist[src] = 0;
     

     for (let i = 1; i <= V - 1; i++) {
         for (let j = 0; j < E; j++) {
         const u      = graph.getEdge(j).fromNode;
         const v      = graph.getEdge(j).toNode;
         const weight = graph.getEdge(j).weight;
         if (dist[u] !== Number.MAX_SAFE_INTEGER && dist[u] + weight < dist[v]) {
             dist[v] = dist[u] + weight;
         }
         }
     }
     
     for (let i = 0; i < E; i++) {
         const u      = graph.getEdge(i).fromNode;
         const v      = graph.getEdge(i).toNode;
         const weight = graph.getEdge(i).weight;
         if (dist[u] !== Number.MAX_SAFE_INTEGER && dist[u] + weight < dist[v]) {
            console.log("Graph contains negative weight cycle");
            return;
         }
     }
 
         //graph.printArr(dist);
     }
     
 
 
 

//  params:   graph :  GraphObject
//            src:  integer  --> Starting node index from which we need to find the distance and path to every other nodes in the graphObject
//  return:   



// export function shortestPath(graph : GraphObject,src : number) {
    export function shortestPath(graph : GraphObject, graphState : GraphState) {
 
         const nbrNodes : number = graph.getNbrNodes();
           // Create a priority queue to store vertices that are being preprocessed. This is weird syntax in C++.
           // Refer below link for details of this syntax
           // https://www.geeksforgeeks.org/implement-min-heap-using-stl/
           let pq = [];
    
           // Create a vector for distances and initialize all
           // distances as infinite (INF)
           let distances = new Array(nbrNodes).fill(INF);
           let counts = new Array(nbrNodes).fill(0);
           
           // This is not a perfect solution, as if no character are added at the beginning of the string, it won't be saw as a string, if creates problem as we insert node index...
          // let allLetters = new Array(nbrNodes).fill('P');

           let  paths = new Array(nbrNodes);
           for(let i = 0; i < paths.length; i++){ 
             paths[i] = [];
           }

           
           const src : number = graphState.getStartNodePath();

        
           // Insert source itself in priority queue and initialize
           // its distance as 0.
           pq.push([0, src]);
 
           distances[src] = 0;
    
           /* Looping till priority queue becomes empty (or all distances are not finalized) */
           while (pq.length > 0) {
               // The first vertex in pair is the minimum distance vertex, extract it from priority queue. vertex label is stored in second of pair (it
               // has to be done this way to keep the vertices sorted distance (distance must be first item in pair)
               let u = pq[0][1];
               pq.shift();
 
             const connectedNodes : number[] = [];
             const edgesForThisNode :  EdgeParams[] = graph.getEdgesForNode(u);    // Returns An array of class Edges
               
             edgesForThisNode.forEach(nextEdge => {  connectedNodes.push(nextEdge.toNode);   }  );
 
 
               // 'i' is used to get all adjacent vertices of a vertex
             for(let i = 0; i < connectedNodes.length; i++){
                                    
                   // Get vertex label and weight of current adjacent of u.
                 let v = connectedNodes[i];
                 let currrentEdge = edgesForThisNode[i];
                 let weight =  currrentEdge.weight;
                 
                   // If there is shorted path to v through u.
                   if (distances[v] > distances[u] + weight) {
                       // Updating distance of v
                       distances[v] = distances[u] + weight;
                       pq.push([distances[v], v]);
                       pq.sort((a, b) =>{
                           if(a[0] == b[0]) return a[1] - b[1];
                           return a[0] - b[0];
                       });
 
                       counts[v] = counts[u] + 1;
                       paths[v] = [...paths[u],u];
                   }
               }
           }

           for (let i=0;i<paths.length;i++)   paths[i].push(i);
           

           // Convert the letters with the path, to a set of arrays, as this is more convenient
            let nodesPath : number[][] = [];
            for (let i=0;i<paths.length;i++)  nodesPath[i] = Array.from( paths[i] );                


            graphState.setDistances(distances);
            graphState.setPaths(nodesPath);
            graphState.valid();

           return { "distances" : distances,
                    "nodesPath" : nodesPath};

   }
   
 