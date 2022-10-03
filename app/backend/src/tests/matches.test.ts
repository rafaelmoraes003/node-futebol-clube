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
        .stub(Team, 'findAndCountAll')
        .resolves({
          rows: [teams[0], teams[1]] as Team[],
          count: 2,
        });

      sinon
        .stub(Match, 'create')
        .resolves({
          id: 1,
        } as Match);
    });

    after(async () => {
      (Team.findAndCountAll as sinon.SinonStub).restore();
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
        .stub(Team, 'findAndCountAll')
        .resolves({
          rows: [teams[0]] as Team[],
          count: 1,
        });
    });

    after(async () => {
      (Team.findAndCountAll as sinon.SinonStub).restore();
    });

    it('Verifica se retorna erro com status 404', async () => {
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

      expect(response.status).to.be.equal(StatusCodes.NOT_FOUND);
      expect(response.body.message).to.be.equal('There is no team with such id!');
    }); 

  });

  describe('Testa criação de partida com times iguais', () => {

    it('Verifica se retorna erro com status 401', async () => {
      const response: Response = await chai
        .request(app)
        .post('/matches')
        .set('authorization', token)
        .send({
          homeTeam: 1,
          awayTeam: 1,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
          inProgress: true
        });

      expect(response.status).to.be.equal(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).to.be.equal("It is not possible to create a match with two equal teams");
    }); 

  });

  describe('Testa criação de partida com token inexistente', () => {

    it('Verifica se retorna erro com status 404', async () => {
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

describe('Testa o endpoint PATCH /matches/:id/finish', () => {

  describe('Testa em caso de sucesso', () => {

    before(async () => {
      sinon
        .stub(Match, 'findOne')
        .resolves(match as any as Match);

      sinon
        .stub(Match, 'update')
        .resolves();
    });

    after(async () => {
      (Match.findOne as sinon.SinonStub).restore();
      (Match.update as sinon.SinonStub).restore();
    });

    it('Verifica se retorna a partida finalizada', async () => {
      const response: Response = await chai
        .request(app)
        .patch('/matches/1/finish')
      
      expect(response.status).to.be.equal(StatusCodes.OK);
      expect(response.body.message).to.be.equal('Finished')
    });

  });

  describe('Testa em caso de partida inexistente', () => {

    before(async () => {
      sinon
        .stub(Match, 'findOne')
        .resolves(null);
    });

    after(async () => {
      (Match.findOne as sinon.SinonStub).restore();
    });

    it('Verifica se retorna erro com status 404', async () => {
      const response: Response = await chai
        .request(app)
        .patch('/matches/99/finish')
      
      expect(response.status).to.be.equal(StatusCodes.NOT_FOUND);
      expect(response.body.message).to.be.equal('Match not found.');
    });

  });

  describe('Testa em caso de erro no servidor', () => {

    before(async () => {
      sinon
        .stub(Match, 'findOne')
        .rejects();
    });

    after(async () => {
      (Match.findOne as sinon.SinonStub).restore();
    });

    it('Verifica se retorna erro com status 500', async () => {
      const response: Response = await chai
        .request(app)
        .patch('/matches/99/finish')
      
      expect(response.status).to.be.equal(StatusCodes.SERVER_ERROR);
    });

  });

});