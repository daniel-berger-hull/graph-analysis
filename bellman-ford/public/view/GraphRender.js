var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _GraphRender_instances, _GraphRender_canvas, _GraphRender_graphObject, _GraphRender_renderingMode, _GraphRender_init, _GraphRender_validateParams, _GraphRender_isValidRenderingMode;
import { CIRCULAR_GRAPH_RENDERING, RANDOM_GRAPH_RENDERING } from './RenderingConstants.js';
import { determinePos } from './NodeSpaceLocator.js';
const DIRECTION_GRAPH = true;
export class GraphRender {
    constructor(targetCanvas, graph, renderingMode) {
        _GraphRender_instances.add(this);
        _GraphRender_canvas.set(this, void 0);
        _GraphRender_graphObject.set(this, void 0);
        _GraphRender_renderingMode.set(this, void 0);
        __classPrivateFieldGet(this, _GraphRender_instances, "m", _GraphRender_validateParams).call(this, targetCanvas, graph);
        __classPrivateFieldSet(this, _GraphRender_canvas, targetCanvas, "f");
        __classPrivateFieldSet(this, _GraphRender_graphObject, graph, "f");
        __classPrivateFieldSet(this, _GraphRender_renderingMode, renderingMode, "f");
        __classPrivateFieldGet(this, _GraphRender_instances, "m", _GraphRender_init).call(this);
    }
    getCanvas() { return __classPrivateFieldGet(this, _GraphRender_canvas, "f"); }
    ;
    getGraph() { return __classPrivateFieldGet(this, _GraphRender_graphObject, "f"); }
    ;
    getRenderingMode() { return __classPrivateFieldGet(this, _GraphRender_renderingMode, "f"); }
    ;
    setCanvas(canvas) { __classPrivateFieldSet(this, _GraphRender_canvas, canvas, "f"); }
    ;
    setGraph(graph) { __classPrivateFieldSet(this, _GraphRender_graphObject, graph, "f"); }
    ;
    setRenderingMode(mode) { __classPrivateFieldSet(this, _GraphRender_renderingMode, mode, "f"); }
    ;
    //let test : number;
    renderNode(context, position, // May not be the right type here...
    size, value, isLeaf) {
        context.strokeStyle = "#FBED20";
        context.beginPath();
        context.arc(position.x, position.y, size, 0, 2 * Math.PI);
        context.fillStyle = (isLeaf === true) ? 'blue' : 'white';
        context.fill();
        context.lineWidth = 2;
        context.stroke();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "12px Arial";
        const label = value;
        context.fillStyle = "black";
        context.fillText(label, position.x + 1, position.y + 1);
        context.fillStyle = (isLeaf === true) ? 'white' : "#0046BE";
        context.fillText(label, position.x, position.y);
    }
    renderSegment(context, startPos, endPos, color, directionnal) {
        context.beginPath();
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(endPos.x, endPos.y);
        context.strokeStyle = color;
        context.lineWidth = 1;
        context.stroke();
        // For the graph where direction exist, draw top of arraw toward the end of the segment
        if (directionnal) {
            let direction = { dx: (startPos.x - endPos.x), dy: (startPos.y - endPos.y) };
            direction.dx = direction.dx * 0.1;
            direction.dy = direction.dy * 0.1;
            context.beginPath();
            context.moveTo(endPos.x, endPos.y);
            context.lineTo(endPos.x + direction.dx, endPos.y + direction.dy);
            context.strokeStyle = "#FF0000";
            //context.stroke(); 
            const newX = (direction.dx * 0.70710) - (direction.dy * 0.70710);
            const newY = (direction.dx * 0.70710) + (direction.dy * 0.70710);
            let rotated = { dx: newX, dy: newY };
            context.beginPath();
            context.moveTo(endPos.x, endPos.y);
            context.lineTo(endPos.x + rotated.dx, endPos.y + rotated.dy);
            context.strokeStyle = "#FF0000";
            context.stroke();
            const newX2 = (direction.dx * 0.70710) + (direction.dy * 0.70710);
            const newY2 = (direction.dx * -0.70710) + (direction.dy * 0.70710);
            let rotated2 = { dx: newX2, dy: newY2 };
            context.beginPath();
            context.moveTo(endPos.x, endPos.y);
            context.lineTo(endPos.x + rotated2.dx, endPos.y + rotated2.dy);
            context.strokeStyle = "#FF0000";
            context.stroke();
        }
    }
    renderLoopSegment(context, position, size, color) {
        context.beginPath();
        context.arc(position.x, position.y - (size * 1.3), size, 0, 2 * Math.PI);
        context.lineWidth = 1;
        context.stroke();
    }
    drawSegments(ctx, graph, nodePosArray) {
        console.log("%c drawSegments", "color: red");
        for (let i = 0; i < graph.size(); i++) {
            const startNodePos = { x: nodePosArray[i].x,
                y: nodePosArray[i].y };
            const edges = graph.getEdgesForNode(i);
            edges.forEach(nextEdge => {
                if (nextEdge.dest !== nextEdge.src) {
                    // console.log(i + " to " + index);
                    const endNodePos = { x: nodePosArray[nextEdge.dest].x, y: nodePosArray[nextEdge.dest].y };
                    this.renderSegment(ctx, startNodePos, endNodePos, "#00FF00", DIRECTION_GRAPH);
                }
                else {
                    console.log("Render: an edge on the same node detected!");
                    this.renderLoopSegment(ctx, startNodePos, 10, "#00FF00");
                }
            });
        }
    }
    drawNodes(ctx, nodePosArray) {
        // Draw the node on top of the segments...
        nodePosArray.forEach((pos, index) => {
            this.renderNode(ctx, pos, 10, index.toString(), true);
        });
    }
    // drawPath(ctx : CanvasRenderingContext2D, graph : GraphObject, nodePosArray : Point[]) {
    //     const seletectedNodeIndex = graph.getSelectedNode();
    //     const path = graph.DFS(seletectedNodeIndex);
    //     console.log("Display path from node :" + seletectedNodeIndex);
    //     let startIndex = path[0];
    //     let startNodePos =   { x: nodePosArray[startIndex].x,        
    //                            y: nodePosArray[startIndex].y };        
    //     for (let i=1;i<path.length;i++) {
    //         let endIndex = path[i];
    //         let endNodePos =   {   x: nodePosArray[endIndex].x,        
    //                                y: nodePosArray[endIndex].y }; 
    //         this.renderSegment(  ctx,  startNodePos,  endNodePos, "#FF0000"); 
    //         startNodePos = endNodePos;
    //     }
    // }
    getCanvasSpecs() {
        return { width: __classPrivateFieldGet(this, _GraphRender_canvas, "f").width,
            height: __classPrivateFieldGet(this, _GraphRender_canvas, "f").height };
    }
    draw() {
        console.log('Will draw using the GraphRender..');
        let ctx = __classPrivateFieldGet(this, _GraphRender_canvas, "f").getContext("2d");
        if (ctx === null)
            return;
        const graph = __classPrivateFieldGet(this, _GraphRender_graphObject, "f");
        const nodePositions = determinePos(graph, this.getCanvasSpecs(), this.getRenderingMode());
        this.drawSegments(ctx, graph, nodePositions);
        //this.drawPath(ctx, graph, nodePositions);
        this.drawNodes(ctx, nodePositions);
    }
}
_GraphRender_canvas = new WeakMap(), _GraphRender_graphObject = new WeakMap(), _GraphRender_renderingMode = new WeakMap(), _GraphRender_instances = new WeakSet(), _GraphRender_init = function _GraphRender_init() {
    console.log('init');
    //Note the init may be removed later if no usage is done...
}, _GraphRender_validateParams = function _GraphRender_validateParams(targetCanvas, graph) {
    if (targetCanvas === null || typeof targetCanvas === "undefined")
        throw "You MUST provide a valid Canvas object to the GraphRender class!";
    if (graph === null || typeof graph === "undefined")
        throw "You MUST provide a valid Graph object GraphRender class!";
}, _GraphRender_isValidRenderingMode = function _GraphRender_isValidRenderingMode(mode) {
    if (mode < CIRCULAR_GRAPH_RENDERING || mode > RANDOM_GRAPH_RENDERING)
        return false;
    else
        return true;
};
