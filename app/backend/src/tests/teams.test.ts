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

describe('Testa o endpoint GET /teams/:id', () => {

  describe('Testa em caso de sucesso', () => {

    before(async () => {
      sinon
        .stub(Team, 'findOne')
        .resolves(teams[0] as Team);
    });

    after(async () => {
      (Team.findOne as sinon.SinonStub).restore();
    });

    it('Verifica se retorna 1 time com status 200', async () => {
      const response: Response = await chai
        .request(app)
        .get('/teams/1');

      expect(response.status).to.be.equal(StatusCodes.OK);
      expect(response.body).to.have.keys('id', 'teamName');
      expect(response.body).to.be.an('object');
      expect(response.body).to.deep.include(teams[0]);
    });

  });

  describe('Testa em caso de time inexistente', () => {

    before(async () => {
      sinon
        .stub(Team, 'findOne')
        .resolves(null);
    });

    after(async () => {
      (Team.findOne as sinon.SinonStub).restore();
    });

    it('Verifica se retorna erro com status 404', async () => {
      const response: Response = await chai
        .request(app)
        .get('/teams/999');

      expect(response.status).to.be.equal(StatusCodes.NOT_FOUND);
    });

  });

  describe('Testa em caso de erro no servidor', () => {

    before(async () => {
      sinon
        .stub(Team, 'findOne')
        .rejects();
    });

    after(async () => {
      (Team.findOne as sinon.SinonStub).restore();
    });

    it('Verifica se retorna erro com status 500', async () => {
      const response: Response = await chai
        .request(app)
        .get('/teams/5');

      expect(response.status).to.be.equal(StatusCodes.SERVER_ERROR);
    });

  });

});