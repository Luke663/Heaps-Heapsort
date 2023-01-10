/**
 * Runs heap sort, repetedly popping from the heap and appending the popped value 
 * to the end of the heap until the heap values are sorted.
 * @param {*} heap (int[]): The heap/array.
 * @param {*} positions (int[]): [x, y] positions for each node on screen.
 * @param {*} context (object): 2d canvas context.
 * @param {*} canvas (object): Webpage canvas element.
 * @param {*} isMinHeap (boolean): If the heap is a min heap or not.
 */
async function heapSort(heap, positions, context, canvas, _isMinHeap)
{
    setAnimateOperations(false);
    await heapBuild(heap, context, canvas, _isMinHeap);
    setAnimateOperations();

    let endOfHeap = heap.length - 1;

    while (endOfHeap >= 0)
    {
        const val = await heapPop(heap, endOfHeap, context, canvas, _isMinHeap, true);
        heap[endOfHeap] = val;
        endOfHeap -= 1;
    }

    redrawCanvas(heap, positions, context, canvas);
}

/**
 * Appends a new value to the heap then rebalances the heap to keep it valid.
 * @param {*} heap (int[]): The heap/array.
 * @param {*} values (int or int[]): Value(s) that will be added to the heap.
 * @param {*} context (object): 2d canvas context.
 * @param {*} canvas (object): Webpage canvas element.
 * @param {boolean} [isMinHeap=false] (boolean): If the heap is a min heap or not.
 */
async function heapPush(heap, values, context, canvas, isMinHeap=false)
{
    if (getIfAnimating())
        disableUI(true);

    for (let i = 0; i < values.length; i++)
    {
        heap.push(parseInt(values[i]));
    
        let current = heap.length - 1;
        let parent = parseInt((current + 1) / 2) - 1;
        const positions = getNodePositions(heap.length, canvas);
    
        while (true)
        {
            if (getIfAnimating() && heap[parent])
            {
                // Draw canvas showing which elements are being investigated
                redrawCanvas(heap, positions, context, canvas, [parent, current]);
                await sleep(animationSpeed);
            }
    
            // Min heap
            if (isMinHeap && heap[parent] > heap[current])
            {
                current = await swapElements(heap, current, parent, positions, getIfAnimating(), getAnimationSpeed(), context, canvas);
                parent = parseInt((current + 1) / 2) - 1;
                continue;
            }
    
            // Max heap
            if (!isMinHeap && heap[parent] < heap[current])
            {
                current = await swapElements(heap, current, parent, positions, getIfAnimating(), getAnimationSpeed(), context, canvas);
                parent = parseInt((current + 1) / 2) - 1;
                continue;
            }
    
            break;
        }
    
        redrawCanvas(heap, positions, context, canvas);

        if (getIfAnimating() && values.length > 1)
            await sleep(1000); // Pause between insertions
    }

    disableUI(false);
}

/**
 * Removes the first value, largest (max heap) or smallest (min heap), then promotes the last value in its place before
 * rebalancing the heap.
 * @param {*} heap (int[]): The heap/array.
 * @param {*} endOfHeap (int): Last index that will be considered while rebalancing the heap (so popped values can be put at the end during heap sort).
 * @param {*} context (object): 2d canvas context.
 * @param {*} canvas (object): Webpage canvas element.
 * @param {boolean} [isMinHeap=false] (boolean): If the heap is a min heap or not.
 * @param {boolean} [runningHeapSort=false] (boolean): If the webpage is using heapsort of popping a single value.
 * @return {*} (int): The value, largest (max heap) or smallest (min heap), popped from the heap.
 */
async function heapPop(heap, endOfHeap, context, canvas, isMinHeap=false, runningHeapSort=false)
{
    if (getIfAnimating())
        disableUI(true);
    
    const retValue = heap[0];
    let positions = getNodePositions(heap.length, canvas);

    if (endOfHeap === 0)
    {
        if (!runningHeapSort)
            heap.pop();
        else
            heap[endOfHeap] = null;

        if (getIfAnimating())
            disableUI(false);

        redrawCanvas(heap, positions, context, canvas);

        return retValue;
    }

    // Animate promotion
    if (getIfAnimating())
    {
        const animationPreparation = prepareAnimation(heap, [[0, endOfHeap], [endOfHeap, 0]], getNodePositions(heap.length, canvas));
        animate(0, 0, animationPreparation, getAnimationSpeed(), getNodePositions(heap.length, canvas), context, canvas);
        await sleep(getAnimationSpeed());
    }

    heap[0] = heap[endOfHeap];

    if (!runningHeapSort)
        heap.pop();
    else
        heap[endOfHeap] = null;

    let current = 0;
    let childOne = (current * 2) + 1;
    let childTwo = (current * 2) + 2;

    if (!runningHeapSort) positions = getNodePositions(heap.length, canvas);

    if (getIfAnimating())
    {
        const investigating = [current];
        if (childOne < endOfHeap)
            investigating.push(childOne);
        if (childTwo < endOfHeap)
            investigating.push(childTwo);

        // Set colours
        redrawCanvas(heap, positions, context, canvas, investigating);
        // Wait
        await sleep(getAnimationSpeed());
    }

    if (isMinHeap)
    {
        while ((childTwo < endOfHeap && (heap[current] > heap[childOne] || heap[current] > heap[childTwo]))
            || (childOne < endOfHeap && heap[current] > heap[childOne])) // for min heap
        {
            if (childTwo < endOfHeap)
            {
                if (heap[childTwo] < heap[childOne])
                {
                    current = await swapElements(heap, current, childTwo, positions, getIfAnimating(), getAnimationSpeed(), context, canvas);
                }
                else
                {
                    current = await swapElements(heap, current, childOne, positions, getIfAnimating(), getAnimationSpeed(), context, canvas);
                }
            }
            else
            {
                current = await swapElements(heap, current, childOne, positions, getIfAnimating(), getAnimationSpeed(), context, canvas);
            }

            childOne = (current * 2) + 1;
            childTwo = (current * 2) + 2;

            if (getIfAnimating() && childOne < endOfHeap)
            {
                const investigating = [current, childOne];
                if (childTwo < endOfHeap)
                    investigating.push(childTwo);

                // Set colours
                redrawCanvas(heap, positions, context, canvas, investigating);
                // Wait
                await sleep(getAnimationSpeed());
            }
        }
    }
    else
    {
        while ((childTwo < endOfHeap && (heap[current] < heap[childOne] || heap[current] < heap[childTwo]))
            || (childOne < endOfHeap && heap[current] < heap[childOne])) // for max heap
        {
            if (childTwo < endOfHeap)
            {
                if (heap[childTwo] > heap[childOne])
                {
                    current = await swapElements(heap, current, childTwo, positions, getIfAnimating(), getAnimationSpeed(), context, canvas);
                }
                else
                {
                    current = await swapElements(heap, current, childOne, positions, getIfAnimating(), getAnimationSpeed(), context, canvas);
                }
            }
            else
            {
                current = await swapElements(heap, current, childOne, positions, getIfAnimating(), getAnimationSpeed(), context, canvas);
            }

            childOne = (current * 2) + 1;
            childTwo = (current * 2) + 2;

            if (getIfAnimating() && childOne < endOfHeap)
            {
                const investigating = [current, childOne];
                if (childTwo < endOfHeap)
                    investigating.push(childTwo);

                // Set colours
                redrawCanvas(heap, positions, context, canvas, investigating);
                // Wait
                await sleep(getAnimationSpeed());
            }
        }
    }

    redrawCanvas(heap, positions, context, canvas);
    disableUI(false);

    return retValue;
}

