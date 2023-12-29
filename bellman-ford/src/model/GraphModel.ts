
const NODE_NOT_DEFINED : number = -10;

export type EdgeParams = {
    fromNode : number;
    toNode   : number;
    weight   : number;
};

export const INF : number = 2147483647;

export const DEFAULT_NODE_VALUE : number  = 9999;
export const DEFAULT_EDGE_WEIGHT : number = 1;


export const NO_EDGES_DEFINED : number = 0;


export class GraphObject {

    //#nodeIndexesPath : number;
    #nbrNodes : number;
    #nbrEdges : number;   // Nov 3: This value appears to be not required, as the getNbrEdges exists for this...

    #startNodePath : number;
    #endNodePath : number;
    #selectedNode : number;

    #edges : EdgeParams[];
    #values : number[];



    constructor(nbrNodes:number) {

        this.#nbrNodes = nbrNodes;
        this.#nbrEdges = NO_EDGES_DEFINED;
        
        this.#edges = [];

        // Nov 3 Added to align with the older Graph.js --> Each node had no values in GraphObject
        //this.values = new Array(nbrNodes);
        this.#values = new Array(nbrNodes);
        
        this.#selectedNode = 0;

        this.#startNodePath = NODE_NOT_DEFINED;
        this.#endNodePath   = NODE_NOT_DEFINED;

    }

    size() {
        return this.#nbrNodes;
    }

