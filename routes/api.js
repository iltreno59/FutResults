var express = require('express');
var router = express.Router();
const { bundesliga_table, eurosport_table, global_sport_table, goal_com_table, yahoo_table } =  require('../../../Sport_parser/create_tables.js');

async function bundes_get_data() {
  const wins = {};
  const scored_goals = {};
  const conceded_goals = {};
  const games = await bundesliga_table.findAll({raw: true});
  games.forEach(game => {
          const home_team_name = game.home_team_name;
          const away_team_name = game.away_team_name;
          const home_team_goals = game.home_team_goals;
          const away_team_goals = game.away_team_goals;

          if (home_team_goals > away_team_goals){
              wins[home_team_name] = (wins[home_team_name] || 0) + 1;
          }
          scored_goals[home_team_name] = (scored_goals[home_team_name] || 0) + home_team_goals;
          conceded_goals[home_team_name] = (conceded_goals[home_team_name] || 0) + away_team_goals;
          if (away_team_goals > home_team_goals){
              wins[away_team_name] = (wins[away_team_name] || 0) + 1;
          }
          scored_goals[away_team_name] = (scored_goals[away_team_name] || 0) + away_team_goals;
          conceded_goals[away_team_name] = (conceded_goals[away_team_name] || 0) + home_team_goals;
      });
      const results = Object.entries(wins)
      .map(([team, total_wins]) => ({ team, total_wins }))
      .sort((a, b) => b.total_wins - a.total_wins);

      results.forEach(result => {
          result.scored_goals = scored_goals[result.team];
          result.conceded_goals = conceded_goals[result.team];
      });

      const teams_array = [];
      const wins_array = [];
      const scored_goals_array = [];
      const conceded_goals_array = [];
      results.forEach(result => {
        teams_array.push(result.team);
        wins_array.push(result.total_wins);
        scored_goals_array.push(result.scored_goals);
        conceded_goals_array.push(result.conceded_goals * -1);
      });
      const arrays = {
        teams: teams_array,
        wins: wins_array,
        scored_goals: scored_goals_array,
        conceded_goals: conceded_goals_array
      }
      return arrays;
}

router.get('/bundes', async function(req, res, next) {
  const bundes_data = await bundes_get_data();
  res.json(bundes_data);
});

async function eurosport_get_data(){
  const games = await eurosport_table.findAll({raw: true});
  const teams_games = {};
  const wins = {};
  const competition_games = {};
  const draws = {};
  const scored_goals = {};
  const conceded_goals = {};

  games.forEach(game => {
    const competition = game.competition;
    const home_team_name = game.home_team_name;
    const away_team_name = game.away_team_name;
    const home_team_goals = game.home_team_goals;
    const away_team_goals = game.away_team_goals;

    if (home_team_goals > away_team_goals){
      wins[home_team_name] = (wins[home_team_name] || 0) + 1;
    }
    else if (home_team_goals < away_team_goals){
      wins[away_team_name] = (wins[away_team_name] || 0) + 1;
    }
    else{
      draws[competition] = (draws[competition] || 0) + 1;
    }
    teams_games[home_team_name] = (teams_games[home_team_name] || 0) + 1; 
    teams_games[away_team_name] = (teams_games[away_team_name] || 0) + 1; 
    scored_goals[home_team_name] = (scored_goals[home_team_name] || 0) + home_team_goals;
    conceded_goals[home_team_name] = (conceded_goals[home_team_name] || 0) + away_team_goals;
    scored_goals[away_team_name] = (scored_goals[away_team_name] || 0) + away_team_goals;
    conceded_goals[away_team_name] = (conceded_goals[away_team_name] || 0) + home_team_goals;
    competition_games[competition] = (competition_games[competition] || 0) + 1;
  });

  const teams_results = Object.entries(teams_games)
  .map(([team, total_games]) => ({ team, total_games }))
  .sort((a, b) => b.total_games - a.total_games);
  
  const competitions_results = Object.entries(competition_games)
  .map(([competition, total_games]) => ({competition, total_games}))
  .sort((a, b) => b.total_games - a.total_games);

  teams_results.forEach(team_results => {
    team_results.total_wins = wins[team_results.team] || 0;
    team_results.scored_goals = scored_goals[team_results.team] || 0;
    team_results.conceded_goals = conceded_goals[team_results.team] || 0;
  });

  competitions_results.forEach(competition_results => {
    competition_results.total_draws = draws[competition_results.competition] || 0;
  });

  const teams_array = [];
  const scored_goals_array = [];
  const conceded_goals_array = [];
  const wins_array = [];
  
  teams_results.forEach(team_results => {
    teams_array.push(team_results.team);
    scored_goals_array.push(team_results.scored_goals || 0);
    conceded_goals_array.push(team_results.conceded_goals * -1 || 0);
    wins_array.push(team_results.total_wins || 0);
  });

  const competitions_array = [];
  const draws_per_game_array = [];

  competitions_results.forEach(competition_results => {
    if (competition_results.total_games > 3){
    competitions_array.push(competition_results.competition);
    draws_per_game_array.push(competition_results.total_draws / competition_results.total_games * 100);
    }
  });

  const data = {
    teams: teams_array,
    wins: wins_array,
    scored_goals: scored_goals_array,
    conceded_goals: conceded_goals_array,
    competitions: competitions_array,
    draws: draws_per_game_array
  };

  return data;
}

