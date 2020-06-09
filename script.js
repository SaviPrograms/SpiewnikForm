console.log(
    "%cCześć, czuwaj, a może H3110",
    "color: green; font-size: 2em"
)
console.log(
    `%cOj ty hakerku!!!%c
Skoro tu jesteś, to znaczy, że interesujesz się programowaniem/tworzeniem stron?
Ja tak, dlatego, wiedząc, że ktoś inny też może się tym zaciekawić przygotowałem dla Ciebie opis wszystkiego co zrobiłem.
Miłego przeglądania 😉
%c-Seweryn`, "text-decoration: line-through", "", "color:gray"
)

let iteration = 0;

//Przechowuje wszystkie wykorzystywane elementy DOM-u
let DOMElements = {};
//Przechowuje wszystkie dane stałe, bądź rzadkozmienne
let data = {
    songList: {}
};

//Zarządza uruchamianiem funckcji przy starcie
async function menager() {
    await preload();
    await load();
    await start();
}

//Wywołuje się przy pierwszym uruchomieniu strony
async function preload() {
    //Kurtyna zasłaniająca stronę w czasie ładowania
    DOMElements.curtine = document.getElementById('curtine');
    //Div rankingu piosenek
    DOMElements.ranking = document.getElementById('ranking');
    //Formularz
    DOMElements.form = document.getElementsByTagName('form')[0];

    //Wszystkie piosenki z bazy danych
    data.songList.fromDB = (await db.songs.orderBy("date", "asc").get()).docs.map(x => x.data());
    //Obszar roboczy
    data.songList.current = [...data.songList.fromDB];
    //Duch piosenki 👻
    data.songList.ghost = {
        //Pozycja ducha
        pos: -1,
        //Dane ducha
        data: {
            //Tytuł piosenki
            title: ''
        }
    };

    DOMElements.curtine.onanimationend = () => {
        DOMElements.curtine.style.display = "none"; //Ukrycie kurtyny po zakończeniu animacji
    }
}

//Ładuje wszystkie potrzebne rzeczy(wielorazowo)
async function load() {
    updateSongList(); //Aktualizacja wyświetlanej listy piosenek

    //Wejście tytułu piosenki
    DOMElements.input = document.getElementById("input"); //Pozyskanie nowo utworzonego wejścia piosenek

    //Wywoływane, gdy przycisk wciśnięty w polu input
    DOMElements.input.addEventListener('keydown', (e) => {
        if (e.keyCode == 13) { //Sprawdzenie czy wciśnięty klawisz to ENTER(13)
            e.preventDefault(); //Zabezpieczenie wysłaniu formularza
            addNewSong(); //Dodanie nowej piosenki do obszaru roboczego
        }
    })

    //Wszystkie elementy możliwe do przesunięcia
    DOMElements.draggables = document.querySelectorAll('.draggable');

    //Ustawienie ich działania
    for (x of DOMElements.draggables) {
        dragElement(x); //TODO:Dodać id piosenki
    }


}

//Uruchamia się, gdy strona jest gotowa do prezentacji
function start() {
    DOMElements.curtine.style.webkitAnimationPlayState = "running"; //Odsłonienie kurtyny

}

//Aktualizuje listę piosenek
function updateSongList() {
    let tekst = '';
    for (let [i, x] of data.songList.current.entries()) {
        tekst += `
                <div class="draggable">
                    <i class="material-icons">reorder</i>
                    <input type="number" min="1" max="999" value="${i+1}" onchange="setSongPos(${i}, this.value-1)">
                    <span>${x.title}</span>
                    <i class="material-icons" onclick="setSongPos(${i},${i}-1)">expand_less</i>
                    <i class="material-icons" onclick="setSongPos(${i},${i}+1)">expand_more</i>
                </div>
`
    }
    tekst +=
        `<div id="input">
                    <i class="material-icons" onclick="addNewSong()">add</i>
                    <input type="number" min="1" max="999">
                    <input type="text" ">
                </div>`;
    DOMElements.ranking.innerHTML = tekst;
    iteration++;
}

//Dodaje nową piosenkę do obszaru roboczego
function addNewSong() {
    let text = DOMElements.input.querySelectorAll("input[type='text']")[0].value; //Pobiera tytuł piosenki z pola tekstowego input
    text = text.toProperCase(); //Formatuje tekst
    if (text == "" || data.songList.current.some(x => x.title == text)) return //Kończy działanie funkcji, jeżeli piosenka o tym tytule istnieje
    data.songList.current.push({
        title: text
    }); //Dodaje nową piosenkę do obszru roboczego
    load(); //Aktualizuje obszar roboczy
}

//Zmienia pozycję piosenki w obszarze roboczym
function setSongPos(id, pos) {
    data.songList.current.move(id, pos); //Zmiana pozycji piosenki
    load(); //Aktualizacja obszaru roboczego
}

