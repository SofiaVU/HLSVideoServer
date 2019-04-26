let Sequelize = require('sequelize');

//It works both in deployment and in development stage.
let url = process.env.DATABASE_URL || "sqlite:./db/db.db";

export let sequelize = new Sequelize(url);

export let Video = sequelize.define('video', {
    name: {
        type: Sequelize.STRING,
        validate: {notEmpty: {msg: "Name of the video must not be empty."}},
    },
    port: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.STRING,
    },

});


sequelize.sync()
    .then(() => {
        console.log("DB has been created");
    })
    .catch((err) => {
        console.log("Error while creating DB: ", err);
    });



// Reseting all video ports
Video.findAll({
    where: {
        port: {
            [Sequelize.Op.ne]: null
        }
    }
}).then((videos) => {

    for (let index in videos){
        videos[index].port =null
        videos[index].save()
    }
})