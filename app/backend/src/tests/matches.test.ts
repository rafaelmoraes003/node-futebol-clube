import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/match';
import Team from '../database/models/team';

import { Response } from 'superagent';

import StatusCodes from '../types/StatusCodes';
import matches from './utils/matches';
import teams from './utils/teams';
import match from './utils/match';

import { token, wrongToken } from './utils/token';

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

  describe('Testa a rota GET /matches?inProgress=true', () => {

    before(async () => {
      sinon
        .stub(Match, 'findAll')
        .resolves([matches[0], matches[1]] as any as Match[]);
    });

    after(async () => {
      (Match.findAll as sinon.SinonStub).restore();
    });

    it('Verifica se tem partidas em andamento', async () => {
      const response: Response = await chai
        .request(app)
        .get('/matches?inProgress=true')
      
      expect(response.status).to.be.equal(StatusCodes.OK);
      expect(response.body).to.be.an('array');
      response.body.forEach((i: Match) => {
        expect(i.inProgress).to.be.true;
      })
    });

  });

  describe('Testa a rota GET /matches?inProgress=false', () => {

    before(async () => {
      sinon
        .stub(Match, 'findAll')
        .resolves([matches[2], matches[3]] as any as Match[]);
    });

    after(async () => {
      (Match.findAll as sinon.SinonStub).restore();
    });

    it('Verifica se uma partidas finalizadas', async () => {
      const response: Response = await chai
        .request(app)
        .get('/matches?inProgress=true')
      
      expect(response.status).to.be.equal(StatusCodes.OK);
      expect(response.body).to.be.an('array');
      response.body.forEach((i: Match) => {
        expect(i.inProgress).to.be.false;
      })
    });

  });

});


describe('Testa a rota POST /matches', () => {

  describe('Testa a criação de uma partida com sucesso', () => {


    before(async () => {
      sinon
        .stub(Team, 'findAll')
        .resolves([teams[0], teams[1]] as Team[]);

      sinon
        .stub(Match, 'create')
        .resolves({
          id: 1,
        } as Match);
    });

    after(async () => {
      (Team.findAll as sinon.SinonStub).restore();
      (Match.create as sinon.SinonStub).restore();
    });

    it('Verifica se retorna a partida criada', async () => {
      const response: Response = await chai
        .request(app)
        .post('/matches')
        .set('authorization', token)
        .send({
          homeTeam: 1,
          awayTeam: 2,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
          inProgress: true
        });

      expect(response.status).to.be.equal(StatusCodes.CREATED);
      expect(response.body).to.have.keys('id', 'homeTeam', 'awayTeam', 'homeTeamGoals', 'awayTeamGoals', 'inProgress')
      expect(response.body.inProgress).to.be.true;
    }); 

  });

  describe('Testa criação de partida com erro semântico no corpo da requisição', () => {

    it('Verifica se retorna erro com status 422', async () => {
      const response: Response = await chai
        .request(app)
        .post('/matches')
        .set('authorization', token)
        .send({
          homeTeam: 'um',
          awayTeam: 'um',
          homeTeamGoals: 2,
          awayTeamGoals: 2,
          inProgress: true
        });
      
      expect(response.status).to.be.equal(StatusCodes.SEMANTIC_ERROR);
    }); 

  });

  describe('Testa criação de partida propriedade inProgress = false', () => {

    it('Verifica se retorna erro com status 400', async () => {
      const response: Response = await chai
        .request(app)
        .post('/matches')
        .set('authorization', token)
        .send({
          homeTeam: 1,
          awayTeam: 1,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
          inProgress: false
        });

      expect(response.status).to.be.equal(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.be.equal('InProgress must be true.');
    }); 

  });

  describe('Testa criação de partida com times que não existem', () => {

    before(async () => {
      sinon
        .stub(Team, 'findAll')
        .resolves([teams[0]] as Team[]);
    });

    after(async () => {
      (Team.findAll as sinon.SinonStub).restore();
    });

    it('Verifica se retorna erro com status 400', async () => {
      const response: Response = await chai
        .request(app)
        .post('/matches')
        .set('authorization', token)
        .send({
          homeTeam: 1,
          awayTeam: 895,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
          inProgress: true
        });

      expect(response.status).to.be.equal(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.be.equal('Invalid teams.');
    }); 

  });

  describe('Testa criação de partida com token inexistente', () => {

    it('Verifica se retorna erro com status 400', async () => {
      const response: Response = await chai
        .request(app)
        .post('/matches')
        .send({
          homeTeam: 1,
          awayTeam: 2,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
          inProgress: true
        });

      expect(response.status).to.be.equal(StatusCodes.NOT_FOUND);
      expect(response.body.message).to.be.equal('Token not found.');
    }); 

  });

  describe('Testa criação de partida com token inválido', () => {

    it('Verifica se retorna erro com status 400', async () => {
      const response: Response = await chai
        .request(app)
        .post('/matches')
        .set('authorization', wrongToken)
        .send({
          homeTeam: 1,
          awayTeam: 2,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
          inProgress: true
        });

      expect(response.status).to.be.equal(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).to.be.equal('Token must be a valid token');
    }); 

  });

});

