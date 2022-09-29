import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/user';

import { Response } from 'superagent';

import {token, wrongToken } from './utils/token';
import StatusCodes from '../types/StatusCodes';

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

      expect(response.status).to.be.equal(StatusCodes.OK);
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

    it('Verifica se retorna mensagem com status 401', async () => {
      const response: Response = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'usuarioinexistente@gmail.com',
          password: '1234567',
        });

        expect(response.status).to.be.equal(StatusCodes.UNAUTHORIZED);
        expect(response.body.message).to.be.equal('Incorrect email or password');
    });

  });

  describe('Verifica em caso de não passar os campos', () => {

    it('Verifica se retorna erro com status 400', async () => {
      const response: Response = await chai
        .request(app)
        .post('/login');

      expect(response.status).to.be.equal(StatusCodes.BAD_REQUEST);
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

      expect(response.status).to.be.equal(StatusCodes.BAD_REQUEST);
      expect(response.body).to.have.key('message');
      expect(response.body.message).to.be.equal('All fields must be filled');
    });

  });

  describe('Verifica em caso de campos semanticamente errados', () => {

    it('Verifica se retorna erro com status 422', async () => {
      const response: Response = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'usuario',
          password: '123456',
        });

      expect(response.status).to.be.equal(StatusCodes.SEMANTIC_ERROR);
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

        expect(response.status).to.be.equal(StatusCodes.UNAUTHORIZED);
        expect(response.body.message).to.be.equal('Unauthorized user');
    });

  });
});

describe('Testa a rota GET /login/validate', () => {

  describe('Testa em caso de sucesso', () => {

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

    it('Verifica se retorna o cargo do usuário com status 200', async () => {
      const response: Response = await chai
        .request(app)
        .get('/login/validate')
        .set({ 'authorization': token });

      expect(response.status).to.be.equal(StatusCodes.OK);
      expect(response.body).to.have.key('role');
      expect(response.body.role).to.be.equal('admin');
    });

  });

  describe('Testa em caso de falha no servidor', () => {

    before(async () => {
      sinon
        .stub(User, 'findOne')
        .rejects();
    });

    after(async () => {
      (User.findOne as sinon.SinonStub).restore();
    });

    it('Verifica se retorna erro de servidor 500', async () => {

      const response: Response = await chai
        .request(app)
        .get('/login/validate')
        .set({ 'authorization': token });

      expect(response.status).to.be.equal(StatusCodes.SERVER_ERROR);
    });

  });

  describe('Testa em caso que o token é undefined', () => {

    it('Verifica se retorna uma mensagem com status 404', async () => {

      const response: Response = await chai
        .request(app)
        .get('/login/validate')

      expect(response.status).to.be.equal(StatusCodes.NOT_FOUND);
      expect(response.body.message).to.be.equal('Token not found.');
    });

  });

  describe('Testa em caso de assinatura do token jwt inválida', () => {

    it('Verifica se retorna uma mensagem com status 400', async () => {

      const response: Response = await chai
        .request(app)
        .get('/login/validate')
        .set('authorization', wrongToken );

      expect(response.status).to.be.equal(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.be.equal('Invalid signature.');
    });

  });

});
