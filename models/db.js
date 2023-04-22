import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize('node_example', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
    }, 
    logging: false
})