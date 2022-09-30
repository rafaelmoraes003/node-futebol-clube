import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/match';

import { Response } from 'superagent';

import StatusCodes from '../types/StatusCodes';
import matches from './utils/matches';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa a rota GET /matches', () => {

  describe('Testa em caso de sucesso', () => {

    before(async () => {
      sinon
        .stub(Match, 'findAll')
        .resolves(matches as any as Match[]);
    });

    after(async () => {
      (Match.findAll as sinon.SinonStub).restore();
    });

    it('Verifica se retorna um array de partidas', async () => {
      const response: Response = await chai
        .request(app)
        .get('/matches')
      
      expect(response.status).to.be.equal(StatusCodes.OK);
      expect(response.body).to.be.an('array');
      expect(response.body).to.deep.equal(matches);
    });

  });

  describe('Testa em caso de erro no servidor', () => {

    before(async () => {
      sinon
        .stub(Match, 'findAll')
        .rejects();
    });

    after(async () => {
      (Match.findAll as sinon.SinonStub).restore();
    });

    it('Verifica se retorna um erro com status 500', async () => {
      const response: Response = await chai
        .request(app)
        .get('/matches')
      
      expect(response.status).to.be.equal(StatusCodes.SERVER_ERROR);
    });

  });

});