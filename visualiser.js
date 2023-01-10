/**
 * Draws a line between the two given points in the given colour.
 * @param {*} fromX (int): Start x coordinate of line.
 * @param {*} fromY (int): Start y coordinate of line.
 * @param {*} toX (int): End x coordinate of line.
 * @param {*} toY (int): End y coordinate of line.
 * @param {*} lineColour (string): Colour line will be.
 * @param {*} context (object): The 2d context element.
 */
function drawLine(fromX, fromY, toX, toY, lineColour, context)
{
    context.strokeStyle = lineColour;

    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
    context.closePath();
}

/**
 * Loops through each heap element drawing a line from a node to its children.
 * @param {*} heap (int[]): The heap/array.
 * @param {*} positions (list of int[]): Coordinates [x,y] for each node position on screen.
 * @param {*} context (object): The 2d context element.
 * @param {*} [investigating=[]] (int[]): Indexes of values/nodes currently being looked at.
 */
function drawLines(heap, positions, context, investigating=[])
{
    context.lineWidth = 5;

    for (let i = 0; i < heap.length; i++)
    {
        const firstChild = ((i + 1) * 2) - 1;
        const secondChild = ((i + 1) * 2);

        if (firstChild < heap.length)
            drawLine(positions[i][0], positions[i][1], positions[firstChild][0],
                positions[firstChild][1], investigating[0] == i && investigating.includes(firstChild) ? getAnimationHighlightColour() : getForegroundColour(), context);

        if (secondChild < heap.length)
            drawLine(positions[i][0], positions[i][1], positions[secondChild][0],
                positions[secondChild][1], investigating[0] == i && investigating.includes(secondChild) ? getAnimationHighlightColour() : getForegroundColour(), context);
    }
}

/**
 * Draws the circular outline of a heap node.
 * @param {*} x (int): The x coordinate of the node.
 * @param {*} y (int): The y coordinate of the node.
 * @param {*} nodeColour (string): The colour a node will be drawn in.
 * @param {*} context (object): The 2d context element.
 */
function drawNode(x, y, nodeColour, context)
{
    context.lineWidth = 5;
    context.fillStyle = getBackgroundColour();
    context.strokeStyle = nodeColour;

    context.beginPath();
    context.arc(x, y, 25, 0, Math.PI * 2);
    context.fill();
    context.stroke();
}

/**
 * Draws the numerical value of a heap node.
 * @param {*} textValue (string): The numerical value of the current node being drawn.
 * @param {*} x (int): The x coordinate of the value.
 * @param {*} y (int): The y coordinate of the value.
 * @param {*} context (object): The 2d context element.
 * @return {*} (null): Early return leaving currently animating values blank.
 */
function drawText(textValue, x, y, context)
{
    if (textValue === null)
        return;
    
    context.lineWidth = 1;
    context.fillStyle = getForegroundColour();
    context.strokeStyle = getForegroundColour();

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = "25px Arial";

    context.beginPath();
    context.strokeText(textValue, x, y);
    context.fillText(textValue, x, y);
    context.closePath();
}

/**
 * Loops through the heap/array to draw the circular outlines and values of the heap (nodes).
 * @param {*} heap (int[]): The heap/array.
 * @param {*} positions (list of int[]): Coordinates [x,y] for each node position on screen.
 * @param {*} context (object): The 2d context element.
 * @param {*} [investigating=[]] (int[]): Indexes of values/nodes currently being looked at.
 */
function drawNodes(heap, positions, context, investigating=[])
{
    for (let i = 0; i < heap.length; i++)
    {
        drawNode(positions[i][0], positions[i][1], investigating.includes(i) ? getAnimationHighlightColour() : getForegroundColour(), context);
        drawText(heap[i], positions[i][0], positions[i][1], context);
    }
}

/**
 * Draws the binary tree visualisation of the heap.
 * @param {*} heap (int[]): The heap/array.
 * @param {*} positions (list of int[]): Coordinates [x,y] for each node position on screen.
 * @param {*} context (object): The 2d context element.
 * @param {*} canvas (object): The canvas element of the page.
 * @param {*} [investigating=[]] (int[]): Indexes of values/nodes currently being looked at.
 */
function drawHeap(heap, positions, context, canvas, investigating=[])
{
    drawLines(heap, positions, context, investigating);
    drawNodes(heap, positions, context, investigating);
    drawArray(heap, context, canvas);
}

/**
 * Draws the "Array visualisation:" label at the top of the array visualisation.
 * @param {*} context (object): The 2d context element.
 * @param {*} x (int): x coordinate of the label.
 * @param {*} y (int): y coordinate of the label.
 */
function drawArrayLabel(context, x, y)
{
    context.lineWidth = 0.7;
    context.font = "15px Arial";
    context.textAlign = "left";

    context.beginPath();
    context.fillText("Array visualisation:", x+5, y-15);
    context.closePath();
}

/**
 * Draws the visualisation of the array at the bottom of the page.
 * @param {*} heap (int[]): The heap/array.
 * @param {*} context (object): The 2d context element.
 * @param {*} canvas (object): The canvas element of the page.
 */
function drawArray(heap, context, canvas)
{
    const rectWidth = Math.min(80, parseInt((canvas.width - 100) / heap.length));
    const startX = (canvas.width / 2) - (rectWidth * (heap.length / 2));
    const startY = canvas.height - rectWidth - 30;
    const fontSize = Math.min(28, (rectWidth / 2));
    const placeholderText = "- -";

    drawArrayLabel(context, startX, startY);

    context.textAlign = "center";
    context.fillStyle = getForegroundColour();

    for (let i = 0; i < heap.length; i++)
    {
        const x = startX + rectWidth * i;
        const y = startY;

        // Draw array box
        context.lineWidth = 4;

        context.beginPath();
        context.rect(x, y, rectWidth, rectWidth);
        context.stroke();

        // Draw array value
        context.font = fontSize + "px Arial";
        context.lineWidth = 1;

        context.fillText(heap[i] === null ? placeholderText : heap[i], x + rectWidth * 0.5, y + rectWidth * 0.5);
        context.strokeText(heap[i] === null ? placeholderText : heap[i], x + rectWidth * 0.5, y + rectWidth * 0.5);

        // Draw array index below box
        context.font = "13px Arial";
        context.lineWidth = 0.5;

        context.fillText(i, x + rectWidth * 0.5, y + rectWidth + 11);
        context.closePath();
    }
}

/**
 * Clears canvas and redraws heap.
 * @param {*} heap (int[]): The heap/array.
 * @param {*} positions (list of int[]): Coordinates [x,y] for each node position on screen.
 * @param {*} context (object): The 2d context element.
 * @param {*} canvas (object): The canvas element of the page.
 * @param {*} [investigating=[]] (int[]): Indexes of values/nodes currently being looked at.
 */
function redrawCanvas(heap, positions, context, canvas, investigating=[])
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawHeap(heap, positions, context, canvas, investigating);
}