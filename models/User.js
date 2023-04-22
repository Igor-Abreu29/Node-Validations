import { sequelize } from './db.js'

export const User = sequelize.define('user', {
    id: {
        type: sequelize.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    nome: {
        type: sequelize.Sequelize.STRING,
        allowNull: false,
    },

    email: {
        type: sequelize.Sequelize.STRING,
        allowNull: false,
    }
})

User.sync()