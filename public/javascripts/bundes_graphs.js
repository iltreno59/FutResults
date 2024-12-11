async function main() {
    fetch('http://localhost:3000/api/bundes')
    .then(response => response.json())
    .then(bundes_data => {
        var data1 = [
        {
            x: bundes_data.teams,
            y: bundes_data.wins,
            type: 'bar'
        }
        ];
        var layout1 = {
            title:{
                text: "Teams sorted by victories"
            }
        }
        Plotly.newPlot('wins', data1, layout1);
        var trace1 ={
            x: bundes_data.teams,
            y: bundes_data.scored_goals,
            name: "Scored",
            type: "bar"
        }
        var trace2 ={
            x: bundes_data.teams,
            y: bundes_data.conceded_goals,
            name: "Conceded",
            type: "bar"
        }
        var data2 = [trace1, trace2];
        var layout2 = {
            xaxis: {
              title: {
                text: ''
              }
            },
            yaxis: {
              title: {
                text: 'Goals'
              }
            },
            barmode: 'relative',
            title: {
              text: 'Teams and their scored and conceded goals'
            }
          };
          Plotly.newPlot('goals', data2, layout2)
    })
}

document.addEventListener('DOMContentLoaded', main);