//Formatuje tekst do wyglądu tytułowego
String.prototype.toProperCase = function () {
    //Słowa z wejścia
    let zdanie = this.toLowerCase().replace(/\s+/g, ' ').trim().split(" "); //Usuwa białe znaki, zbędne spacje, dzieli na słowa //WARN: Możliwe spowolnienia z powodu bezsensowanego kodu
    /*for(let i = 0; i<zdanie.length; i++){
        if(zdanie[i].length>2)zdanie[i]=zdanie[i][0].toUpperCase()+zdanie[i].slice(1); //Zamienia każdą pierwszą literę długiego słowa na dużą
    }*/
    let text = zdanie.join(" "); //Łączy zdanie //WARN: Możliwe spowolnienia z powodu bezsensowanego kodu
    return text[0].toUpperCase() + text.slice(1); //Zwraca zdanie z powiększoną pierwszą literą
};

//Zmienia pozycję danej w tabeli
Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

//Obsługuje zapis danych do bazy
async function mySubmitFunction(e) {
    e.preventDefault(); //Zabezpiecza przed zwyklym submitem
    for (let [i, x] of data.songList.current.entries()) {
        if ((await db.songs.where("title", "==", x.title).get()).docs.length == 0) x = await db.songs.add({
            title: x.title,
            date: firebase.firestore.Timestamp.now()
        });
    }
    await db.answers.add({
        time: firebase.firestore.Timestamp.now(),
        team: DOMElements.form.elements.namedItem('team').value,
        func: DOMElements.form.elements.namedItem('func').value,
        songs: data.songList.current.reverse()
    })
    window.location.replace("after-form.html");
    return false;
}

//Obsługuje przeciąganie elementów draggable
function dragElement(elmnt) {
    let oldPos = {
        x: 0,
        y: 0
    }
    let newPos = {
        x: 0,
        y: 0
    }
    let height;
    //Wykrywanie dotyku
    elmnt.getElementsByTagName('i')[0].onmousedown = dragMouseDown;
    elmnt.getElementsByTagName('i')[0].ontouchstart = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        oldPos.x = e.clientX != undefined ? e.clientX : e.changedTouches[0].clientX;
        oldPos.y = e.clientY != undefined ? e.clientY : e.changedTouches[0].clientY;
        height = elmnt.clientHeight;
        data.songList.ghost.data = data.songList.current[elmnt.querySelector("input[type=number]").value - 1];
        data.songList.ghost.data.id = elmnt.querySelector("input[type=number]").value - 1;
        data.songList.ghost.data.iteration = elmnt.dataset.iteration;

        document.onmouseup = closeDragElement;
        document.ontouchend = closeDragElement;
        elmnt.style.zIndex = 100;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        document.ontouchmove = elementDrag;
        document.ontouchabort = console.log("Przerwano dotyk");
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        newPos.x = e.clientX != undefined ? e.clientX : e.changedTouches[0].clientX;
        newPos.y = e.clientY != undefined ? e.clientY : e.changedTouches[0].clientY;

        // set the element's new position:
        elmnt.style.bottom = oldPos.y - newPos.y + "px";

        //Set ghost new position:
        data.songList.ghost.pos = Math.round((newPos.y - DOMElements.ranking.getBoundingClientRect().top) / height - 1);
        if (data.songList.ghost.pos < 0) data.songList.ghost.pos = 0;
        if (data.songList.ghost.pos >= data.songList.current.length) data.songList.ghost.pos = data.songList.current.length - 1;
        updateGhost()
        //elmnt.style.right = oldPos.x-newPos.x + "px";
    }

    function closeDragElement() {
        elmnt.style.zIndex = 0;
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.ontouchend = null;
        document.onmousemove = null;
        document.ontouchmove = null;
        setSongPos(data.songList.ghost.data.id, data.songList.ghost.pos) //TODO: Zamienić na setSongPos()
    }
}

function updateGhost() {
    let divs = '';
    divs = DOMElements.ranking.querySelectorAll('div:not([class=ghost])');

    if (DOMElements.ghost) DOMElements.ghost.remove();
    for (i in divs) {
        if (((i < data.songList.ghost.data.id && i == data.songList.ghost.pos) || (i > data.songList.ghost.data.id && i == data.songList.ghost.pos + 1))&&data.songList.ghost.pos!=data.songList.ghost.data.id) {
            DOMElements.ghost = DOMElements.ranking.insertBefore(new DOMParser()
                .parseFromString(`<div class="ghost">
                    <i class="material-icons">reorder</i>
                    <input type="number" min="1" max="999">
                    <span>${data.songList.ghost.data.title}</span>
                    <i class="material-icons">expand_less</i>
                    <i class="material-icons">expand_more</i>
                </div>`, 'text/html').body.firstElementChild,
                divs[i]
            )
        }
    }
}