    getNbrNodes()                   {  return this.#nbrNodes;        }
    getNbrEdges()                   {  return this.#edges.length;    }

    getSelectedNode()               {   return this.#selectedNode;   }
    getStartNodePath()              {   return this.#startNodePath;  }
    getEndNodePath()                {   return this.#endNodePath;    }

    setSelectedNode(index:number)    {   this.#selectedNode = ( index>=0 && index < this.getNbrNodes()) ? index : 0; }
    setStartNodePath(index:number)   {   this.#validateNodeIndex(index,"setStartNodePath");     this.#startNodePath= index; }
    setEndNodePath(index:number)     {   this.#validateNodeIndex(index,"setStartNodePath");     this.#endNodePath  = index; }


    getEdgesForNode(v:number) : EdgeParams[]{

        this.#validateNodeIndex(v, "getEdgesForNode");

        const results : EdgeParams[] = [];
        this.#edges.forEach(nextEdge => {

            if (nextEdge.fromNode === v) {
                results.push(nextEdge);
            }
        });

        return results;
    }

    //Note Dec 27: This method doesn't let you specify details about the value of the new Node. pearhaps a extra version, with a value param would be better...
    addNode() {
        this.#nbrNodes++;
        this.#values.push(DEFAULT_NODE_VALUE);

        return this.#values.length;
    }

  
    addEdge(fromNode : number, toNode  : number) {
        this.addEdgeWithWeight(fromNode, toNode, DEFAULT_EDGE_WEIGHT);
    }


      // Function to add an edge into the graph
    addEdgeWithWeight(fromNode : number, toNode : number, weight : number) {
  
        this.#validateNodeIndex(fromNode, "addEdge");
        this.#validateNodeIndex(toNode, "addEdge");
        this.#validateEdgeWeight(weight, "addEdge");
  
        const newEdge  : EdgeParams = { "fromNode" : fromNode, "toNode" : toNode, "weight": weight};
        this.#edges.push(newEdge);
    }


    addDoubleEdge(fromNode : number, toNode : number) {
        this.addDoubleEdgeWithWeight(fromNode, toNode, DEFAULT_EDGE_WEIGHT);
        this.addDoubleEdgeWithWeight(toNode, fromNode, DEFAULT_EDGE_WEIGHT);
    }

       // Function to add an edge on both direction into the graph. This methods add simplicity when created double linked nodes, as we don't have to call twice the addEdge
    addDoubleEdgeWithWeight(fromNode : number, toNode : number, weight : number) {
  
        this.#validateNodeIndex(fromNode, "addEdge");
        this.#validateNodeIndex(toNode, "addEdge");
        this.#validateEdgeWeight(weight, "addEdge");

        let newEdge : EdgeParams = { "fromNode" : fromNode, "toNode" : toNode, "weight": weight};
        this.#edges.push(newEdge);

        console.log(`addDoubleEdgeWithWeight From ${fromNode} To ${toNode}, new Edge Size is ${this.#edges.length}`)
    }



    getNodeValue(v: number) {

        this.#validateNodeIndex(v, "getNodeValue");

        return this.#values[v];
    }

    setNodeValue(v : number,val : number) {

        this.#validateNodeIndex(v, "setNodeValue");
        this.#validateNodeValue(val, "setNodeValue");

        this.#values[v] = val;
    }


    #validateNodeIndex(i :number, methodName : string) {

        if (  (i < 0) || (i > this.getNbrNodes()))  
            throw "Invalid Node passed to method " + methodName + " (v is " + i + " and the graph has a maximum of " + this.getNbrNodes() + ")";
    }

    #validateNodeValue(val :number, methodName: string) {

        if (val < 0)  
            throw "Invalid Node value passed to method " + methodName + " (value is " + val + ")" ;
    }

    #validateEdgeWeight(weight :number,methodName: string) {

        if (weight < 0)  
            throw "Invalid weight value passed to method " + methodName + " (value is " + weight + ")" ;
    }

    printArr(dist :number) {
        console.log("Vertex Distance from Source --> Not implemented yet");

        for (let i = 0; i < this.getNbrNodes(); i++) {
             //console.log(`${i} \t\t ${dist[i]}`); 
         }
     }

     // Simple creation of a string to see the current content of the graph, for debug purpose 
     toString() : string {

        let result : string[] = [];


        const nbrNodes : number =  this.getNbrNodes();    
        for (let i=0;i<nbrNodes;i++) {
    
    
            let edgesArray : EdgeParams[] = this.getEdgesForNode(i);

            result.push(i + " value is " + this.getNodeValue(i) + " , edges --> " );
            edgesArray.forEach((edge) => {
                result.push(`\tFrom/To [${edge.fromNode},${ edge.toNode}], weight of ${edge.weight}`);
            });   
            result.push("\n");

        }

        result.forEach( (nextString,i) => { console.log(nextString)});
    
        return result.toString();
     }



    // ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // // Nov 3: The DFS functions and the BellmanFord function bellow should be moved into the own class...
        
    // recursiveLevel = 0; 

    // // A function used by DFS
    // DFSUtil(v, visited)
    // {

    //     this.recursiveLevel++;
        
    //     // Mark the current node as visited and print it
    //     visited[v] = true;

    //     this.#nodeIndexesPath.push(v);



    //     // DFS deals with index of node connected, so the code below extra the index for the edges connected to be current node v
    //     const edgesForThisNode = this.getEdgesForNode(v);    // Returns An array of class Edges
    //     const connectedNodes = [];

    //     edgesForThisNode.forEach(nextEdge => {  connectedNodes.push(nextEdge.dest);   }  );


    //     // Nov 3: This is for debug. As today, the DFS result is a bit odd... As it gives [0, 1, 2, 3, 4, 6].
    //     //        But there no edges between 2 and 3!!!
    //     //console.log(`DFSUtil Level: ${this.recursiveLevel}, Start Node: ${v}, Connected Nodes ${connectedNodes}, Index Path: ${this.#nodeIndexesPath} , Visited Array: ${visited}`);

    //     for(let i of connectedNodes) {
    //         let n = i
    //         if (!visited[n])
    //             this.DFSUtil(n, visited);
    //     }

    //     this.recursiveLevel--;
    // }
 
    // // The function to do DFS traversal.
    // // It uses the recursive DFSUtil() method
    // DFS(v)
    // {
    //     this.#nodeIndexesPath = [];
    //     const nbrNodes = this.getNbrNodes();
    //     // Mark all the vertices as not visited(set as false by default in javascript)
    //     let visited = new Array(nbrNodes);
    //     for(let i = 0; i < nbrNodes; i++)
    //         visited[i] = false;

    //     // Call the recursive helper
    //     // function to print DFS
    //     // traversal
    //     this.DFSUtil(v, visited);

    //     // console.log("DFS search Result, staring node index " + this.getSelectedNode());
    //     console.log(this.#nodeIndexesPath);

    //     return this.#nodeIndexesPath;
    // }
}
    