'use strict';


var gCanvas = document.getElementById('meme-canvas');
var gCtx = gCanvas.getContext('2d');



function init() {
    var imgs = getImagesForDisplay()
    renderImgs(imgs);
}


function onOpenMemeEditor(imgId) {
    createMeme(imgId)
    renderCanvas();
    toggleView()
}

function renderCanvas() {
    const meme = getMeme();
    const chosenImg = document.getElementById(meme.selectedImgId)
    // var line = getLineByIdx(meme.selectedLineIdx)

    gCtx.drawImage(chosenImg, 0, 0, gCanvas.width, gCanvas.height);
    meme.lines.map(line => drawTxt(line))
}


function onSwitchLine() {
    var meme = getMeme();
    if (!meme.lines.length) return;
    var lineIdx = meme.selectedLineIdx

    if (lineIdx === meme.lines.length - 1) lineIdx = 0;
    else lineIdx++;

    setLineIdx(lineIdx)
    document.querySelector('.txt-input').value = meme.lines[lineIdx].txt;
    renderCanvas()

}

function onEditTxt(elInput) {
    const meme = getMeme()
    editTxt(elInput)

    renderCanvas()
}

function onAddLine() {
    const meme = getMeme();
    meme.selectedLineIdx++

    var x = gCanvas.width / 2
    var y;

    if (meme.lines.length === 0) y = 50
    if (meme.lines.length === 1) y = (gCanvas.height - 50)
    if (meme.lines.length >= 2) y = (gCanvas.height / 2)

    addLine('Text', x, y);
    document.querySelector('.txt-input').value = '';
    drawTxt(meme.lines[meme.lines.length - 1])
}

function drawTxt(line) {
    gCtx.beginPath();
    gCtx.font = line.size + 'px' + ' ' + line.fontFamily;
    gCtx.textAlign = line.align;
    gCtx.fillStyle = line.color;

    gCtx.fillText(line.txt, line.x, line.y);
}


function toggleView() {
    document.querySelector('.meme-container').classList.toggle('hidden');
    document.querySelector('.gallery').classList.toggle('hidden');
}



function renderImgs(imgs) {
    var strHtml = imgs.map(function (img) {
        return `
        <div class="img-container"><img id='${img.id}' src='${img.url}' onclick="onOpenMemeEditor('${img.id}',this)" alt='meme picture'/></div>
        `
    })

    document.querySelector('.gallery').innerHTML = strHtml.join(' ');
}
