/**
 * Creates the new placeholder copy of the heap with animated elements set to null and generates the information 
 * needed to perform animations.
 * @param {*} heap (int[]): The heap/array.
 * @param {*} animatedElementsIndexes (list of int[]): the indexes of the elements to be animated ([index of element to be moved, index of element to be switched with]).
 * @param {*} positions (int[]): [x, y] positions for each node on screen.
 * @return {*} ([ int[], object[] ]): Information needed to perform the animations ([heap with animated values set to null, list of objects containing values (number), position (x,y), and destination (x,y)]).
 */
function prepareAnimation(heap, animatedElementsIndexes, positions)
{
    const preparedHeap = [...heap];
    const animatedElements = [];

    for (let i = 0; i < animatedElementsIndexes.length; i++)
    {
        animatedElements.push({
            value: preparedHeap[animatedElementsIndexes[i][0]],
            x: positions[animatedElementsIndexes[i][0]][0],
            y: positions[animatedElementsIndexes[i][0]][1],
            targetX: positions[animatedElementsIndexes[i][1]][0],
            targetY: positions[animatedElementsIndexes[i][1]][1]
        });

        preparedHeap[animatedElementsIndexes[i][0]] = null;
    }

    return [preparedHeap, animatedElements];
}

/**
 * Animates elements being moved by using the timestamp and given duration to place the element
 * at the correct position via its progrees (%) over time. (cuts off at 96% to smooth animation 
 * and ensure the animation is done by the time the main thread is finished waiting).
 * @param {*} timestamp (number/time): Inbuilt requestAnimationFrame variable.
 * @param {*} starttime (number/time): Time the animation started.
 * @param {*} animationPreparation ([ int[], object[] ]): Information needed to perform the animations ([heap with animated values set to null, list of objects containing values (number), position (x,y), and destination (x,y)]).
 * @param {*} duration (int): Time (ms) that the animation will take to complete.
 */
function animate(timestamp, starttime, animationPreparation, duration, positions, context, canvas)
{
    const timeStamp = timestamp || performance.now();
    starttime = starttime || performance.now();

    let runtime = timeStamp - starttime;
    let progress = (runtime / duration).toFixed(2);
    progress = Math.min(progress, 1);

    // Allows quick cutoff ensuring animation is finished before thread wait time
    runtime = progress < 0.96 ? runtime : duration;

    // Draw preparedHeap
    redrawCanvas(animationPreparation[0], positions, context, canvas);
        
    // Update positions
    animationPreparation[1].forEach(element => {
        alterElementCoordinatesOnLine(element, progress);
    });

    // Draw animated elements
    animationPreparation[1].forEach(element => {
        drawText(element.value, element.x, element.y, context);
    });

    if (runtime < duration)
    { // if duration not met yet
        requestAnimationFrame(function(timeStamp)
        {
            animate(timeStamp, starttime, animationPreparation, duration, positions, context, canvas);
        });
    }
}