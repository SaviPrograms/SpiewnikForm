

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
