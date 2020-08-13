'use strict';

// *** GLOBAL VARIABLES *** //

var gCanvas = document.getElementById('meme-canvas');
console.log("gCanvas", gCanvas)
var gCtx = gCanvas.getContext('2d');
var gIsMouseDown = false;


// ** INIT FUNCTIONS ** //

function init() {
    var imgs = getImagesForDisplay()
    renderImgs(imgs);
    renderKeywords()
}


function onOpenMemeEditor(imgId) {
    createMeme(imgId)
    renderCanvas();
    toggleView()
}

function onMyMemes() {
    renderMyMemes()
    toggleView('myMemes')
}

function onGallery() {
    init()
    toggleView('gallery')
}

function onEditSavedMeme(savedMemeId) {

    // const savedMeme = getSavedMemeById(savedMemeId);

    // editSavedMeme(savedMeme);
    // toggleView()
    // renderCanvas()
}


// ***** EDIT TEXT FUNCTIONS ***** //

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

function onDeleteLine() {
    deleteLine()
    document.querySelector('.txt-input').value = '';
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

function onEditTxt(elInput) {
    editTxt(elInput)
    renderCanvas()
}


function onSearchText(ev, elSearch, value) {
    console.log(elSearch.value);

    if (elSearch.value === '') {
        var imgs = getImagesForDisplay()
        renderImgs(imgs)
        return
    }
    var matchImgs = getMatchSearchs(elSearch.value);
    renderImgs(matchImgs);
}

// ***** RENDER/DRAW FUNCTIONS ***** //

function drawTxt(line) {
    gCtx.beginPath();
    gCtx.font = line.size + 'px' + ' ' + line.fontFamily;
    gCtx.textAlign = line.align;
    gCtx.fillStyle = line.color;
    gCtx.strokeStyle = line.strokeStyle;
    gCtx.lineWidth = line.lineWidth;
    gCtx.strokeText(line.txt, line.x, line.y);
    gCtx.fillText(line.txt, line.x, line.y);
}


function renderCanvas() {
    const meme = getMeme();
    const chosenImg = document.getElementById(meme.selectedImgId)
    // console.log("renderCanvas -> chosenImg", chosenImg)
    gCtx.drawImage(chosenImg, 0, 0, gCanvas.width, gCanvas.height);
    meme.lines.map(line => drawTxt(line))
}

function renderImgs(imgs) {
    var strHtml = imgs.map(function (img) {
        return `
        <div class="img-container"><img id='${img.id}' src='${img.url}' onclick="onOpenMemeEditor('${img.id}',this)" alt='meme picture'/></div>
        `
    })
    document.querySelector('.gallery').innerHTML = strHtml.join(' ');
}

function toggleView(page) {

    if (page === 'gallery' || page === 'myMemes') {
        document.querySelector('.meme-container').classList.add('hidden');
        document.querySelector('.gallery').classList.remove('hidden');
        document.querySelector('.search-bar').classList.remove('hidden');
    }
    else {
        document.querySelector('.meme-container').classList.remove('hidden');
        document.querySelector('.gallery').classList.add('hidden');
        document.querySelector('.search-bar').classList.add('hidden');
    }
}

function renderMyMemes() {
    const savedMemes = getSavedMemes();
    let elGallery = document.querySelector('.gallery')
    let strHtmls = savedMemes.map(savedMeme => {
        console.log(savedMeme.id);
        return `<img src="${savedMeme.canvasData}" alt="meme-img" style="position:relative"><a href="#" style="position:absolute; width:100%; height: 100%;" class="btn" onclick="downloadImg(this)" download="my-img.jpg"></a></img>`
    });
    elGallery.innerHTML = strHtmls.join('');
}

// ***** EXPORT FUNCTIONS ***** //


function onSave() {
    saveMeme(gCanvas)
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}

function uploadImg() {
    var imgToShare = gCanvas.toDataURL("image/jpeg");


    var formData = new FormData();
    formData.append('img', imgToShare);

    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(uploadedImgUrl => {
            uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`, '_blank')
        })
        .catch(function (err) {
            console.error(err)
        })
}


// *****CANVAS EVENTS*****//


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
            console.log("onCanvasDown -> line.x", line.x)
            console.log("onCanvasDown -> line.y", line.y)
            console.log("onCanvasDown -> offsetY", offsetY)
            console.log("onCanvasDown -> offsetX", offsetX)
            // if (meme.selectedLineIdx === idx) return;

            setLineIdx(idx);
            drawSelectionRect()
            document.querySelector('.txt-input').value = line.txt;
        }
        else {
            renderCanvas()
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
    drawSelectionRect()
}


function drawSelectionRect() {
    var meme = getMeme()
    let line = meme.lines[meme.selectedLineIdx];

    gCtx.font = (line.size + 'px ' + line.font);
    let rectW = gCtx.measureText(line.txt).width + 15;
    let rectH = +line.size + 5;
    let rectX = line.x - (rectW / 2);
    let rectY = line.y - line.size;


    gCtx.beginPath();
    gCtx.rect(rectX, rectY, rectW, rectH);
    gCtx.strokeStyle = "#5970c1";
    gCtx.lineWidth = '2';
    gCtx.strokeRect(rectX, rectY, rectW, rectH)
    gCtx.fillStyle = "#00000025";
    gCtx.fillRect(rectX, rectY, rectW, rectH);
}


function renderKeywords() {
    const keywordsMap = getKeywordsForDisplay();
    var strHTML = ``;

    for (var key in keywordsMap) {
        var fontSize = keywordsMap[key] + 0.1 + 'rem';
        strHTML += `
        <div class="keyword" onclick="onSelectWord('${key}')" style="font-size: ${fontSize};">${key}</div>
        `
    }

    document.querySelector('.search-words').innerHTML = strHTML;
}

function onSelectWord(key) {
    const keywordsMap = getKeywordsForDisplay();
    keywordsMap[key] += 0.1;
    renderKeywords()
}


function onOpenKeywords(elBtn) {
    body
    elBtn.classList.toggle('opened');
    console.dir( elBtn)
    elBtn.innerText = (elBtn.className === 'keywords-btn opened') ? 'Close' : 'More';

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