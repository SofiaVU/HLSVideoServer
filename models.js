import {digestPassword} from './crypto';

let Sequelize = require('sequelize');

let url = process.env.DATABASE_URL || "sqlite:./../db/db.db";

export let sequelize = new Sequelize(url);

export let Video = sequelize.define('video', {
    name: {
        type: Sequelize.STRING,
        validate: {notEmpty: {msg: "Name of the video must not be empty."}},
    },
    port: {
        type: Sequelize.INTEGER,
    },
    status: {
        type: Sequelize.STRING,
    },

});

export let User = sequelize.define('user', {

    username: {
        type: Sequelize.STRING,
        unique: true,
        validate: {notEmpty: {msg: "Username must not be empty."}},
    },

    name: {
        type: Sequelize.STRING,
        validate: {notEmpty: {msg: "Name must not be empty."}},
    },

    password: {
        type: Sequelize.STRING,
        validate: {notEmpty: {msg: "Password must not be empty."}},
        set(password) {
            this.setDataValue('password', digestPassword(password));
        },
    },

    admin: {
        type: Sequelize.BOOLEAN,
        validate: {notEmpty: {msg: "admin must not be empty."}},
    },
    online: {
        type: Sequelize.BOOLEAN,
        validate: {notEmpty: {msg: "User online must not be empty."}},
    },
    token: {
        type: Sequelize.STRING,
        validate: {notEmpty: {msg: "Token must not be empty."}},
    },

});
Video.belongsTo(User, {foreignKey: 'userId'});
User.hasMany(Video, {as: 'user', foreignKey: 'userId'});



