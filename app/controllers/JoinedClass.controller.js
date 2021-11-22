const JoinedClass = require('../models/JoinedClass.model.js');
const UserController = require('../controllers/user.controller');
const User = require('../models/User.model.js');

// Retrieve and return all Classroom from the database.
exports.findAllbyClassId = (req, res) => {
    JoinedClass.find({
        idClass: req.params.id,
        type: false
    })
        .populate("idClass")
        .populate("idUser")
        .then(joinedClass => {
            res.send(joinedClass);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Joined Class."
            });
        });
};
exports.findAllbyClassIdCoopTeach = (req, res) => {
    JoinedClass.find({
        idClass: req.params.id,
        type: true
    })
        .populate("idClass")
        .populate("idUser")
        .then(joinedClass => {
            res.send(joinedClass);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Joined Class."
            });
        });
};

exports.findClassJoinByMail = (req, res) => {
    User.find({ email: req.params.email })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with email " + req.params.email
                });
            }
            JoinedClass.find({
                idUser: user[0]._id
            })
                .populate("idClass")
                //.populate("idUser")
                .then(joinedClass => {
                    let x = [];
                    for (var i = 0; i < joinedClass.length; i++) {
                        x.push(joinedClass[i].idClass);
                    }
                    res.send(x);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving Joined Class."
                    });
                });
        })

};
exports.findClassCoTeachByMail = (req, res) => {
    User.find({ email: req.params.email })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with email " + req.params.email
                });
            }
            JoinedClass.find({
                idUser: user[0]._id,
                type: true
            })
                .populate("idClass")
                //.populate("idUser")
                .then(joinedClass => {
                    let x = [];
                    for (var i = 0; i < joinedClass.length; i++) {
                        x.push(joinedClass[i].idClass);
                    }
                    res.send(x);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving Joined Class."
                    });
                });
        })

};

exports.countAllStuInClass = (req, res) => {
    JoinedClass.find({
        idClass: req.params.id
    })
        //.populate("idClass")
        .populate("idUser")
        .countDocuments()
        .then(joinedClass => {
            res.send(
                { message: "" + joinedClass });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Joined Class."
            });
        });
};

exports.inviteTeacher = (req, res) => {
    // Validate request
    User.find({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with email " + req.params.email
                });
            }
            const joinedNew = new JoinedClass({
                idClass: req.params.id,
                idUser: user[0]._id,
                type: true, //type true: teacher
                hide: false
            });
            joinedNew.save()
                .then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Classroom."
                    });
                });
        })
};

exports.inviteStudent = (req, res) => {
    // Validate request
    User.find({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with email " + req.params.email
                });
            }
            const joinedNew = new JoinedClass({
                idClass: req.params.id,
                idUser: user[0]._id,
                type: false, //type false stu
                hide: false
            });
            joinedNew.save()
                .then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Classroom."
                    });
                });
        })
};
