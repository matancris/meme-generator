'use strict';

// *** GLOBAL VARIABLES *** //

var gCanvas = document.getElementById('meme-canvas');
var gCtx = gCanvas.getContext('2d');
var gIsMouseDown = false;
var gIsLineSelected = false
var gIsStickerSelected = false


// ** PAGE FUNCTIONS ** //

function init() {
    var imgs = getImagesForDisplay()
    renderImgs(imgs);
    renderKeywords()
}

function onOpenMemeEditor(imgId) {
    _createMeme(imgId)
    updateDrawedStickers('init')
    renderCanvas();
    renderStickers();
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

// ***** LINE FUNCTIONS ***** //

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


// ***** GALLERY FUNCTIONS ***** //

function renderImgs(imgs) {
    var strHtml = imgs.map(function (img) {
        return `
        <div class="img-container"><img id='${img.id}' src='${img.url}' onclick="onOpenMemeEditor('${img.id}',this)" alt='meme picture'/></div>
        `
    })
    document.querySelector('.gallery').innerHTML = strHtml.join(' ');
}

function renderMyMemes() {
    const savedMemes = getSavedMemes();
    let elGallery = document.querySelector('.gallery')
    let strHtmls = savedMemes.map(savedMeme => {
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

// *****CANVAS FUNCTIONS*****//

function renderCanvas() {
    const meme = getMeme();
    const drawedStcs = getDrawedStickers();
    const chosenImg = document.getElementById(meme.selectedImgId)
    gCtx.drawImage(chosenImg, 0, 0, gCanvas.width, gCanvas.height);
    meme.lines.map(line => drawTxt(line))

    drawedStcs.map(sticker => drawSticker(sticker))
}

function onCanvasDown(ev) {
    const { offsetX, offsetY } = ev;
    var meme = getMeme()
    var drawedStcs = getDrawedStickers()
    gIsMouseDown = true;

    meme.lines.map((line, idx) => {
        let width = gCtx.measureText(line.txt).width;
        let height = line.size;

        if (offsetX >= line.x - (width / 2) &&
            offsetX <= line.x + (width / 2) &&
            offsetY >= line.y - (height / 2) &&
            offsetY <= line.y + (height / 2)) {
            gIsLineSelected = true;
            setLineIdx(idx);
            drawSelectionRect()
            document.querySelector('.txt-input').value = line.txt;
        }
        else {
            gIsLineSelected = false;
        }
    })

    drawedStcs.map((sticker) => {
        let width = 80;
        let height = 80;


        if (offsetX >= sticker.x - (width / 2) &&
            offsetX <= sticker.x + (width / 2) &&
            offsetY >= sticker.y - (height / 2) &&
            offsetY <= sticker.y + (height / 2)) {
            gIsStickerSelected = true
            setStickerId(sticker.id);
            drawSelectionRect()
        }
        else {
            gIsStickerSelected = false;
        }

    })
}

function onCanvasUp() {
    gIsMouseDown = false;
    gIsLineSelected = false;
    gIsStickerSelected = false;
}

function onCanvasMove(ev) {
    if (!gIsMouseDown && !gIsLineSelected && !gIsStickerSelected) return;
    const { offsetX, offsetY } = ev;
    var { movementX, movementY } = ev;
    var newPosX = offsetX + movementX;
    var newPosY = offsetY + movementY;
    var meme = getMeme()

    if (gIsLineSelected) {
        setNewLinePos(meme.lines[meme.selectedLineIdx], newPosX, newPosY)
        renderCanvas()
        drawSelectionRect()
    }
    else if (gIsStickerSelected) {
        setNewStcPos(meme.selectedStcId, newPosX, newPosY)
        renderCanvas()
    }

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

// **** KEYWORDS FUNCTIONS*** //

function renderKeywords() {
    const keywordsMap = getKeywordsForDisplay();
    var strHTML = ``;

    for (var key in keywordsMap) {
        var fontSize = keywordsMap[key] + 0.6 + 'rem';
        strHTML += `
        <div class="keyword" onclick="onSelectWord('${key}')" style="font-size: ${fontSize};">${key}</div>
        `
    }

    document.querySelector('.search-words').innerHTML = strHTML;
}

function onSelectWord(ward) {
    var matchImgs = getMatchSearchs(ward)
    updateWardsMap(ward)
    renderKeywords()
    renderImgs(matchImgs)
}

function onOpenKeywords(elBtn) {
    document.body.classList.toggle('opened')
    elBtn.innerText = (document.body.className === 'opened') ? 'Close' : 'More';
}

// ****** STICKERS FUNCTIONS ***** //

function onAddSticker(stickerId) {
    var sticker = getStickerById(stickerId)
    var x = gCanvas.width / 2;
    var y = gCanvas.height / 2;
    updateDrawedStickers(sticker)
    setStickerPos(sticker, x, y);
    drawSticker(sticker)
}

function drawSticker(sticker) {
    const img = new Image();
    img.onload = () => {
        gCtx.drawImage(img, sticker.x, sticker.y, 80, 80);;
    }
    img.src = sticker.url;
}

function renderStickers() {
    const stickers = getStickersForDisplay();
    var strHTML = stickers.map((sticker, idx) => {
        return `
        <img src="${sticker.url}" class="sticker sticker${idx}" onclick="onAddSticker('${sticker.id}')"/>`
    })
    document.querySelector('.stickers-container').innerHTML = strHTML.join(' ');
}

function onNextSticker() {
    goNextSticker();
    renderStickers();
}
function onPrevSticker() {
    goPrevSticker()
    renderStickers();
}

// *****SEARCH FUNCTIONS***** //

function onSearchText(elSearch) {

    if (elSearch.value === '') {
        var imgs = getImagesForDisplay()
        renderImgs(imgs)
        return
    }
    var matchImgs = getMatchSearchs(elSearch.value);
    renderImgs(matchImgs);
}


//**** FUNCTIONS FOR UPDATE IN FUTURE ****//


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
