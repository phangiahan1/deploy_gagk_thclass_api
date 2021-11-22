const User = require('../models/User.model.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if(!req.body.username) {
        return res.status(400).send({
            message: "Uername content can not be empty"
        });
    }
    if(!req.body.email) {
        return res.status(400).send({
            message: "Email content can not be empty"
        });
    }
    if(!req.body.password) {
        return res.status(400).send({
            message: "Password content can not be empty"
        });
    }
    if(!req.body.status) {
        return res.status(400).send({
            message: "Status content can not be empty"
        });
    }

    var filter = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!filter.test(req.body.email)) {
        return res.status(400).send({
            message: "Email is illegal"
        });

    }

    User.findOne({email: req.body.email})
    .then(u => {
        if(u) {
            return res.status(404).send({
                message: "User already exist with email " + req.body.email
            });            
        }
        else{
            // Create a User
            const user = new User({
                username: req.body.username , 
                email:req.body.email,
                password: req.body.password,
                status: req.body.status,
                picture: req.body.picture,
            });
            user.setPassword(req.body.password);
            // Save User in the database
            user.save()
            .then(user => {
                const token = jwt.sign({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    picture:user.picture
                },
                'secrect123'
                )
                res.status(200).send(token);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the User."
                });
            });
        }
    })
    
};

//login user
exports.login = (req, res) => {
    if(!req.body.email) {
        return res.status(400).send({
            message: "Email content can not be empty"
        });
    }
    if(!req.body.password) {
        return res.status(400).send({
            message: "Password content can not be empty"
        });
    }
    const user = User.findOne({
        email:req.body.email,
    })
    .then(user => {
        if(user === null){ 
            return res.status(400).send({ 
                message : "User not found."
            }); 
        } else{
            
            console.log(crypto.pbkdf2Sync(req.body.password,user.salt, 1000, 64, `sha512`).toString(`hex`) )
            console.log(user.salt)
            if (user.validPassword(req.body.password)) { 
                const token = jwt.sign({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    picture:user.picture
                },
                'secrect123'
                )
                res.status(200).send(token);
            }else { 
                console.log(user.validPassword(req.body.password))
                return res.status(400).send({ 
                    message : "Wrong Password"
                }); 
            }
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Login fail"
        });
    });
};

//login google
exports.loginGoogle = (req, res) => {
    const user = User.findOne({
        email:req.body.email,
        password: req.body.password,
    })
    .then(user => {
        if(user){
            const token = jwt.sign({
                id: user.id,
                username: user.username,
                email: user.email,
                password: user.password,
                picture:user.picture
            },
            'secrect123'
            )
            res.status(200).send(token);
        }
        else{
            // Create a User
            const user = new User({
                username: req.body.username , 
                email:req.body.email,
                password: req.body.password,
                status: req.body.status,
                picture: req.body.picture,
            });
            // Save User in the database
            user.save()
            .then(user => {
                const token = jwt.sign({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    picture:user.picture
                },
                'secrect123'
                )
                res.status(200).send(token);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the User."
                });
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Login fail"
        });
    });
};

// Retrieve and return all User from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(user => {
        res.send(user);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving User."
        });
    });
};



// Find a single User with a id
exports.findOne = (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving User with id " + req.params.id
        });
    });
};

exports.findOneEmail = (req, res) => {
    User.find({email: req.params.email})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with email " + req.params.email
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'String') {
            return res.status(404).send({
                message: "User not found with email " + req.params.email
            });                
        }
        return res.status(500).send({
            message: "Error retrieving User with email " + req.params.email
        });
    });
};

// Update a User identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    // if(!req.body.username) {
    //     return res.status(400).send({
    //         message: "User content can not be empty"
    //     });
    // }

    // Find User and update it with the request body
    User.findByIdAndUpdate(req.params.id, {
        username: req.body.username, 
        email:req.body.email,
        password: req.body.password,
        status: req.body.status
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating User with id " + req.params.id
        });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.id)
    .then(User => {
        if(!User) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete User with id " + req.params.id
        });
    });
};

