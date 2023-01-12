const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const popButton = document.getElementById("popButton");
const clearButton = document.getElementById("clearButton");
const pushButton = document.getElementById("pushButton");
const appendButton = document.getElementById("appendButton");
const heapBuildButton = document.getElementById("heapBuildButton");
const heapsortButton = document.getElementById("heapsortButton");
const minRadio = document.getElementById("minRadio");
const maxRadio = document.getElementById("maxRadio");
const appendTxtValue = document.getElementById("appendInput");
const pushTxtValue = document.getElementById("pushInput");
const backgroundColourSelect = document.getElementById("backgroundcolour");
const foregroundColourSelect = document.getElementById("foregroundcolour");
const modalParent = document.getElementById("modalParent");
const controlsPanel = document.getElementById("controls");
const animationSwitch = document.getElementById("animationSwitch");
const animationSpeedControl = document.getElementById("animationSpeed");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let foregroundColour = "white";
let backgroundColour = "olivedrab";
const animationHighlightColour = "red";


let animationSpeed = 1250;//ms range(5000 ... 500)
let animateOperations = false;
let isMinHeap = false;

const initialNodeCount = 15;// Number of nodes added to screen on start
let heap = [];

// Redraw the canvas after a resizing.
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    redrawCanvas(heap, getNodePositions(heap.length, canvas), ctx, canvas);
});

// Pop the top value from the heap and rebalance.
popButton.addEventListener('click', async function()
{
    heapPop(heap, (heap.length - 1), ctx, canvas, isMinHeap, false);
});

// Remove all values from the heap.
clearButton.addEventListener('click', function()
{
    heap = [];
    redrawCanvas(heap, getNodePositions(heap.length, canvas), ctx, canvas);
});

// Append 1 or more values to the heap and rebalance.
pushButton.addEventListener('click', function()
{
    if (!parseInt(pushTxtValue.value))
    {
        heapPush(heap, [parseInt((Math.random() * 99) + 1)], ctx, canvas, isMinHeap);
    }
    else
    {
        const pushedVals = (pushTxtValue.value).split(",");
        heapPush(heap, pushedVals, ctx, canvas, isMinHeap);
    }
});

// Append 1 or more values to the array.
appendButton.addEventListener('click', function()
{
    if (!parseInt(appendTxtValue.value))
    {
        heap.push(parseInt((Math.random() * 99) + 1));
    }
    else
    {
        const appendVals = (appendTxtValue.value).split(",");

        for (let i = 0; i < appendVals.length; i++)
            if (parseInt(appendVals[i]))
                heap.push(parseInt(appendVals[i]));
    }

    redrawCanvas(heap, getNodePositions(heap.length, canvas), ctx, canvas);
});

// Run heap build.
heapBuildButton.addEventListener('click', function()
{
    heapBuild(heap, ctx, canvas, isMinHeap);
});

// Run heap sort.
heapsortButton.addEventListener('click', function(){
    heapSort(heap, getNodePositions(heap.length, canvas), ctx, canvas, isMinHeap);
});

// Change canvas background colour.
backgroundColourSelect.addEventListener('change', function()
{
    backgroundColour = backgroundColourSelect.value;
    canvas.style.background = backgroundColour;
    redrawCanvas(heap, getNodePositions(heap.length, canvas), ctx, canvas);
});

// Change text/line colour.
foregroundColourSelect.addEventListener('change', function()
{
    foregroundColour = foregroundColourSelect.value;
    redrawCanvas(heap, getNodePositions(heap.length, canvas), ctx, canvas);
});

// Alter animation state to on/off.
animationSwitch.addEventListener('change', function(){
    animateOperations = animationSwitch.checked;
});

// Set animation speed.
animationSpeedControl.addEventListener('change', function(){
    animationSpeed = 5000 - ((animationSpeedControl.value - 2) * 750); //(750 = 5000-500 / 6)
});

// Changes the heap type boolean and reorganises the heap.
function alterHeapType()
{
    isMinHeap = minRadio.checked ? true : false;
    heapBuild(heap, ctx, canvas, isMinHeap);
}

// Allows the modal to be removed by clicking off to the side.
modalParent.addEventListener('click', (e)=> {
    if (e.target.className == "modal-parent")
    {
        helpTextAppear(false);
    }
});

// Brings modal help text in or out of focus, also enabling/disabling blur and transition.
function helpTextAppear(appear)
{
    if (appear)
    {
        modalParent.style.display = "block";

        canvas.style.transition = "1.5s";
        controlsPanel.style.transition = "1.5s";

        canvas.style.filter = "blur(3px)";
        controlsPanel.style.filter = "blur(3px)";
    }
    else
    {
        modalParent.style.display = "none";
        
        canvas.style.transition = "0s";
        controlsPanel.style.transition = "0s";

        canvas.style.filter = "none";
        controlsPanel.style.filter = "none";
    }
}

// Disables UI elements not needed when animating.
function disableUI(disable)
{
    popButton.disabled = disable;
    clearButton.disabled = disable;
    pushButton.disabled = disable;
    appendButton.disabled = disable;
    heapBuildButton.disabled = disable;
    heapsortButton.disabled = disable;
    minRadio.disabled = disable;
    maxRadio.disabled = disable;
    appendTxtValue.disabled = disable;
    pushTxtValue.disabled = disable;
    backgroundColourSelect.disabled = disable;
    foregroundColourSelect.disabled = disable;
    controlsPanel.disabled = disable;
}


/**
 * Sets the animations on/off depending on the given value. No value 
 * returns the 'animateOperations' variable back to the on screen selection.
 * @param {*} value (boolean): Set animations to on (true) or off (false).
 */
function setAnimateOperations(value)
{
    if (value === undefined)
        animateOperations = animationSwitch.checked;
    else
        animateOperations = value;
}

// Returns if user has animations on/off.
function getIfAnimating()
{
    return animateOperations;
}

// Returns the currently selected animation speed.
function getAnimationSpeed()
{
    return animationSpeed;
}

// Returns colour used for the canvas background.
function getBackgroundColour()
{
    return backgroundColour;
}

// Returns colour used for drawing lines and text on screen.
function getForegroundColour()
{
    return foregroundColour;
}

// Returns colour used to show which nodes are being looked at.
function getAnimationHighlightColour()
{
    return animationHighlightColour;
}

function main()
{
    populateheap(heap, initialNodeCount, ctx, canvas);
    drawHeap(heap, getNodePositions(heap.length, canvas), ctx, canvas);
}

window.addEventListener('load', function(){
    main();
});
