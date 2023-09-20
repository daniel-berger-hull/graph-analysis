"use strict";

// a structure to represent a connected, directed and
// weighted graph
export class Edge {
    constructor(src, dest, weight) {
        this.src = src;
        this.dest = dest;
        this.weight = weight;
    }
}
    
export class GraphObject {
    constructor(nbrVertex, nbrEdges) {

        this.nbrVertex = nbrVertex;
        this.nbrEdges = nbrEdges;
        this.edge = [];

        this.init(nbrVertex,nbrEdges);
    }

    init(nbrVertex, nbrEdges) {
        //const graph = new Graph(V, E);
        for (let i = 0; i < nbrEdges; i++) {
            this.edge[i] = new Edge();
        }
        return this;
    }

    size() {
        return this.nbrVertex;
    }

    getEdgesForNode(v) {

        this.#validateNodeIndex(v, "getEdgesForNode");

        const results = [];


        this.edge.forEach(nextEdge => {

            if (nextEdge.src === v) {
                results.push(nextEdge);
            }
           //console.log(nextEdge);
        });

        return results;
        //return this.adj[v];
    }


    #validateNodeIndex(i, methodName) {

//        if (  (i < 0) || (i > this.adj.length))  
        if (  (i < 0) || (i > this.nbrVertex))  
            throw "Invalid Node passed to method " + methodName + " (v is " + i + " and the graph has a maximum of " + this.nbrVertex + ")";
    }

    #validateNodeValue(val, methodName) {

        if (  val < 0)  
            throw "Invalid Node value passed to method " + methodName + " (value is " + val + ")" ;
    }

    printArr(dist) {
        console.log("Vertex Distance from Source");
        for (let i = 0; i < this.nbrVertex; i++) {

             console.log(`${i} \t\t ${dist[i]}`);
         }
     }
}
    

    

    
export function BellmanFord(graph, src) {
   const V = graph.nbrVertex;
    const E = graph.nbrEdges;
    const dist = [];
    
    for (let i = 0; i < V; i++) {
        dist[i] = Number.MAX_SAFE_INTEGER;
    }
    dist[src] = 0;
    
    for (let i = 1; i <= V - 1; i++) {
        for (let j = 0; j < E; j++) {
        const u = graph.edge[j].src;
        const v = graph.edge[j].dest;
        const weight = graph.edge[j].weight;
        if (dist[u] !== Number.MAX_SAFE_INTEGER && dist[u] + weight < dist[v]) {
            dist[v] = dist[u] + weight;
        }
        }
    }
    
    for (let i = 0; i < E; i++) {
        const u = graph.edge[i].src;
        const v = graph.edge[i].dest;
        const weight = graph.edge[i].weight;
        if (dist[u] !== Number.MAX_SAFE_INTEGER && dist[u] + weight < dist[v]) {
        console.log("Graph contains negative weight cycle");
        return;
        }
    }

        graph.printArr(dist);
    }
    
    // Driver program to test methods of graph class
        
    // Create a graph given in the above diagram
    
    // export function textBellman () {



    //     const V = 5;
    //     const E = 8;
    //     const graph = new Graph(V, E);

    //     graph.edge[0] = new Edge(0, 1, 1);
    //     graph.edge[1] = new Edge(0, 2, 4);
    //     graph.edge[2] = new Edge(1, 2, 3);
    //     graph.edge[3] = new Edge(1, 3, 2);
    //     graph.edge[4] = new Edge(1, 4, 2);
    //     graph.edge[5] = new Edge(3, 2, 5);
    //     graph.edge[6] = new Edge(3, 1, 1);
    //     graph.edge[7] = new Edge(4, 3, 3);
        
    //     BellmanFord(graph, 0);
    // }
    