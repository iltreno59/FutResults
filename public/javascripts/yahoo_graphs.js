async function main(){
    fetch('http://localhost:3000/api/yahoo')
    .then(response => response.json())
    .then(yahoo_data => {
        var data1 = [{
            x: yahoo_data.teams,
            y: yahoo_data.wins,
            type: 'bar'
        }];
        var layout1 = {
            title: 'Teams sorted by wins'
        };
        Plotly.newPlot('wins', data1, layout1);

        var trace1 ={
            x: yahoo_data.teams,
            y: yahoo_data.scored_goals,
            name: "Scored",
            type: "bar"
        }
        var trace2 ={
            x: yahoo_data.teams,
            y: yahoo_data.conceded_goals,
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
    });
}
document.addEventListener('DOMContentLoaded', main);