router.get('/eurosport', async function(req, res, next){
  const eurosport_data = await eurosport_get_data();
  res.json(eurosport_data);
})

async function globalsport_get_data() {
  const games = await global_sport_table.findAll({raw: true});
  const times = {};
  const wins = {};

  games.forEach(game =>{
    const match_time = game.match_time;
    const home_team_name = game.home_team_name;
    const home_team_goals = game.home_team_goals;
    const away_team_name = game.away_team_name;
    const away_team_goals = game.away_team_goals;
    const game_time = game.game_time;
    
    times[match_time] = (times[match_time] || 0) + 1;
    if (home_team_goals > away_team_goals){
      wins[home_team_name] = (wins[home_team_name] || 0) + 1;
    }
    else if (home_team_goals < away_team_goals){
      wins[away_team_name] = (wins[away_team_name] || 0) + 1;
    }

    times[game_time] = (times[game_time] || 0) + 1;
  });

  const results = Object.entries(wins)
  .map(([team, total_wins]) => ({team, total_wins}))
  .sort((a, b) => b.total_wins - a.total_wins);

  const time_object = Object.entries(times)
  .map(([time, games_n]) => ({time, games_n}))
  .sort((a, b) => b.games_n - a.games_n);

  const teams_array = [];
  const wins_array = [];
  
  results.forEach(result => {
    if (result.total_wins > 7){
    teams_array.push(result.team);
    wins_array.push(result.total_wins);
    }
  });

  const times_array = [];
  const games_n_array = [];

  time_object.forEach(time => {
    if (time.games_n > 100 && time.time != 'undefined'){
    times_array.push(time.time);
    games_n_array.push(time.games_n);
    }
  });

  const globalsport_data = {
    teams: teams_array,
    wins: wins_array,
    times: times_array,
    games_n: games_n_array
  };

  return globalsport_data;
}

router.get('/globalsport', async function(req, res, next) {
  const eurosport_data = await globalsport_get_data();
  res.json(eurosport_data);
});

async function goal_get_data(){
  const games = await goal_com_table.findAll({raw: true});
  const draws = {};
  const red_cards = {};
  const total_games = {};

  games.forEach(game => {
    const home_team_goals = game.home_team_goals;
    const away_team_goals = game.away_team_goals;
    const home_team_red_cards = game.home_team_red_cards;
    const away_team_red_cards = game.away_team_red_cards;
    const competition = game.competition;

    if (home_team_goals == away_team_goals) draws[competition] = (draws[competition] || 0) + 1;
    red_cards[competition] = (red_cards[competition] || 0) + home_team_red_cards + away_team_red_cards;
    total_games[competition] = (total_games[competition] || 0) + 1;
  });
  const results = Object.entries(total_games)
  .map(([competition, total_games_n]) => ({competition, total_games_n}))
  .sort((a, b) => b.total_games_n - a.total_games_n);

  results.forEach(result => {
    result.total_draws = draws[result.competition],
    result.total_red_cards = red_cards[result.competition]
  });

  const competitions_array = [];
  const draws_per_game_array = [];
  const red_cards_per_game_array = [];

  results.forEach(result => {
    if(result.total_games_n > 50){
    competitions_array.push(result.competition);
    draws_per_game_array.push(result.total_draws / result.total_games_n * 100);
    red_cards_per_game_array.push(result.total_red_cards / result.total_games_n);
    }
  });

  const goal_data = {
    competitions: competitions_array,
    draws: draws_per_game_array,
    red_cards: red_cards_per_game_array
  }

  return goal_data;
}

router.get('/goal/', async function(req, res, next) {
  const goal_data = await goal_get_data();
  res.json(goal_data);
})

module.exports = router;