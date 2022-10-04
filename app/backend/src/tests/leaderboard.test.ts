import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/match';
import Team from '../database/models/team';

import { Response } from 'superagent';

import StatusCodes from '../types/StatusCodes';
import { matchesNotInProgress } from './utils/matches';
import teams from './utils/teams';
import { homeLeaderboard, awayLeaderboard } from './utils/leaderboard';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa a rota GET /leaderboard/home', () => {

  describe('Testa em caso de sucesso', () => {

    before(async () => {
      sinon
        .stub(Team, 'findAll')
        .resolves(teams as Team[]);

      sinon
        .stub(Match, 'findAll')
        .resolves(matchesNotInProgress as any as Match[]);
    });

    after(async () => {
      (Team.findAll as sinon.SinonStub).restore();
      (Match.findAll as sinon.SinonStub).restore();
    });

    it('Verifica se retorna o placar dos times da casa com status 200', async () => {
      const response: Response = await chai
        .request(app)
        .get('/leaderboard/home')

      expect(response.body).to.deep.equal(homeLeaderboard);
      expect(response.status).to.be.equal(StatusCodes.OK);

    });
  });

  describe('Testa em caso de erro no servicdor', () => {

    before(async () => {
      sinon
        .stub(Team, 'findAll')
        .rejects();
    });

    after(async () => {
      (Team.findAll as sinon.SinonStub).restore();
    });

    it('Verifica se retorna erro com status 500', async () => {
      const response: Response = await chai
        .request(app)
        .get('/leaderboard/home')

      expect(response.status).to.be.equal(StatusCodes.SERVER_ERROR);

    });
  });

});
