'use strict';

const MEMES_KEY = 'myMemes';
var gMeme;
var gMemes = [];
var gImgs = _createImgs();
var gKeywords = {
    'animals': 1,
    'babies': 1,
    'presidents': 1,
    'men': 1,
    'women': 1,
    'tired':1
}


// ***** GET ELEMENTS FOR CONTROLLER FUNCTIONS ***** //

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

function getKeywordsForDisplay(){
    return gKeywords;
}

// ***** EDIT LINE FUNCTIONS ***** //


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
    gMeme.selectedLineIdx = 0;
}

function setNewLinePos(line, newX, newY) {
    line.x = newX
    line.y = newY
}


function addLine(txt = 'Enter your text here', x, y) {
    var line = {
        txt,
        size: 40,
        align: 'center',
        color: '#ffffff',
        strokeStyle: '#000000',
        lineWidth: '4',
        fontFamily: 'Impact',
        x,
        y
    };
    gMeme.lines.push(line)

}

function saveMeme(canvas) {
    var memeToSave = {
        id: makeId(),
        meme: gMeme,
        canvasData: canvas.toDataURL()
    }
    gMemes.push(memeToSave);
    saveToStorage(MEMES_KEY, gMemes)
}

function getSavedMemeById(savedMemeId) {
    var savedMemeData = gMemes.find(savedMeme => {
        if (savedMeme.id === savedMemeId) return savedMeme.meme;
    })
    return savedMemeData.meme;
}

function editSavedMeme(savedMeme) {
    gMeme = savedMeme;
}

function getSavedMemes() {
    gMemes = loadFromStorage(MEMES_KEY)

    return gMemes;
}

function getMatchSearchs(value) {
    var matchImgs = []

    gImgs.map(img => {
        img.keywords.map(keyword => {
            if (keyword.toLowerCase().includes(value)) {
                matchImgs.push(img);
            }
        })
    })
    return matchImgs;
}


// ***** CREATE FUNCTIONS *** //

function _createMeme(imgId) {
    let meme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: []
    }
    gMeme = meme;
    addLine('Text', 250, 70);
};


function _createImgs() {
    var imgs = [];

    imgs.push(
        _createImage('./img/1.jpg', ['fun']),
        _createImage('./img/3.jpg', ['happy', 'animals']),
        _createImage('./img/4.jpg', ['happy', 'animals']),
        _createImage('./img/5.jpg', ['happy', 'babies']),
        _createImage('./img/6.jpg', ['happy']),
        _createImage('./img/7.jpg', ['happy', 'babies']),
        _createImage('./img/8.jpg', ['happy']),
        _createImage('./img/9.jpg', ['happy', 'babies']),
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





// function getImgSrc() {
//     // imgIdx needed to find img src url in gImg[]
//     var imgIdx = gImgs.findIndex(function (img) {
//         return gMeme.selectedImgId === img.id;
//     });

//     return gImgs[imgIdx].url;
// }


// if (!gMemes) {
    //     gMemes = [];
    //     gMemes.push(
    //         {
    //             id: 100,
    //             meme: {
    //                 selectedImgId: 100,
    //                 selectedLineIdx: 0,
    //                 lines: [{
    //                     txt: 'You Don\'t have saved memes yet!',
    //                     size: 70,
    //                     align: 'center',
    //                     color: '#ffffff',
    //                     strokeStyle: '#000000',
    //                     lineWidth: '4',
    //                     fontFamily: 'Impact',
    //                     x: 200,
    //                     y: 200

    //                 }]

    //             }
    //         }
    //     )
    // }
    // else if (gMemes[0].id === 100 && gMemes.length === 2) {
    //     gMemes.splice(0, 1);
    // }