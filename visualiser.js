function drawLine(fromX, fromY, toX, toY, lineColour, context)
{
    context.strokeStyle = lineColour;

    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
    context.closePath();
}

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

function drawNodes(heap, positions, context, investigating=[])
{
    for (let i = 0; i < heap.length; i++)
    {
        drawNode(positions[i][0], positions[i][1], investigating.includes(i) ? getAnimationHighlightColour() : getForegroundColour(), context);
        drawText(heap[i], positions[i][0], positions[i][1], context);
    }
}

function drawHeap(heap, positions, context, canvas, investigating=[])
{
    drawLines(heap, positions, context, investigating);
    drawNodes(heap, positions, context, investigating);
    drawArray(heap, context, canvas);
}

function drawArrayLabel(context, x, y)
{
    context.lineWidth = 0.7;
    context.font = "15px Arial";
    context.textAlign = "left";

    context.beginPath();
    context.fillText("heap visualisation:", x+5, y-15);
    context.closePath();
}

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

function redrawCanvas(heap, positions, context, canvas, investigating=[])
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawHeap(heap, positions, context, canvas, investigating);
}