/**
 * Loops through each parent node starting with the last, rebalancing each with its children (sub-trees)
 * until the whole heap is valid.
 * @param {*} heap (int[]): The heap/array.
 * @param {*} context (object): 2d canvas context.
 * @param {*} canvas (object): Webpage canvas element.
 * @param {boolean} [isMinHeap=false] (boolean): If the heap is a min heap or not.
 */
async function heapBuild(heap, context, canvas, isMinHeap=false)
{
    if (getIfAnimating())
        disableUI(true);

    let current = null;
    const positions = getNodePositions(heap.length, canvas);
    const stack = initialiseStack(Math.floor(heap.length / 2));

    while (stack.length > 0)
    {
        current = stack.pop();

        const childOne = (current * 2) + 1;
        const childTwo = (current * 2) + 2;

        if (!heap[childOne] && !heap[childTwo])
            continue;

        if (getIfAnimating())
        {
            // Draw canvas showing which elements are being investigated
            redrawCanvas(heap, positions, context, canvas, [current, childOne, childTwo]);
            await sleep(getAnimationSpeed());
        }

        if (heap[childTwo])
        {
            // No action taken
            if (!isMinHeap && heap[current] >= Math.min(heap[childOne], heap[childTwo]))
                continue;
            if (isMinHeap && heap[current] <= Math.max(heap[childOne], heap[childTwo]))
                continue;
            
            if ((!isMinHeap && heap[childOne] > heap[childTwo]) || (isMinHeap && heap[childOne] < heap[childTwo]))
                stack.push(await swapElements(heap, current, childOne, positions, getIfAnimating(), getAnimationSpeed(), context, canvas));
            else
                stack.push(await swapElements(heap, current, childTwo, positions, getIfAnimating(), getAnimationSpeed(), context, canvas));
        }
        else
        {
            if ((!isMinHeap && heap[current] < heap[childOne]) || (isMinHeap && heap[current] > heap[childOne]))
                stack.push(await swapElements(heap, current, childOne, positions, getIfAnimating(), getAnimationSpeed(), context, canvas));
        }
    }

    redrawCanvas(heap, positions, context, canvas);
    disableUI(false);
}

/**
 * Swaps two heap elements and returns the index of the second element. If animation is turned on 
 * the swap will be animated.
 * @param {*}  (int[]): The heap/array.
 * @param {*} elementOne (int): index of first element to be switched.
 * @param {*} elementTwo (int): index of second element to be switched.
 * @param {*} positions (int[]): [x, y] positions for each node on screen.
 * @param {*} animateSwap (boolean): If the element swap will be animated or not.
 * @param {*} animationSpeed (int): The time the animation will be performed in (ms).
 * @param {*} context (object): 2d canvas context.
 * @param {*} canvas (object): Webpage canvas element.
 * @return {*} (int): The index of the swapped element that will be investigated next.
 */
async function swapElements(heap, elementOne, elementTwo, positions, animateSwap, animationSpeed, context, canvas)
{
    if (animateSwap)
    {
        const animationPreparation = prepareAnimation(heap, [[elementOne, elementTwo], [elementTwo, elementOne]], positions);
        animate(0, 0, animationPreparation, animationSpeed, positions, context, canvas);
        await sleep(animationSpeed);
    }

    [heap[elementOne], heap[elementTwo]] = [heap[elementTwo], heap[elementOne]];
    
    return elementTwo;
}

/**
 * Fills a list with values (0 ... numItems) for use by the heap build function 
 * to keep track of parent nodes to be investigated.
 * @param {*} numberOfItems (int): The number of parent nodes in the heap.
 * @return {*} (int[]): List indexes for the parent nodes in the heap.
 */
function initialiseStack(numberOfItems)
{
    const stack = [];

    for (let i = 0; i < numberOfItems; i++)
        stack.push(i);

    return stack;
}
