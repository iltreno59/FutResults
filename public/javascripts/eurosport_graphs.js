async function main() {
    fetch('http://localhost:3000/api/eurosport')
    .then(response => response.json())
    .then(eurosport_data =>{
        var data1 = [{
            y: eurosport_data.draws,
            x: eurosport_data.competitions,
            type: 'bar'
        }];
        var layout1 = {
            title: 'Percentage of draws'
        }
        Plotly.newPlot('draws', data1, layout1);

        var trace1 ={
            x: eurosport_data.teams,
            y: eurosport_data.scored_goals,
            name: "Scored",
            type: "bar"
        }
        var trace2 ={
            x: eurosport_data.teams,
            y: eurosport_data.conceded_goals,
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