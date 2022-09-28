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
});
