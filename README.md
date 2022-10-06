# Projeto Node Futebol Clube (Back-End)

O projeto Node Futebol Clube tinha como objetivo desenvolver uma API que fornece informações sobre times, partidas e placares de lideranças em um campeonato de futebol.

Nesse projeto, foi construído um back-end dockerizado utilizando modelagem de dados através do Sequelize em uma estrutura MSC que respeitava as regras de negócio de um front-end já estruturado.

Na API, é possível ver dados sobre usuários, times, partidas (todas as partidas, partidas em andamento e/ou partidas finalizadas) e placares (placar geral, de times mandantes e/ou de times visitantes). Além disso, é possível criar e atualizar partidas e usuários.

O projeto foi feito usando TypeScript, Node.js, Express, MySQL, Sequelize e Docker, todos aplicados à programação orientada à objetos e seguindo os princípios do SOLID. Além do mais, os testes de integração feitos com Mocha, Chai e Sinon tem cobertura de +99% de todo o projeto.

###

<h2 align="left">Tecnologias utilizadas</h2>

###

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="50" width="62" alt="typescript logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="50" width="62"" alt="nodejs logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"height="50" width="62" alt="express logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" height="50" width="62" alt="mysql logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sequelize/sequelize-original.svg" height="50" width="62" alt="sequelize logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" height="50" width="62" alt="docker logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mocha/mocha-plain.svg" height="50" width="62" alt="mocha logo"  />
</div>

###


<h2 align="left">Como utilizar a aplicação</h2>

###

Faça o clone da aplicação usando o comando `git clone`. Após isso, entre na pasta do projeto utilizando o comando `cd node-futebol-clube`.

###

<h2 align="left">Configurações necessárias</h2>

- `node` a partir da versão `16.14.0 LTS`
- `docker-compose` a partir da versão `1.29.2`

###

<h2 align="left">Rodando a aplicação com o Docker</h2>

###

Na pasta raiz do projeto, utilize o comando `npm run compose:up:dev`. O Front-End estará localizado na porta `3000`, o Back-End na porta `3001` e o banco de dados (MySQL) na porta `3002`.

###

<h2 align="left">Endpoints</h2>

<h3 align="left">LOGIN</h3>

| Método | Funcionalidade | URL |
|---|---|---|
| `POST` | Realiza login do usuário já cadastrado e retorna um token para autenticação | http://localhost:3001/login |
| `GET` |  Recebe um header com parâmetro authorization, onde ficará armazenado o token gerado no login e retorna qual o tipo do usuário  | http://localhost:3001/login/validate |

Na requisição ` POST`, é necessário informar o seguinte JSON:

```
{
  "email": "email@email.com",
  "password": "123456"
}
```

<h3 align="left">TIMES</h3>

| Método | Funcionalidade | URL |
|---|---|---|
| `GET` | Retorna todos os times do campeonato | http://localhost:3001/teams |
| `GET` | Retorna um time baseado em seu id | http://localhost:3001/teams/:id |


<h3 align="left">PARTIDAS</h3>

| Método | Funcionalidade | URL |
|---|---|---|
| `GET` | Retorna todas as partidas do campeonato | http://localhost:3001/matches |
| `POST` | Criação de partida | http://localhost:3001/matches |
| `PATCH` | Atualiza uma partida em andamento baseada em seu id | http://localhost:3001/matches/:id |
| `PATCH` | Finaliza uma partida em andamento baseada em seu id | http://localhost:3001/matches/:id/finish |

Na requisição `GET`, é possível filtrar por partidas em andamento e partidas finalizadas através de query string:

```
http://localhost:3001/matches?inProgress=true
http://localhost:3001/matches?inProgress=false
```
###

Na requisção `POST`, é necessaŕio passar um JSON no seguinte formato:

```
{
  "homeTeam": 16, // O valor deve ser o id do time
  "awayTeam": 8, // O valor deve ser o id do time
  "homeTeamGoals": 2,
  "awayTeamGoals": 2,
  "inProgress": true // A propriedade inProgress é opcional, mas se for passada DEVE ter o valor true
}
```

` OBS `: É necessário fazer login e colocar o token recebido como parâmetro do header authorization para conseguir criar uma partida.

###
###

Na requisição `PATCH` ` /matches/:id `, é necessário passar um JSON no seguinte formato:

```
{
  "homeTeamGoals": 3,
  "awayTeamGoals": 1
}
```


<h3 align="left">CLASSIFICAÇÃO DE TIMES (LEADERBOARD)</h3>

| Método | Funcionalidade | URL |
|---|---|---|
| `GET` | Retorna as classificações dos times baseado em todas suas partidas jogadas | http://localhost:3001/leaderboard |
| `GET` | Retorna as classificações dos times mandantes | http://localhost:3001/leaderboard/home |
| `GET` | Retorna as classificações dos times visitantes | http://localhost:3001/leaderboard/away |
                
###
                
<h2 align="left">CONSIDERAÇÕES</h2>
                              
###
                
É importante ressaltar que APENAS o Back-End da aplicação foi desenvolvido por mim. O Front-End já foi fornecido estruturado e desenvolvido pelo time da Trybe.
