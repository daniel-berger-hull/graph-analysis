var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GraphObject_instances, _GraphObject_validateNodeIndex, _GraphObject_validateNodeValue;
const NODE_NOT_DEFINED = -10;
// a structure to represent a connected, directed and
// weighted graph
export class Edge {
    constructor(src = NODE_NOT_DEFINED, dest = NODE_NOT_DEFINED, weight = NODE_NOT_DEFINED) {
        this.src = src;
        this.dest = dest;
        this.weight = weight;
    }
}
export class GraphObject {
    constructor(nbrVertex, nbrEdges) {
        _GraphObject_instances.add(this);
        this.nbrVertex = nbrVertex;
        this.nbrEdges = nbrEdges;
        this.edge = [];
        this.init(nbrVertex, nbrEdges);
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
        __classPrivateFieldGet(this, _GraphObject_instances, "m", _GraphObject_validateNodeIndex).call(this, v, "getEdgesForNode");
        let results = [];
        this.edge.forEach(nextEdge => {
            if (nextEdge.src === v) {
                results.push(nextEdge);
            }
        });
        return results;
    }
    printArr(dist) {
        console.log("Vertex Distance from Source");
        for (let i = 0; i < this.nbrVertex; i++) {
            console.log(`${i} \t\t ${dist[i]}`);
        }
    }
}
_GraphObject_instances = new WeakSet(), _GraphObject_validateNodeIndex = function _GraphObject_validateNodeIndex(i, methodName) {
    if ((i < 0) || (i > this.nbrVertex))
        throw "Invalid Node passed to method " + methodName + " (v is " + i + " and the graph has a maximum of " + this.nbrVertex + ")";
}, _GraphObject_validateNodeValue = function _GraphObject_validateNodeValue(val, methodName) {
    if (val < 0)
        throw "Invalid Node value passed to method " + methodName + " (value is " + val + ")";
};
// export function BellmanFord(graph, src) {
//     const V = graph.nbrVertex;
//      const E = graph.nbrEdges;
//      const dist = [];
//      for (let i = 0; i < V; i++) {
//          dist[i] = Number.MAX_SAFE_INTEGER;
//      }
//      dist[src] = 0;
//      for (let i = 1; i <= V - 1; i++) {
//          for (let j = 0; j < E; j++) {
//          const u = graph.edge[j].src;
//          const v = graph.edge[j].dest;
//          const weight = graph.edge[j].weight;
//          if (dist[u] !== Number.MAX_SAFE_INTEGER && dist[u] + weight < dist[v]) {
//              dist[v] = dist[u] + weight;
//          }
//          }
//      }
//      for (let i = 0; i < E; i++) {
//          const u = graph.edge[i].src;
//          const v = graph.edge[i].dest;
//          const weight = graph.edge[i].weight;
//          if (dist[u] !== Number.MAX_SAFE_INTEGER && dist[u] + weight < dist[v]) {
//          console.log("Graph contains negative weight cycle");
//          return;
//          }
//      }
//          graph.printArr(dist);
//      }
