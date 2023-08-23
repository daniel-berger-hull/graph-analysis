import { CIRCULAR_GRAPH_RENDERING } from './view/RenderingConstants.js';
import { GraphObject, Edge } from './model/GraphModel.js';
const MAX_NODE_NUMBER = 15;
const MAX_NODE_VALUE = 50;
const MAX_EDGE_NUMBER = 2;
const ERROR_MESSAGE_TIMEOUT = 3000;
let renderingMode = CIRCULAR_GRAPH_RENDERING;
let graphObject;
/////////////////////////////////////////////////////////////////////////////////
/*                      EVENT HANDLERS SECTION                                */
/////////////////////////////////////////////////////////////////////////////////
const setEventHandlers = () => {
    console.log("setEventHandlers");
    window.addEventListener("resize", windowResizeHandler);
    document.addEventListener('keydown', keydownHandler);
    let dfsButton;
    dfsButton = document.getElementById("dfs-button");
    if (dfsButton !== null)
        dfsButton.addEventListener("click", dfsButtonClickHandler);
    let dfsAllPathButton;
    dfsAllPathButton = document.getElementById("dfs-all-path-button");
    if (dfsAllPathButton !== null)
        dfsAllPathButton.addEventListener("click", dfsAllPathButtonClickHandler);
    //  const radioButtons = ["circular-rendering","concentric-rendering","random-rendering"];
    //  radioButtons.forEach( radioID => {
    //     const radioButton = document.getElementById(radioID);
    //     radioButton.addEventListener("click", renderingButtonClickHandler );
    //  });
};
const keydownHandler = (event) => {
    if (event.key === 'Escape') {
        hideWarningMessage();
    }
};
const windowResizeHandler = () => {
    let canvas = document.getElementById('graph-canvas');
    canvas.width = window.innerWidth - 60;
    render();
};
const dfsButtonClickHandler = () => {
    let strValue;
    let value = -1;
    const nodeControl = document.getElementById("NodeToWorkOn");
    if (nodeControl !== null) {
        strValue = nodeControl.value;
        value = parseInt(strValue);
    }
    if (isNaN(value)) {
        displayWarningMessage("Not numeric value entered!");
        return;
    }
    //**if ( (value < 0) || (value > graph.size()) ) {
    if ((value < 0)) {
        displayWarningMessage("Invalid Node Index entered!");
        return;
    }
    //graph.setSelectedNode(value);
    render();
};
const dfsAllPathButtonClickHandler = () => {
    //*** */
    // const nbrNodes = graph.size();
    // console.log("Find path for all " + nbrNodes + "Nodes");
    // for (let i=0;i<nbrNodes;i++) {
    //     graph.setSelectedNode(i);
    //     const path = graph.DFS(i);
    //     console.log(`${i} - ${path}`);
    //     if (path.length === nbrNodes) 
    //         console.log("%cComplete",'color: #00ff00');
    //     else
    //         console.log(`%cPartial ${path.length}`,'color: #ff0000');
    // }
    //** */
};
function initBellman() {
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
export const init = () => {
    initBellman();
    setEventHandlers();
};
export const render = () => {
    console.log("Render called...");
    updateGraphDetailSection();
};
/////////////////////////////////////////////////////////////////////////////////
/*                        UTILITY METHODS  SECTION                             */
/////////////////////////////////////////////////////////////////////////////////
const displayWarningMessage = (msg) => {
    let errorWarningSection;
    errorWarningSection = document.getElementById("warning-section");
    let errorWarningMsg;
    errorWarningMsg = document.getElementById("error-warning-msg");
    if (errorWarningSection !== null)
        errorWarningSection.style.visibility = "visible";
    if (errorWarningMsg !== null)
        errorWarningMsg.innerHTML = msg;
    window.setTimeout(hideWarningMessage, ERROR_MESSAGE_TIMEOUT);
};
const hideWarningMessage = () => {
    let errorWarningSection;
    errorWarningSection = document.getElementById("warning-section");
    let errorWarningMsg;
    errorWarningMsg = document.getElementById("error-warning-msg");
    if (errorWarningSection !== null)
        errorWarningSection.style.visibility = "hidden";
    if (errorWarningMsg !== null)
        errorWarningMsg.innerHTML = " ";
};
// The Graph Detail Section is at the bottom of the screen, under the Canvas
const updateGraphDetailSection = () => {
    const nbrNodes = graphObject.size();
    for (let i = 0; i < nbrNodes; i++) {
        const nodeValue = Math.round(Math.random() * MAX_NODE_VALUE) + 1;
        console.log(i + " value is " + " nodeValue, edges --> " + graphObject.getEdgesForNode(i));
    }
    let nodeCount;
    nodeCount = document.getElementById("NodeTotalCount");
    if (nodeCount !== null)
        nodeCount.innerHTML = nbrNodes.toString();
};
const getRandomEdgeIndexes = (currentIndex, nbrNodes) => {
    const nbrEdges = Math.round(Math.random() * MAX_EDGE_NUMBER) + 1;
    const indexes = [];
    for (let j = 0; j < nbrEdges;) {
        const otherNodeIndex = Math.round(Math.random() * (nbrNodes - 1));
        if (!indexes.includes(otherNodeIndex) && otherNodeIndex !== currentIndex) {
            indexes.push(otherNodeIndex);
            j++;
        }
    }
    return indexes;
};