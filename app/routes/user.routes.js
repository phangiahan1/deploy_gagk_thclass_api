module.exports = (app) => {
    const user = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/user', user.create);

    // login
    app.post('/user/login', user.login);

    // login by google
    app.post('/user/loginGoogle', user.loginGoogle);

    // Retrieve all user
    app.get('/user', user.findAll);

    // Retrieve a single User with UserId
    app.get('/user/:id', user.findOne);

    // Retrieve a single User with UserId
    app.get('/user/findEmail/:email', user.findOneEmail);

    // Update a User with UserId
    app.put('/user/:id', user.update);

    // Update username with User mail
    app.put('/user/updateUsername/:email', user.updateUsername);

    // Update pass with User mail
    app.post('/user/updatePasswordCheck/:email', user.updatePasswordCheck);
    app.put('/user/updatePassword/:email', user.updatePassword);

    // Delete a User with UserId
    app.delete('/user/:id', user.delete);

    //mapping id student
    app.put('/user/studentId/:id', user.updateStudentId)

    //mapping id student when know email
    app.put('/user/studentId/email/:email', user.updateStudentIdByEmail)

}