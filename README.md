# Node Futebol Clube (Back-End)

The Node Futebol Clube project aimed to develop an API that provides information about teams, matches and leaderboards in a soccer championship.

In this project, a dockerized back-end was built using data modeling through Sequelize in an MSC structure that respected the business rules of an already structured front-end.

In the API, it is possible to see data about users, teams, matches (all matches, ongoing matches and/or finished matches) and scores (overall score, home team and/or away team score). In addition, it is possible to create and update matches and users.

The project was made using TypeScript, Node.js, Express, MySQL, Sequelize and Docker, all applied to object-oriented programming and following the principles of SOLID. What's more, the integration tests done with Mocha, Chai and Sinon have +99% coverage of the entire project.

###

<h2 align="left">Technologies used</h2>

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


<h2 align="left">How to use the application</h2>

###

Clone the application using the `git clone` command. After that, enter the project folder using the `cd node-soccer-club` command.

###

<h2 align="left">Required settings</h2>

- `node` from version `16.14.0 LTS`
- `docker-compose` from version `1.29.2`

###

<h2 align="left">Running the application with Docker</h2>

###

In the root folder of the project, use the `npm run compose:up` command. The Front-End will be located on port `3000`, the Back-End on port `3001` and the database (MySQL) on port `3002`.

###

<h2 align="left">Integration tests</h2>

###

In the folder `/app/backend`, to run the integration tests, use the `npm test` command. To check test coverage, use the `npm run test:coverage` command.

###

<h2 align="left">Endpoints</h2>

<h3 align="left">Login</h3>

| Method | Functionality | URL |
|---|---|---|
| `POST` | Login | http://localhost:3001/login |
| `GET` |  Receives a header with authorization parameter, where the token generated at login will be stored and returns the type of user  | http://localhost:3001/login/validate |

In the `POST` request, it is necessary to inform the following JSON:

```JavaScript
{
  email: "admin@admin.com",
  password: "secret_admin"
}
```

<h3 align="left">Teams</h3>

| Method | Functionality | URL |
|---|---|---|
| `GET` | List all league teams | http://localhost:3001/teams |
| `GET` | List a team based on its id | http://localhost:3001/teams/:id |


<h3 align="left">Matches</h3>

| Method | Functionality | URL |
|---|---|---|
| `GET` | List all league matches | http://localhost:3001/matches |
| `POST` | Create new match | http://localhost:3001/matches |
| `PATCH` | Updates a match in progress based on its id | http://localhost:3001/matches/:id |
| `PATCH` | Finish an ongoing match based on your id | http://localhost:3001/matches/:id/finish |

In the `GET` request, it is possible to filter by matches in progress and finished matches through the query string:

```
http://localhost:3001/matches?inProgress=true
http://localhost:3001/matches?inProgress=false
```
###

In the `POST` request, it is necessary to pass a JSON in the following format:

```JavaScript
{
  homeTeam: 16, // The value must be the team id
  awayTeam: 8, // The value must be the team id
  homeTeamGoals: 2,
  awayTeamGoals: 2,
  inProgress: true // The property is optional, but if passed it MUST have the value true
}
```

`OBS`: It is necessary to login and put the token received as a header authorization parameter to be able to create a match.

###

In the `PATCH` request, it is necessary to pass a JSON in the following format:

```JavaScript
{
  homeTeamGoals: 3,
  awayTeamGoals: 1
}
```


<h3 align="left">Leaderboard</h3>

| Method | Functionality | URL |
|---|---|---|
| `GET` | Lists team rankings based on all their games played | http://localhost:3001/leaderboard |
| `GET` | List rankings of home teams | http://localhost:3001/leaderboard/home |
| `GET` | List rankings of visiting teams | http://localhost:3001/leaderboard/away |
                
###
                
<h2 align="left">Considerations</h2>
                              
###
                
It is important to point out that ONLY the Back-End of the application was developed by me. The Front-End has already been structured and developed by the Trybe team.
