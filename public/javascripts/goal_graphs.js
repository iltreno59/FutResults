async function main() {
    fetch('http://localhost:3000/api/goal')
    .then(response => response.json())
    .then(goal_data => {
        var data1 = [{
            x: goal_data.competitions,
            y: goal_data.draws,
            type: 'bar'
        }];
        var layout1 ={
            title: 'Percentage of draws in competitions'
        }
        Plotly.newPlot('draws', data1, layout1);

         var data2 = [{
            x: goal_data.competitions,
            y: goal_data.red_cards,
            type: 'bar'
         }];
         var layout2 = {
            title: 'Red cards per game in competitions'
         };
         Plotly.newPlot('red_cards', data2, layout2);
    })
}
document.addEventListener('DOMContentLoaded', main);