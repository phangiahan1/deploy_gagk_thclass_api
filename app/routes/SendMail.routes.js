module.exports = (app) => {
    // const classroom = require('../controllers/Classroom.controller.js');
    // const joinedClass = require('../controllers/JoinedClass.controller');
    const sendmail = require('../controllers/SendMail.controller');
    

    // // Find all user in classroom 
    // app.get('/classroom/:id/alluser', joinedClass.findAllbyClassId);
     app.post('/send_mail_teacher', sendmail.sendmailTeacher);
     app.post('/send_mail_student', sendmail.sendmailStudent);
}