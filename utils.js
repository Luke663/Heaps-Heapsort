/**
 * Returns the current height of the binary heap via its number of nodes.
 * @param {*} numberHeapOfNodes (int): Number of nodes in the tree.
 * @return {*} (int): The height of the binary heap.
 */
function getHeapHeight(numberHeapOfNodes)
{
    return Math.floor(Math.log2(numberHeapOfNodes)) + 1;
}

/**
 * Uses the size of the heap and the canvas to calculate the positions of the nodes on the screen.
 * Works backward, calculating the last row's values then placing the parent nodes halfway between 
 * its children.
 * @param {*} heapLength (int): Number of values/nodes in the heap.
 * @param {*} canvas (object): The canvas element of the webpage.
 * @return {*} (list of int[]): The node positions on screen [[x, y], ...].
 */
function getNodePositions(heapLength, canvas)
{
    let positions = [];

    const middleX = canvas.width / 2;
    const middleY = canvas.height / 2;

    let treeHeight = getHeapHeight(heapLength);
    const lastRowNodeCount = Math.pow(2, treeHeight - 1);

    const lastRowValidSpaces = lastRowNodeCount / 2; // Gaps between siblings
    const lastRowNonvalidSpaces = lastRowValidSpaces - 1; // Gaps between cousins

    const lastRowXSpacing = Math.min(120,  ((canvas.width - 100) - (lastRowNonvalidSpaces * 60)) / lastRowValidSpaces);
    const lastRowWidth = (lastRowNonvalidSpaces * 60) + lastRowXSpacing * (lastRowNodeCount / 2);

    const ySpacing = Math.min(120, (canvas.height - 100) / treeHeight);
    const startY = middleY - (treeHeight / 2) * ySpacing;

    let startX = middleX - (lastRowWidth / 2);

    // Populate the list with the last row's coordinates
    for (let i = 0; i < lastRowNodeCount/2; i++)
    {
        positions.push([startX, startY + (ySpacing * (treeHeight - 1))]);
        positions.push([(startX + lastRowXSpacing), startY + (ySpacing * (treeHeight - 1))]);

        startX += lastRowXSpacing + 60; // 60 for the node width
    }

    treeHeight -= 1;

    // Loop through previous rows to calculate the center point for the node above
    while (treeHeight > 0)
    {
        const previousRowCount = Math.pow(2, treeHeight);
        let values = [];

        for (let i = 0; i < previousRowCount; i += 2)
        {
            const x = parseInt(positions[i][0] + ((positions[i+1][0] - positions[i][0]) / 2));
            const y = startY + (ySpacing * (treeHeight - 1));

            values.push([x, y]);
        }

        positions = values.concat(positions); // Places current row before last calculated row
        treeHeight -= 1;
    }

    return positions;
}

/**
 * Uses the heap.push() function to populate the heap with values on page load.
 * @param {*} heap (int[]): The heap/array to be filled.
 * @param {*} initialNodeCount (int): The nuber of values to add to the heap.
 */
async function populateheap(heap, initialNodeCount, context, canvas)
{
    for(let i = 0; i < initialNodeCount; i++)
        await heapPush(heap, [parseInt((Math.random() * 99) + 1)], context, canvas, false);

    setAnimateOperations(true);
}

/**
 * Causes the thread to sleep for given time in miliseconds.
 * @param {*} time (int): The time the thread will pause (ms).
 * @return {*} (null).
 */
async function sleep(time)
{
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Alters an element's (node value) x and y coordinates along its path via the given percentage.
 * @param {*} element (object): element being animated = { value, x, y, targetX, targetY }.
 * @param {*} percent (float): progress of element along path.
 */
function alterElementCoordinatesOnLine(element, percent)
{
    element.x = parseInt(element.x + (element.targetX - element.x) * percent);
    element.y = parseInt(element.y + (element.targetY - element.y) * percent);
}