'use strict';


var gCanvas = document.getElementById('meme-canvas');
console.log("gCanvas", gCanvas)
var gCtx = gCanvas.getContext('2d');
// var gImgObj;


function init() {;
    var imgs = getImagesForDisplay()
    renderImgs(imgs);
}


function onOpenMemeEditor(imgId) {
    var meme = _createMeme(imgId);
    renderCanvas(meme);
    toggleView()
    // renderTxtsEditor();
}

function renderCanvas(meme) {
    console.log("renderCanvas -> meme", meme)
    let chosenImg = getImgById(meme.selectedImgId)
    // drawImg(img, meme)
    const img = new Image();
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);  
        drawTxt(meme.lines[0])
    }
    img.src = chosenImg.url;
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
    gCtx.font = line.size + 'px' + ' ' + line.fontFamily;
    gCtx.textAlign = line.align;
    gCtx.fillStyle = line.color;
    console.log("drawTxt -> line.color", line.color)
    // gCtx.font = '40px impact';
    // gCtx.textAlign = 'left';
    // gCtx.fillStyle = 'red';
    // if (txt.isShadow) addTxtShadow(txt);
    // if (txt.isOutline) addTxtOutline(txt);
    gCtx.fillText(line.txt, line.x, line.y);
    console.log("drawTxt -> line.txt", line.txt)
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

/**
 * editTxt() gets changes for txt and update gMeme model.
 * Update gMeme.txts[].txt = {property:value}
 * Redraws canvas.
 * Input types: text, number, checkbox, dropdown.
 * 
 *  txtIdx - the specific txt to change in []. it's line num -1 because idx starts with 0.
 *  property - (using data-* attributes) ex. line, size, align, color, isShadow.. 
 *  value - ex. 'text', 30, left, red, true..
 */
function editTxt(elinput, txtIdx) {
    var property = elinput.dataset.property;  // using data-* attributes
    var value;

    switch (elinput.type) {
        case 'select-one':
            value = elinput.options[elinput.selectedIndex].value;
            break;
        case 'checkbox':
            value = elinput.checked;
            break;
        default: // text, number
            value = elinput.value;
            break;
    }
    gMeme.txts[txtIdx][property] = value;

    drawCanvas();
}


function renderTxtsEditor() {
    var strHtml = gMeme.txts.map(function (txt, idx) {
        return `
        <div class="txt-editor">
                   
                    <p>
                    <button onclick="deleteTxt(${idx})"><i class="fas fa-eraser"></i></button>
                    <input type="text" data-property="line" placeholder="${txt.line}" oninput="editTxt(this,${idx})">
                    <i class="fas fa-text-height"></i> <input type="range" value="${txt.size}"  min="10" step="2" data-property="size" oninput="editTxt(this ,${idx})">
                    <input type="color" value="${txt.color}" data-property="color" oninput="editTxt(this,${idx})">
                    Family: 
                    <select data-property="fontFamily" oninput="editTxt(this,${idx})">
                    <option value="${txt.fontFamily}">${txt.fontFamily}</option>
                    <option value="Tahoma">Tahoma</option>
                    <option value="Geneva">Geneva</option>
                    <option value="Verdana">Verdana</option>
                    </select>
                    </p>

                    <p>
                    <i class="fas fa-arrows-alt-h"></i> <input type="number" value="${txt.x}"  min="0" step="5" data-property="x" oninput="editTxt(this ,${idx})">
                    <i class="fas fa-arrows-alt-v"></i> <input type="number" value="${txt.y}"  min="0" step="5" data-property="y" oninput="editTxt(this ,${idx})">

                    <select data-property="align" oninput="editTxt(this,${idx})">
                    <option value="left">left</option>
                    <option value="center">center</option>
                    <option value="right">right</option>
                     </select>
                    </p>

                    <p>
                    <input id="outline" type="checkbox" data-property="isOutline" checked onclick="editTxt(this,${idx})">
                    <label for="outline">Outline</label>
                    Width: <input type="number" value="${txt.lineWidth}"  min="0" step="1" data-property="lineWidth" oninput="editTxt(this ,${idx})">
                    <input type="color" value="${txt.strokeStyle}" data-property="strokeStyle" oninput="editTxt(this,${idx})">
                    </p>
                    <p>
                    
                    <input id="shadow" type="checkbox" data-property="isShadow" onclick="editTxt(this,${idx})">
                    <label for="shadow">Shadow</label>
                    <input type="color" value="${txt.shadowColor}" data-property="shadowColor" oninput="editTxt(this,${idx})">
                    <i class="fas fa-arrows-alt-h"></i> <input type="number" value="${txt.shadowOffsetX}"  step="1" data-property="shadowOffsetX" oninput="editTxt(this ,${idx})">
                    <i class="fas fa-arrows-alt-v"></i><input type="number" value="${txt.shadowOffsetY}"  step="1" data-property="shadowOffsetY" oninput="editTxt(this ,${idx})">
                    Blur: <input type="number" value="${txt.shadowBlur}" data-property="shadowBlur" oninput="editTxt(this,${idx})">
                    </p>
                 
                </div>
        `
    })
        .join(' ');

    document.querySelector('.txts-list').innerHTML = strHtml;

}

function newTxtBtnClicked() {
    gMeme.txts.push(_createTxt('New Line', 150, 150));
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
        console.log("renderImgs -> img.id", img.id)
        
        return `
        <div class="img-container"><img id='${img.id}' src='${img.url}' onclick="onOpenMemeEditor('${img.id}',this)" alt='meme picture'/></div>
        `
    })

    document.querySelector('.gallery').innerHTML = strHtml.join(' ');
}
