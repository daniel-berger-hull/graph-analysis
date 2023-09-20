








function randomPositions(graph, centerPos,radius) {
    const n =  graph.size();
    let positions = [];
 

    for (let i=0;i<n;i++) {

        const x = centerPos.xCenter - Math.round( 2 * radius * Math.random() - radius); 
        const y = centerPos.yCenter - Math.round( 2 * radius * Math.random() - radius); 

        positions.push( {x:x, y:y} );
    }

    return positions;


}

