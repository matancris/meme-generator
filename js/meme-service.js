'use strict';

const MEMES_KEY = 'myMemes';
var gMeme;
var gMemes = [];
var gImgs = _createImgs();



function getImagesForDisplay() {
    return gImgs;
}

function createMeme(imgId) {
    _createMeme(imgId);
}

function getImgById(imgId) {
    return gImgs.find((img) => img.id === imgId);
}

function getLineByIdx() {
    return gMeme.lines[gMeme.lines.length - 1];
}

function getMeme() {
    return gMeme;
}


function editTxt(elInput) {
    var key = elInput.dataset.key;
    var value;

    switch (elInput.type) {
        case 'select-one':
            value = elInput.options[elInput.selectedIndex].value;
            break;
        default: 
            value = elInput.value;
            break;
    }
    gMeme.lines[gMeme.selectedLineIdx][key] = value;

}

function setLineIdx(idx) {
    gMeme.selectedLineIdx = idx;
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedStckrIdx = 0;
}

function setNewLinePos(line, newX, newY) {
    console.log("setNewLinePos -> newY", newY)
    console.log("setNewLinePos -> newX", newX)
    line.x = newX
    line.y = newY
}



function addLine(txt = 'Enter your text here', x, y) {
    var line = {
        txt,
        size: 40,
        align: 'center',
        color: '#000000', 
        fontFamily: 'Impact',
        x,
        y
    };
    gMeme.lines.push(line)

}

function saveMeme() {
    gMemes.push(gMeme);
    saveToStorage(MEMES_KEY, gMemes)
}

function _createMeme(imgId) {
    let meme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: []
    }
    gMeme = meme;
    addLine('Text', 200, 70);
};


function _createImgs() {
    var imgs = [];

    imgs.push(
        _createImage('./img/1.jpg', ['fun']),
        _createImage('./img/3.jpg', ['happy']),
        _createImage('./img/4.jpg', ['happy']),
        _createImage('./img/5.jpg', ['happy']),
        _createImage('./img/6.jpg', ['happy']),
        _createImage('./img/7.jpg', ['happy']),
        _createImage('./img/8.jpg', ['happy']),
        _createImage('./img/9.jpg', ['happy']),
        _createImage('./img/10.jpg', ['happy']),
        _createImage('./img/11.jpg', ['sad']));
    return imgs;
}

function _createImage(url, keywords) {
    return {
        id: makeId(),
        url,
        keywords
    };
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}



// function getImgSrc() {
//     // imgIdx needed to find img src url in gImg[]
//     var imgIdx = gImgs.findIndex(function (img) {
//         return gMeme.selectedImgId === img.id;
//     });

//     return gImgs[imgIdx].url;
// }