import * as joi from 'joi';

const matchSchema = joi.object({
  homeTeam: joi.number().required(),
  awayTeam: joi.number().required(),
  homeTeamGoals: joi.number().required(),
  awayTeamGoals: joi.number().required(),
  inProgress: joi.boolean().required(),
});

export default matchSchema;
