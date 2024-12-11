async function main(){
    fetch('http://localhost:3000/api/globalsport')
    .then(response => response.json())
    .then(globalsport_data => {
        var data1 = [{
            values: globalsport_data.games_n,
            labels: globalsport_data.times,
            type: 'pie'
        }];
        var layout1 = {
            title: 'Most popular times for game start'
        };
        Plotly.newPlot('times', data1, layout1);

        var data2 = [{
            x: globalsport_data.teams,
            y: globalsport_data.wins,
            type: 'bar'
        }];
        var layout2 = {
            title: "Teams with the most wins"
        };
        Plotly.newPlot('wins', data2, layout2);
    })
}
document.addEventListener('DOMContentLoaded', main);