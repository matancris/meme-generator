'use strict';


var gCanvas = document.getElementById('meme-canvas');
console.log("gCanvas", gCanvas)
var gCtx = gCanvas.getContext('2d');
var gIsMouseDown = false;


function init() {
    var imgs = getImagesForDisplay()
    renderImgs(imgs);
}


function onOpenMemeEditor(imgId) {
    createMeme(imgId)
    renderCanvas();
    // renderTxtsEditor()
    toggleView()
    // renderTxtsEditor();
}

function renderCanvas() {
    const meme = getMeme();
    const chosenImg = document.getElementById(meme.selectedImgId)
    // var line = getLineByIdx(meme.selectedLineIdx)

    gCtx.drawImage(chosenImg, 0, 0, gCanvas.width, gCanvas.height);
    meme.lines.map(line => drawTxt(line))
}

// function onMySavedMemes(){
//     var memes = getSavedMemes();
//     memes.map(meme => {
//         img = getImgById(meme.selectedImgId);
//         gCtx.drawImage(chosenImg, 0, 0, gCanvas.width, gCanvas.height);
//         meme.lines.map(line => drawTxt(line))
//         //  `
//         // <div class="img-container"><img id='${img.id}' src='${img.url}' onclick="onOpenMemeEditor('${img.id}',this)" alt='meme picture'/></div>
//         // `  
//     })
// }


// drawImg(img, meme)
// const img = new Image();
// img.onload = () => {
// img.src = chosenImg.currentSrc;

// if (meme.lines.length) {
//     meme.lines.map(line => {
//         drawTxt(line)
//         // gCtx.lineWidth = '1';
//         // gCtx.strokeStyle = line.stroke;
//         // gCtx.fillStyle = line.color;
//         // gCtx.textBaseline = "middle";
//         // gCtx.font = (line.size + 'px ' + line.font);
//         // gCtx.textAlign = line.align;
//         // gCtx.fillText(line.txt, line.y, line.y);
//         // gCtx.strokeText(line.txt, line.x, line.y);
//     });

// }

function onSwitchLine() {
    var meme = getMeme();
    if (!meme.lines.length) return;
    var lineIdx = meme.selectedLineIdx

    // if (lineIdx === null) lineIdx = 0;
    if (lineIdx === meme.lines.length - 1) lineIdx = 0;
    else lineIdx++;

    setLineIdx(lineIdx)
    document.querySelector('.txt-input').value = meme.lines[lineIdx].txt;
    renderCanvas()

}

function onEditTxt(elInput) {
    // var line = getLineByIdx()
    const meme = getMeme()
    editTxt(elInput)

    // if ()
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
    console.log("onAddLine -> y", y)

    addLine('Text', x, y);
    document.querySelector('.txt-input').value = '';
    drawTxt(meme.lines[meme.lines.length - 1])
    // renderCanvas()
}



// function drawImg(chosenImg, meme) {
//     const img = new Image();
//     img.onload = () => {
//         gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);  
//         drawTxt(meme.lines[0])
//     }
//     img.src = chosenImg.url;
// }


// function drawCanvas() {
//     gCtx.drawImage(gImgObj, 0, 0);

//     gMeme.txts.forEach(function (txt) {
//         drawTxt(txt);
//     });

// }

// function drawTxt(text, x, y) {

//     gCtx.lineWidth = '2';
//     gCtx.strokeStyle = 'red';
//     gCtx.fillStyle = 'white';
//     gCtx.font = '40px Ariel';
//     gCtx.textAlign = 'center';
//     gCtx.fillText(text, x, y);
//     gCtx.strokeText(text, x, y);
// }

function drawTxt(line) {
    gCtx.beginPath();
    gCtx.font = line.size + 'px' + ' ' + line.fontFamily;
    gCtx.textAlign = line.align;
    gCtx.fillStyle = line.color;
    // if (txt.isShadow) addTxtShadow(txt);
    // if (txt.isOutline) addTxtOutline(txt);
    gCtx.fillText(line.txt, line.x, line.y);
}

// function addTxtShadow(txt) {
//     gCtx.shadowColor = txt.shadowColor;
//     gCtx.shadowOffsetX = txt.shadowOffsetX;
//     gCtx.shadowOffsetY = txt.shadowOffsetY;
//     gCtx.shadowBlur = txt.shadowBlur;
// }

// function addTxtOutline(txt) {
//     gCtx.strokeStyle = txt.strokeStyle;
//     gCtx.lineWidth = txt.lineWidth;
//     gCtx.strokeText(txt.line, txt.x, txt.y);
// }

function onSave() {
    saveMeme()
}


function onDeleteLine() {
    deleteLine()
    document.querySelector('.txt-input').value = '';
    renderCanvas()
}

function newTxtBtnClicked() {
    gMeme.txts.push(addLine('New Line', 150, 150));
    drawCanvas();
    renderTxtsEditor();
}

function deleteTxt(txtIdx) {
    gMeme.txts.splice(txtIdx, 1); //arr.splice(start, deleteCount)
    drawCanvas();
    renderTxtsEditor();
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


function onCanvasDown(ev) {
    const { offsetX, offsetY } = ev;
    var meme = getMeme()
    gIsMouseDown = true;

    meme.lines.map((line, idx) => {
        let width = gCtx.measureText(line.txt).width;
        let height = line.size;

        if (offsetX >= line.x - (width / 2) &&
            offsetX <= line.x + (width / 2) &&
            offsetY >= line.y - (height / 2) &&
            offsetY <= line.y + (height / 2)) {

            setLineIdx(idx);
            document.querySelector('.txt-input').value = line.txt;

        }
    })
}


function onCanvasUp() {
    gIsMouseDown = false;
}


function onCanvasMove(ev) {
    if (!gIsMouseDown) return;
    const { offsetX, offsetY } = ev;
    var { movementX, movementY } = ev;


    var newPosX = offsetX + movementX;
    var newPosY = offsetY + movementY;

    var meme = getMeme()

    setNewLinePos(meme.lines[meme.selectedLineIdx], newPosX, newPosY)
    renderCanvas()
}