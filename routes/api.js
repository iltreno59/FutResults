var express = require('express');
var router = express.Router();
const { bundesliga_table, eurosport_table, global_sport_table, goal_com_table, yahoo_table } =  require('../../../Sport_parser/create_tables.js');

async function bundes_get_games(){
  const games = await bundesliga_table.findAll({raw: true});
  return games;
}

async function bundes_get_data() {
  const wins = {};
  const scored_goals = {};
  const conceded_goals = {};
  const games = await bundes_get_games();
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
      return results;
}

async function bundes_get_teams_array(){
  const teams_array = [];
  const datas = await bundes_get_data();
  datas.forEach(data => {
      teams_array.push(data.team);
  });
  return teams_array;
}

async function bundes_get_wins_array(){
  const wins_array = [];
  const datas = await bundes_get_data();
  datas.forEach(data => {
      wins_array.push(data.total_wins);
  });
  return wins_array;
}

async function bundes_get_scored_goals_array() {
  const scored_goals_array = [];
  const datas = await bundes_get_data();
  datas.forEach(data => {
      scored_goals_array.push(data.scored_goals);
  });
  return scored_goals_array;
}

async function bundes_get_conceded_goals_array() {
  const conceded_goals_array = [];
  const datas = await bundes_get_data();
  datas.forEach(data => {
      conceded_goals_array.push(data.conceded_goals * -1);
  });
  return conceded_goals_array;
}

router.get('/bundes', async function(req, res, next) {
  const teams = await bundes_get_teams_array();
  const wins = await bundes_get_wins_array();
  const scored_goals = await bundes_get_scored_goals_array();
  const conceded_goals = await bundes_get_conceded_goals_array();
  const bundes_data = {
    teams: teams,
    wins: wins,
    scored_goals: scored_goals,
    conceded_goals: conceded_goals
  }
  res.json(bundes_data);
});

async function eurosport_get_games(){
  const games = await eurosport_table.findAll({raw: true});
  return games;
}

async function eurosport_get_data(){
  const games = await eurosport_get_games();
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

  const data = {
    teams: teams_results,
    competitions: competitions_results
  };

  return data;
}

async function eurosport_get_teams_array() {
  const datas = (await eurosport_get_data()).teams;
  const teams = [];
  datas.forEach(data => {
    teams.push(data.team);
  });
  return teams;
}

async function eurosport_get_scored_goals_array() {
  const datas = (await eurosport_get_data()).teams;
  const scored_goals = [];
  datas.forEach(data => {
    scored_goals.push(data.scored_goals);
  });
  return scored_goals;
}

async function eurosport_get_conceded_goals_array() {
  const datas = (await eurosport_get_data()).teams;
  const conceded_goals = [];
  datas.forEach(data => {
    conceded_goals.push(data.conceded_goals * -1);
  });
  return conceded_goals;
}

async function eurosport_get_competition_array(params) {
  const datas = (await eurosport_get_data()).competitions;
  const competitions = [];
  datas.forEach(data => {
    competitions.push(data.competition);
  });
  return competitions;
}

async function eurosport_get_competition_draws_array() {
  const datas = (await eurosport_get_data()).competitions;
  const draws = [];
  datas.forEach(data => {
    if(data.total_games > 5 && data.total_draws > 0) 
      draws.push((data.total_draws / data.total_games) * 100);
  });
  return draws;
}

router.get('/eurosport', async function(req, res, next){
  const teams = await eurosport_get_teams_array();
  const competitions = await eurosport_get_competition_array();
  const scored_goals = await eurosport_get_scored_goals_array();
  const conceded_goals = await eurosport_get_conceded_goals_array();
  const draws = await eurosport_get_competition_draws_array();

  const eurosport_data = {
    teams: teams,
    competitions: competitions,
    scored_goals: scored_goals,
    conceded_goals: conceded_goals,
    draws: draws
  };
  res.json(eurosport_data);
})

module.exports = router;