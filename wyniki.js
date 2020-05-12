let ctx;
let data={};
let chart;
let gradient;
async function start(){
    let canvas = document.getElementById('chart1');
    ctx = canvas.getContext('2d');
    gradient = ctx.createLinearGradient(0,canvas.height, canvas.width,0);
    gradient.addColorStop(0,'#ee0979');
    gradient.addColorStop(1,'#ff6a00');
    
    await getData();
    show();
}

async function getData(){
    data = {
        labels: (await db.songs.getAll()).map(x=>x.title),
        datasets:[
            {
                label:'Harcerze',
                backgroundColor:'green',
                data:[]
            },
             {
                label:'zuchy',
                backgroundColor:'yellow',
                data:[]
            },
            {
                label:'Wędrownicy',
                backgroundColor:'red',
                data:[]
            },
            {
                label:'Rada szczepu',
                backgroundColor:'purple',
                data:[]
            },
        ]
    };
    data.datasets[0].data=await funkcja({$or:[{team:'4ldh'},{team:'7ldh'},{team:'45ldh'},{team:'48ldh'}]});
    data.datasets[1].data=await funkcja({$or:[{team:'zbt'},{team:'zrp'}]});
    data.datasets[2].data=await funkcja({team:'47ldh'});
    data.datasets[3].data=await funkcja({team:'rs'});
}

function show(){
    chart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
        scales: {
            xAxes:[{
                stacked:true
            }],
            yAxes: [{
                stacked: true,
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
}

window.onbeforeprint= function (e) {
    for (var id in Chart.instances) {
        Chart.instances[id].resize();
    }
}

async function funkcja(filter = {}){
    let tab = [];
    labels = await db.songs.getAll();
    for(x of labels){
        let suma = 0;
        let query = await db.answers.find({$and:[{from_id:x},filter]});
        for(y of query){
            suma+=y.position;
        }
        tab.push(1/suma);
    }
    return tab;
    
   /* let tab = [];
    labels.forEach(
        x=>{
            let suma = 0;
            
            for(y in (await db.answers.find({title:x, $or:[{team:'4ldh'},{team:'7ldh'},{team:'45ldh'},{team:'48ldh'}]}))){
                suma+=y.position;
            }
            tab.push(suma);
        }
    )
    return tab*/
}