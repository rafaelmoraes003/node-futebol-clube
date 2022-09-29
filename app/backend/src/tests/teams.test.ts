import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/team';

import { Response } from 'superagent';

import StatusCodes from '../types/StatusCodes';
import teams from './utils/teams';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa a rota GET /teams', () => {

  describe('Testa a listagem de todos os times', () => {

    before(async () => {
      sinon
        .stub(Team, 'findAll')
        .resolves(teams as Team[]);
    });

    after(async () => {
      (Team.findAll as sinon.SinonStub).restore();
    });

    it('Verifica se retorna um array com status 200', async () => {
      const response: Response = await chai
        .request(app)
        .get('/teams');
      
      expect(response.status).to.be.equal(StatusCodes.OK);
      expect(response.body).to.be.an('array');
    });

  });

  describe('Testa em caso de erro no servidor', () => {

    before(async () => {
      sinon
        .stub(Team, 'findAll')
        .rejects();
    });

    after(async () => {
      (Team.findAll as sinon.SinonStub).restore();
    });

    it('Verifica se retorna um erro com status 500', async () => {
      const response: Response = await chai
        .request(app)
        .get('/teams');
      
      expect(response.status).to.be.equal(StatusCodes.SERVER_ERROR);
    });

  });

});