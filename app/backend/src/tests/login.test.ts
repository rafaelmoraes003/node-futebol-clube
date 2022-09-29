import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/user';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa a rota POST /login', () => {

  describe('Verifica em caso de sucesso', () => {

    before(async () => {
      sinon
        .stub(User, 'findOne')
        .resolves({
          id: 1,
          username: 'Admin',
          role: 'admin',
          email: 'admin@admin.com',
          password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
        } as User);
    });

    after(async () => {
      (User.findOne as sinon.SinonStub).restore();
    });

    it ('Verifica se retorna um token com status 200', async () => {
      const response: Response = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: 'secret_admin',
        });

      expect(response.status).to.be.equal(200);
      expect(response.body).to.have.key('token');
    });

  });

  describe('Testa em caso de usuário inexistente', () => {

    before(async () => {
      sinon
        .stub(User, 'findOne')
        .resolves(null);
    });

    after(async () => {
      (User.findOne as sinon.SinonStub).restore();
    });

    it('Verifica se retorna mensagem com status 404', async () => {
      const response: Response = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'usuarioinexistente@gmail.com',
          password: '1234567',
        });

        expect(response.status).to.be.equal(404);
        expect(response.body.message).to.be.equal('User not found.');
    });

  });

  describe('Verifica em caso de não passar os campos', () => {

    it('Verifica se retorna erro com status 400', async () => {
      const response: Response = await chai
        .request(app)
        .post('/login');

      expect(response.status).to.be.equal(400);
      expect(response.body).to.have.key('message');
      expect(response.body.message).to.be.equal('All fields must be filled');
    });

  });

  describe('Verifica em caso de campos com strings vazias', () => {

    it('Verifica se retorna erro com status 400', async () => {
      const response: Response = await chai
        .request(app)
        .post('/login')
        .send({
          email: '',
          password: '',
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.have.key('message');
      expect(response.body.message).to.be.equal('All fields must be filled');
    });

  });

  describe('Testa em caso de usuário com senha incorreta', () => {

    before(async () => {
      sinon
        .stub(User, 'findOne')
        .resolves({
          id: 1,
          username: 'Admin',
          role: 'admin',
          email: 'admin@admin.com',
          password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
        } as User);
    });

    after(async () => {
      (User.findOne as sinon.SinonStub).restore();
    });

    it('Verifica se retorna erro com status 401', async () => {
      const response: Response = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: 'senhaerrada',
        });

        expect(response.status).to.be.equal(401);
        expect(response.body.message).to.be.equal('Unauthorized user');
    });

  });
});
