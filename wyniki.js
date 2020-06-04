console.log(
    "%cCześć, czuwaj, a może H3110",
    "color: green; font-size: 2em"
)
console.log(
    `%cOj ty hakerku!!!%c
Skoro tu jesteś, to znaczy, że interesujesz się programowaniem/tworzeniem stron?
Ja tak, dlatego, wiedząc, że ktoś inny też może się tym zaciekawić przygotowałem dla Ciebie opis wszystkiego co zrobiłem.
Miłego przeglądania 😉
%c-Seweryn`, "text-decoration: line-through","", "color:gray"
)

let DOMElements = {};
let data = {
    titles: [],
    answers: [],
    dates: new Map()
};
let gradient;
let codeElements = {};

getData();

addEventListener("DOMContentLoaded", (event) => {
    DOMElements.dataplace = document.getElementById('data');
    DOMElements.canvases = document.getElementsByTagName('canvas');
})

addEventListener('load', (event) => {
    let ctxes = [
        DOMElements.canvases[0].getContext('2d'),
        DOMElements.canvases[1].getContext('2d'),
        DOMElements.canvases[2].getContext('2d')
    ]
    gradient = ctxes[2].createLinearGradient(0, 200, 200, 0);
    gradient.addColorStop(0, '#ee0979');
    gradient.addColorStop(1, '#ff6a00');

    codeElements.charts = [
        new Chart(ctxes[0], {
            type: 'bar',
            options: {
                responsive:true,
                scales: {
                    xAxes: [{
                        stacked: true
            }],
                    yAxes: [{
                        stacked: true
            }]
                }
            }
        }),
        new Chart(ctxes[1], {
            type: 'bar',
            options: {
                responsive:true,
                scales: {
                    xAxes: [{
                        stacked: true
            }],
                    yAxes: [{
                        stacked: true
            }]
                }
            }
        })
    ]
})

addEventListener('loaded', (event) => {
    codeElements.charts[0].data = {
        labels: data.titles,
        datasets: [
            {
                label: 'Radosne pszczółki',
                data: getSongsByTeam('zrp'),
                backgroundColor: '#ffc107'
            },
            {
                label: 'Brykające tygryski',
                data: getSongsByTeam('zbt'),
                backgroundColor: '#ff5722'
            },
            {
                label: '4ŁDH',
                data: getSongsByTeam('4ldh'),
                backgroundColor: '#e91e63'
            },
            {
                label: '7ŁDH',
                data: getSongsByTeam('7ldh'),
                backgroundColor: '#673ab7'
            },
            {
                label: '45ŁDH',
                data: getSongsByTeam('45ldh'),
                backgroundColor: '#2196f3'
            }, {
                label: '48ŁDH',
                data: getSongsByTeam('48ldh'),
                backgroundColor: '#00bcd4'
            },
            {
                label: '47ŁWDH',
                data: getSongsByTeam('47lwdh'),
                backgroundColor: '#009688'
            },
            {
                label: 'Rada szczepu',
                data: getSongsByTeam('rs'),
                backgroundColor: '#4caf50'
            },
        ]
    }
    codeElements.charts[1].data = {
        labels: data.titles,
        datasets: [
            {
                label: 'Bez funkcji',
                data: getSongsByFunction('bf'),
                backgroundColor: '#607d8b'
            },
            {
                label: 'Podzastępowy',
                data: getSongsByFunction('pz'),
                backgroundColor: '#795548'
            },
            {
                label: 'Zastępowy',
                data: getSongsByFunction('z'),
                backgroundColor: '#4e342e'
            },
            {
                label: 'Przyboczny',
                data: getSongsByFunction('pr'),
                backgroundColor: '#4caf50'
            },
            {
                label: 'Drużynowy',
                data: getSongsByFunction('d'),
                backgroundColor: '#3f51b5'
            },
            {
                label: 'Rada drużyny/szczepu',
                data: getSongsByFunction('r'),
                backgroundColor: '#00bcd4'
            },
        ]
    }
    codeElements.charts[0].update();
    codeElements.charts[1].update();
})

async function getData() {
    data.titles = (await db.songs.orderBy("date", "asc").get()).docs.map(x => x.data().title)
    let odpowiedzi = (await db.answers.get()).docs.map(x => x.data());

    for ([i, x] of odpowiedzi.entries()) {
        for (song of x.songs) {
            data.answers.push({
                team: x.team,
                func: x.func,
                title: song.title,
                pos: x.songs.indexOf(song),
            });
        }
    }
    dispatchEvent(new Event("loaded"));
}

function getSongsByTeam(team) {
    let arr = [];
    for ([i, x] of data.titles.entries()) {
        let suma = 0;
        for ([j, y] of data.answers.filter(z => z.team == team && z.title == x).entries()) {
            suma += y.pos + 1;

        }
        arr[i] = suma / (data.answers.filter(z => z.title == x).length);
    }
    return arr
}

function getSongsByFunction(func) {
    let arr = [];
    for ([i, x] of data.titles.entries()) {
        let suma = 0;
        for ([j, y] of data.answers.filter(z => z.func == func && z.title == x).entries()) {
            suma += y.pos + 1;

        }
        arr[i] = suma / (data.answers.filter(z => z.title == x).length);
    }
    return arr
}
