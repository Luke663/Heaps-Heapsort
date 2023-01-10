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
let backgroundColour = "lightskyblue";
const animationHighlightColour = "red";


let animationSpeed = 1250;//ms range(5000 ... 500)
let animateOperations = false;
let isMinHeap = false;

const initialNodeCount = 15;
let heap = [];

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    redrawCanvas(heap, getNodePositions(heap.length, canvas), ctx, canvas);
});
popButton.addEventListener('click', async function()
{
    heapPop(heap, (heap.length - 1), ctx, canvas, isMinHeap, false);
});
clearButton.addEventListener('click', function()
{
    heap = [];
    redrawCanvas(heap, getNodePositions(heap.length, canvas), ctx, canvas);
});
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
heapBuildButton.addEventListener('click', function()
{
    heapBuild(heap, ctx, canvas, isMinHeap);
});
heapsortButton.addEventListener('click', function(){
    heapSort(heap, getNodePositions(heap.length, canvas), ctx, canvas, isMinHeap);
})
backgroundColourSelect.addEventListener('change', function()
{
    backgroundColour = backgroundColourSelect.value;
    canvas.style.background = backgroundColour;
    redrawCanvas(heap, getNodePositions(heap.length, canvas), ctx, canvas);
});
foregroundColourSelect.addEventListener('change', function()
{
    foregroundColour = foregroundColourSelect.value;
    redrawCanvas(heap, getNodePositions(heap.length, canvas), ctx, canvas);
});
animationSwitch.addEventListener('change', function(){
    animateOperations = animationSwitch.checked;
});
animationSpeedControl.addEventListener('change', function(){
    animationSpeed = 5000 - ((animationSpeedControl.value - 2) * 750); //(750 = 5000-500 / 6)
});
function alterHeapType()
{
    isMinHeap = minRadio.checked ? true : false;
    heapBuild(heap, ctx, canvas, isMinHeap);
}

modalParent.addEventListener('click', (e)=> {
    if (e.target.className == "modal-parent")
    {
        helpTextAppear(false);
    }
});
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

function setAnimateOperations(value)
{
    if (value === undefined)
        animateOperations = animationSwitch.checked;
    else
        animateOperations = value;
}

function getIfAnimating()
{
    return animateOperations;
}

function getAnimationSpeed()
{
    return animationSpeed;
}

function getBackgroundColour()
{
    return backgroundColour;
}
function getForegroundColour()
{
    return foregroundColour;
}
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