// Update pass identified by the email in the request
exports.updatePasswordCheck = (req, res) => {
    // Validate Request
    // if(!req.body.password) {
    //     return res.status(400).send({
    //         message: "password content can not be empty"
    //     });
    // }

    User.findOne({
        email:req.params.email,
    })
    .then(user => {
        if(user === null){ 
            return res.status(400).send({ 
                message : "User not found."
            }); 
        } else{
            if (user.validPassword(req.body.password)) { 
                res.send(user)
            }else { 
                return res.status(400).send({ 
                    message : "Wrong Password"
                }); 
            }
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Wrong Password"
        });
    });
};

// Update pass identified by the email in the request
exports.updatePassword = (req, res) => {
    // Validate Request
    if(!req.body.password) {
        return res.status(400).send({
            message: "new password content can not be empty"
        });
    }
    User.findOne({
        email:req.params.email})
    .then(user => {
        if(user === null){ 
            return res.status(400).send({ 
                message : "User not found."
            }); 
        } else{
            user.setPasswordWithSalt(req.body.password,user.salt)
            User.findByIdAndUpdate(
                user.id, {
                    password: user.password, 
            }, {new: true})
            .then(users=>{
                console.log(users)
                res.send(users)
            })
            
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Wrong Password"
        });
    });
};

// Update username identified by the id in the request
exports.updateUsername = (req, res) => {
    // Validate Request
    if(!req.body.username) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    // Find User and update it with the request body
    User.findOneAndUpdate({email: req.params.email}, {
        username: req.body.username,
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating User with id " + req.params.id
        });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.id)
    .then(User => {
        if(!User) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete User with id " + req.params.id
        });
    });
};
// Update a student ID of user identified by the id in the request
exports.updateStudentId = (req, res) => {
    // Validate Request
    if(!req.body.studentId) {
        return res.status(400).send({
            message: "Student ID content can not be empty"
        });
    }

    // Find User and update it with the request body
    User.find({studentId: req.body.studentId})
    .then(u =>{
        if(u.length){
            return res.status(404).send({
                message: "This student Id already exist " + req.body.studentId
            });
        }
        else{
            
            User.findByIdAndUpdate(req.params.id, {
                // username: req.body.username, 
                // email:req.body.email,
                // password: req.body.password,
                // status: req.body.status
                studentId: req.body.studentId
            }, {new: true})
            .then(user => {
                if(!user) {
                    return res.status(404).send({
                        message: "User not found with id " + req.params.id
                    });
                }
                res.send(user);
            }).catch(err => {
                if(err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "User not found with id " + req.params.id
                    });                
                }
                return res.status(500).send({
                    message: "Error updating User with id " + req.params.id
                });
            });
        }
    })
    
};

// Update a student ID of user identified by the email in the request
exports.updateStudentIdByEmail = (req, res) => {
    // Validate Request
    if(!req.body.studentId) {
        return res.status(400).send({
            message: "Student ID content can not be empty"
        });
    }

    // Find User and update it with the request body
    User.find({studentId: req.body.studentId})
    .then(u =>{
        if(u.length){
            return res.status(404).send({
                message: "This student Id already exist " + req.body.studentId
            });
        }
        else{
            User.findOneAndUpdate({email: req.params.email}, {
                // username: req.body.username, 
                // email:req.body.email,
                // password: req.body.password,
                // status: req.body.status
                studentId: req.body.studentId
            }, {new: true})
            .then(user => {
                if(!user) {
                    return res.status(404).send({
                        message: "User not found with email " + req.params.email
                    });
                }
                res.send(user);
            }).catch(err => {
                if(err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "User not found with email " + req.params.email
                    });                
                }
                return res.status(500).send({
                    message: "Error updating User with id " + req.params.id
                });
            });
        }
    })
    
};
