"use strict";



export class Graph {


    #nodeIndexesPath;
    
  
    // Constructor
    constructor(v)
    {
        this.V = v;
        this.adj = new Array(v);
        this.values = new Array(v);
        for(let i = 0; i < v; i++)
            this.adj[i] = [];

        this.selectedNode = 0;
    }

    size() {
        return this.V;
    }

    getSelectedNode()         {   return this.selectedNode; }
    setSelectedNode(index)    {   this.selectedNode = ( index>=0 && index < this.V) ? index : 0; }

    
    // Function to add an edge into the graph
    addEdge(v, w)
    {
        // Add w to v's list.
        this.adj[v].push(w);
    }

    getEdgesForNode(v) {

        this.#validateNodeIndex(v, "getEdgesForNode");

        return this.adj[v];
    }

    getNodeValue(v) {

        this.#validateNodeIndex(v, "getNodeValue");

        return this.values[v];
    }

    setNodeValue(v,val) {

        this.#validateNodeIndex(v, "setNodeValue");
        this.#validateNodeValue(val, "setNodeValue");

        this.values[v] = val;
    }


    #validateNodeIndex(i, methodName) {

        if (  (i < 0) || (i > this.adj.length))  
            throw "Invalid Node passed to method " + methodName + " (v is " + i + " and the graph has a maximum of " + this.adj.length + ")";
    }

    #validateNodeValue(val, methodName) {

        if (  val < 0)  
            throw "Invalid Node value passed to method " + methodName + " (value is " + val + ")" ;
    }
     
    // A function used by DFS
    DFSUtil(v, visited)
    {
         
        // Mark the current node as visited and print it
        visited[v] = true;
       // console.log(v + " ");

        this.#nodeIndexesPath.push(v);
  
        // Recur for all the vertices adjacent to this
        // vertex
        for(let i of this.adj[v].values())
        {
            let n = i
            if (!visited[n])
                this.DFSUtil(n, visited);
        }
    }
     
    // The function to do DFS traversal.
    // It uses recursive
    // DFSUtil()
    DFS(v)
    {
         this.#nodeIndexesPath = [];
        
        // Mark all the vertices as
        // not visited(set as
        // false by default in java)
        let visited = new Array(this.V);
        for(let i = 0; i < this.V; i++)
            visited[i] = false;
  
        // Call the recursive helper
        // function to print DFS
        // traversal
        this.DFSUtil(v, visited);

        // console.log("DFS search Result, staring node index " + this.getSelectedNode());
        console.log(this.#nodeIndexesPath);

        return this.#nodeIndexesPath;
    }


    toString() {
        console.log("Graph toString()");

    }
    
}