import * as joi from 'joi';

export const matchSchema = joi.object({
  homeTeam: joi.number().required(),
  awayTeam: joi.number().required(),
  homeTeamGoals: joi.number().required(),
  awayTeamGoals: joi.number().required(),
  inProgress: joi.alternatives(
    joi.boolean(),
  ),
});

export const updateMatchResultSchema = joi.object({
  homeTeamGoals: joi.number().required(),
  awayTeamGoals: joi.number().required(),
});
