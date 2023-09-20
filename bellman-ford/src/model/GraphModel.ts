const NODE_NOT_DEFINED : number = -10;


// a structure to represent a connected, directed and
// weighted graph
export class Edge {

    src : number;
    dest : number;
    weight : number;
    

    constructor(src : number = NODE_NOT_DEFINED, 
                dest : number = NODE_NOT_DEFINED, 
                weight : number = NODE_NOT_DEFINED) {
        this.src = src;
        this.dest = dest;
        this.weight = weight;
    }
}
    

export class GraphObject {

    nbrVertex : number;
    nbrEdges : number
    edge : Edge[];
    selectedNode : number;
    

    
    

    constructor(nbrVertex : number, nbrEdges : number) {

        this.nbrVertex = nbrVertex;
        this.nbrEdges = nbrEdges;
        this.edge = [];
        this.selectedNode = 0;

        this.init(nbrVertex,nbrEdges);
    }

    init(nbrVertex : number, nbrEdges : number) {
        //const graph = new Graph(V, E);
        for (let i = 0; i < nbrEdges; i++) {
            this.edge[i] = new Edge();
        }
        return this;
    }


    getSelectedNode() : number          {   return this.selectedNode; }
    setSelectedNode(index : number)     {   this.selectedNode = ( index>=0 && index < this.nbrVertex) ? index : 0; }


    size() {
        return this.nbrVertex;
    }

    getEdgesForNode(v : number) : Edge[] {

        this.#validateNodeIndex(v, "getEdgesForNode");

        let results : Edge[] = [];


        this.edge.forEach(nextEdge => {

            if (nextEdge.src === v) {
                results.push(nextEdge);
            }
        });

        return results;
    }

    #validateNodeIndex(i : number, methodName : string) {

       if (  (i < 0) || (i > this.nbrVertex))  
           throw "Invalid Node passed to method " + methodName + " (v is " + i + " and the graph has a maximum of " + this.nbrVertex + ")";
    }
        
    #validateNodeValue(val : number, methodName : string) {
        
        if (  val < 0)  
             throw "Invalid Node value passed to method " + methodName + " (value is " + val + ")" ;
    }

    printArr(dist : number[],src : number) {
        console.log("Vertex Distance from Source " + src);
        for (let i = 0; i < this.nbrVertex; i++) {

             console.log(`${i} \t\t ${dist[i]}`);
         }
     }
        

}

   
export function BellmanFord(graph : GraphObject, src : number)  : number[]{
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
            return dist;
         }
     }
 
         graph.printArr(dist,src);
     
        return dist; 
    }