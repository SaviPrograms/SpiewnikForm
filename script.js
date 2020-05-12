let DOMElements = {};
let data = {
    songList: {}
};

async function menager() {
    await preload();
    await load();
    await start();
}

async function preload() {
    DOMElements.curtine = document.getElementById('curtine');
    DOMElements.ranking = document.getElementById('ranking');
    DOMElements.form=document.getElementsByTagName('form')[0];
    data.songList.fromDB = await db.songs.getAll();
    data.songList.current = data.songList.fromDB;
    data.songList.ghost = {
        pos: -1,
        data: {}
    };

    DOMElements.curtine.onanimationend = () => {
        DOMElements.curtine.style.display = "none";
    }
}

async function load() {
    updateSongList();
    DOMElements.input = document.getElementById("input");
    DOMElements.input.addEventListener('keydown', (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
            addNewSong();
        }
    })
}

function start() {
    DOMElements.curtine.style.webkitAnimationPlayState = "running";

}

function updateSongList() {
    let tekst = '';
    for (let [i, x] of data.songList.current.entries()) {
        if (i == data.songList.ghost.pos) {
            tekst +=
                `
                <div class="ghost">
                    <i class="material-icons">reorder</i>
                    <input type="number" min="1" max="999">
                    <span>${data.songList.ghost.data.title}</span>
                    <i class="material-icons">expand_less</i>
                    <i class="material-icons">expand_more</i>
                </div>
                <div>
                    <i class="material-icons">reorder</i>
                    <input type="number" min="1" max="999" value="${i+1}">
                    <span>${x.title}</span>
                    <i class="material-icons">expand_less</i>
                    <i class="material-icons">expand_more</i>
                </div>`
        } else {
            tekst +=
                `<div>
                    <i class="material-icons">reorder</i>
                    <input type="number" min="1" max="999" value="${i+1}" onchange="setSongPos(${i}, this.value-1)">
                    <span>${x.title}</span>
                    <i class="material-icons" onclick="setSongPos(${i},${i}-1)">expand_less</i>
                    <i class="material-icons" onclick="setSongPos(${i},${i}+1)">expand_more</i>
                </div>`
        }
    }
    tekst +=
        `<div id="input">
                    <i class="material-icons" onclick="addNewSong()">add</i>
                    <input type="number" min="1" max="999">
                    <input type="text" ">
                </div>`;
    DOMElements.ranking.innerHTML = tekst;
}

function addNewSong() {
    let text = DOMElements.input.querySelectorAll("input[type='text']")[0].value;
    text = text.toProperCase();
    if (text == "" || data.songList.current.some(x=>x.title == text)) return
    data.songList.current.push({
        title: text
    });
    load();
}

function setSongPos(id, pos) {
    data.songList.current.move(id, pos);
    load();
}

String.prototype.toProperCase = function () {
    let zdanie = this.toLowerCase().replace(/\s+/g, ' ').trim().split(" ");
    /*for(let i = 0; i<zdanie.length; i++){
        if(zdanie[i].length>2)zdanie[i]=zdanie[i][0].toUpperCase()+zdanie[i].slice(1);
    }*/
    let text = zdanie.join(" ");
    return text[0].toUpperCase() + text.slice(1);
};

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

async function mySubmitFunction(e) {
    e.preventDefault();
    for (let [i, x] of data.songList.current.entries()){
        if(!(await db.songs.getAll()).some(y=>y.title==x.title))x = await db.songs.add(x.title);
        await db.answers.add(x, DOMElements.form.elements.namedItem('team').value,DOMElements.form.elements.namedItem('func').value, i+1);
    }
    window.location.replace("after-form.html");
    return false;
}
