'use strict';


var gMeme;
var gImgs = _createImgs();
let gNextId = 0;



function getImagesForDisplay() {
    return gImgs;
}

function getImgById(imgId){
    return gImgs.find((img)=> img.id === imgId);
}


function getImgSrc() {
    // imgIdx needed to find img src url in gImg[]
    var imgIdx = gImgs.findIndex(function (img) {
        return gMeme.selectedImgId === img.id;
    });

    return gImgs[imgIdx].url;
}


function _createMeme(imgId) {
    return {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [_createTxt('Your Text', 150, 70), _createTxt('Your Text', 150, 70)]
    }
};


function _createTxt(txt, x, y) {
    return {
        //object txt = {property:value}
        txt,
        size: 40,
        align: 'left',
        color: '#000000', // in color picker, if choosing color from platte notice it stays "solid".
        fontFamily: 'Impact',
        isOutline: true,
        lineWidth: 2, // outline width
        strokeStyle: '#ffffff',
        isShadow: false,
        shadowColor: '#000000',
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 0,
        x: x,
        y: y
    };
}


function _createImgs() {
    var imgs = [];

    imgs.push(
        _createImage('/img/1.jpg', ['fun']),
        _createImage('/img/3.jpg', ['happy']),
        _createImage('/img/4.jpg', ['happy']),
        _createImage('/img/5.jpg', ['happy']),
        _createImage('/img/6.jpg', ['happy']),
        _createImage('/img/7.jpg', ['happy']),
        _createImage('/img/8.jpg', ['happy']),
        _createImage('/img/9.jpg', ['happy']),
        _createImage('/img/10.jpg', ['happy']),
        _createImage('/img/11.jpg', ['sad']));
console.log(imgs);
    return imgs;
}

function _createImage(url, keywords) {
    return {
        id: makeId(),
        url,
        keywords
    };
}