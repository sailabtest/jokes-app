const Sequelize = require('sequelize')
const JokesModel = require('./models/jokes')

const ENV = process.env;
const sequelize = new Sequelize(ENV.MYSQL_DATABASE, ENV.MYSQL_USER, ENV.MYSQL_PASSWORD, {
  host: ENV.MYSQL_HOST,
  dialect: 'mysql',
  // dialectOptions: {
  //   socketPath: ENV.MYSQL_SOCKET
  // },
  port: ENV.MYSQL_PORT,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: { raw: true },
  logging: false /* disable logging; default: console.log */
})

const Jokes   = JokesModel(sequelize, Sequelize)

sequelize.sync({force: false})
  .then(() => {
    //console.log(`Database is ready.`)
  })

module.exports = {Jokes}
