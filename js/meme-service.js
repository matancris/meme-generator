'use strict';

// ***** GLOBAL VARIABELS ***** //

const MEMES_KEY = 'myMemes';
var gMeme;
var gMemes = [];
var gImgs = _createImgs();
var gStickers = _createStickers();
var gStickersIdx = 0;
var gDrawedStcs = [];
var gKeywords = {
    'animals': 1,
    'babies': 1,
    'presidents': 1,
    'celebs': 1,
    'movies': 1,
    'tired': 1,
    'happy': 1,
    'sad': 1,
    'funny': 1
}

// ***** GALLERYFUNCTIONS ***** //

function getImagesForDisplay() {
    return gImgs;
}

function getImgById(imgId) {
    return gImgs.find((img) => img.id === imgId);
}

function _createImgs() {
    var imgs = [];

    imgs.push(
        _createImage('./img/1.jpg', ['fun', 'presidents']),
        _createImage('./img/2.jpg', ['fun', 'animals']),
        _createImage('./img/3.jpg', ['happy', 'animals', 'tired']),
        _createImage('./img/4.jpg', ['happy', 'animals', 'tired']),
        _createImage('./img/5.jpg', ['happy', 'babies']),
        _createImage('./img/6.jpg', ['happy']),
        _createImage('./img/7.jpg', ['happy', 'babies']),
        _createImage('./img/8.jpg', ['happy']),
        _createImage('./img/9.jpg', ['happy', 'babies']),
        _createImage('./img/10.jpg', ['happy', 'presidents']),
        _createImage('./img/11.jpg', ['sad']),
        _createImage('./img/12.jpg', ['celebs']),
        _createImage('./img/13.jpg', ['celebs', 'movies']),
        _createImage('./img/14.jpg', ['movies', 'serious']),
        _createImage('./img/15.jpg', ['movies']),
        _createImage('./img/16.jpg', ['funny']),
        _createImage('./img/17.jpg', ['presidents']),
        _createImage('./img/18.jpg', ['movies']))
    return imgs;
}

function _createImage(url, keywords) {

    return {
        id: makeId(),
        url,
        keywords
    };
}

// ***** MEME FUNCTIONS ***** //

function _createMeme(imgId) {
    let meme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        selectedStcId: '',
        lines: [],
        stickers: gStickers
    }
    gMeme = meme;
    addLine('Text', 250, 70);
};

function getMeme() {
    return gMeme;
}

// ***** LINE FUNCTIONS ***** //

function getLineByIdx() {
    return gMeme.lines[gMeme.lines.length - 1];
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

// **** LOCAL STORAGE FUNCTIONS **** //

function saveMeme(canvas) {
console.log("saveMeme -> canvas", canvas)
    
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
    if (!gMemes) return [];
    return gMemes;
}

// ***** KEYWORDS/SEARCH FUNCTIONS *****//


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

function updateWardsMap(key) {
    gKeywords[key] += 0.1;
}

function getKeywordsForDisplay() {
    return gKeywords;
}

// ***** STICKERS FUNCTIONS *** //




// ***** STICKERS FUNCTIONS ***** //

function getStickersForDisplay() {
    var startIdx = 0;
    var stickers = gStickers;

    return stickers.slice(startIdx, startIdx + 4);
}

function goNextSticker() {
    var currSticker = gStickers.splice(0, 1);
    gStickers.push(currSticker[0]);
}

function goPrevSticker() {
    var currSticker = gStickers.splice(gStickers.length - 1, 1);
    gStickers.unshift(currSticker[0]);
}

function setStickerPos(sticker, x, y) {
    sticker.x = x;
    sticker.y = y;
}

function setStickerId(stickerId) {
    gMeme.selectedStcId= stickerId
}

function setNewStcPos(stickerId, newPosX, newPosY) {
    var sticker = getStickerById(stickerId);
    sticker.x = newPosX;
    sticker.y = newPosY;
}

function updateDrawedStickers(sticker) {
    if (sticker === 'init') {
        gDrawedStcs = [];
        return
    }
    gDrawedStcs.push(sticker);
}

function getDrawedStickers() {
    return gDrawedStcs;
}

function getStickerById(stickerId) {
    return gStickers.find(sticker => {
        return sticker.id === stickerId;
    })
}

function getStickers() {
    return gStickers;
}

function _createStickers() {
    var stickers = [];

    stickers.push(
        _createSticker('./stickers/1.svg'),
        _createSticker('./stickers/2.svg'),
        _createSticker('./stickers/3.svg'),
        _createSticker('./stickers/4.svg'),
        _createSticker('./stickers/5.svg'),
        _createSticker('./stickers/6.svg'),
        // _createSticker(url),
        // _createSticker(url),
        // _createSticker(url)
    )

    return stickers;
}

function _createSticker(url) {
    return {
        id: makeId(),
        url,
        x: 50,
        y: 50
    }
}


// **** FUNCTIONS TO UPDATE IN FUTURE **** //

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