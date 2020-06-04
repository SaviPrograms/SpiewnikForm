/*


//TODO: Zmienić na klase

const db = {
    apikey: '5eb5908fa020071c9ca813cd',
    songs: {
        address: 'https://spiewnik-f3be.restdb.io/rest/songs',
        getAll: async () => {
            const response = await fetch(db.songs.address, {
                method: "GET",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": db.apikey,
                    "cache-control": "no-cache"
                },
            });
            return response.json()
        },
        add: async (title) => {
            const response = await fetch(db.songs.address, {
                method: "POST",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": db.apikey,
                    "cache-control": "no-cache"
                },
                body: JSON.stringify({
                    title: title
                })
            });
            return response.json()
        },
        update: async (id, data) => {
            const response = await fetch(db.songs.address + '/' + id, {
                method: "PUT",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": db.apikey,
                    "cache-control": "no-cache"
                },
                body: JSON.stringify(data)
            });
            return response.json()
        },
        delete: async (id) => {
            const response = await fetch(db.songs.address + '/' + id, {
                method: "DELETE",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": db.apikey,
                    "cache-control": "no-cache"
                },
            });
            return response.json()
        },
        find: async (query)=>{
            const response = await fetch(db.songs.address+`?q=`+JSON.stringify(query), {
                method: "GET",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": db.apikey,
                    "cache-control": "no-cache"
                },
            });
            return response.json()
        }
    },
    answers: {
        address: 'https://spiewnik-f3be.restdb.io/rest/answers',
        getAll: async () => {
            const response = await fetch(db.answers.address, {
                method: "GET",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": db.apikey,
                    "cache-control": "no-cache"
                },
            });
            return response.json()
        },
        add: async (songTitle, team, funct, pos) => {
            const response = await fetch(db.answers.address, {
                method: "POST",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": db.apikey,
                    "cache-control": "no-cache"
                },
                body: JSON.stringify({
                    from_id:songTitle,
                    team:team,
                    function:funct,
                    position:pos
                })
            });
            return response.json()
        },
        update: async (id, data) => {
            const response = await fetch(db.answers.address +"/"+ id, {
                method: "PUT",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": db.apikey,
                    "cache-control": "no-cache"
                },
                body: JSON.stringify(data)
            });
            return response.json()
        },
        delete: async (id) => {
            const response = await fetch(db.answers.address +"/"+ id, {
                method: "DELETE",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": db.apikey,
                    "cache-control": "no-cache"
                },
            });
            return response.json()
        },
        find: async (query)=>{
            const response = await fetch(db.answers.address+`?q=`+JSON.stringify(query), {
                method: "GET",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": db.apikey,
                    "cache-control": "no-cache"
                },
            });
            return response.json()
        }
    }
}
*/
firebase.initializeApp({
    apiKey: "AIzaSyDFrOW1Xp9Oc9S-gNThrc4jUZwUqpBw7u4",
    authDomain: "spiewnik-e2282.firebaseapp.com",
    databaseURL: "https://spiewnik-e2282.firebaseio.com",
    projectId: "spiewnik-e2282",
    storageBucket: "spiewnik-e2282.appspot.com",
    messagingSenderId: "766835940071",
    appId: "1:766835940071:web:960c399ceaf8d039842042",
    measurementId: "G-15S0WW8DQ5"
});
const database = firebase.firestore();
const db = {
    songs: database.collection('songs'),
    answers: database.collection('answers')
}