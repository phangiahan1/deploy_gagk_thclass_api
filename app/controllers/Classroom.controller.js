const Classroom = require('../models/Classroom.model.js');

// Create and Save a new Classroom
exports.create = (req, res) => {
    // Validate request
    if(!req.body.classname) {
        return res.status(400).send({
            message: "Classname content can not be empty"
        });
    }
    if(!req.body.section) {
        return res.status(400).send({
            message: "Section content can not be empty"
        });
    }
    if(!req.body.subject) {
        return res.status(400).send({
            message: "Subject content can not be empty"
        });
    }
    if(!req.body.room) {
        return res.status(400).send({
            message: "Room content can not be empty"
        });
    }

    // Create a Classroom
    const classroom = new Classroom({
        classname: req.body.classname , 
        section:req.body.section,
        subject: req.body.subject,
        room: req.body.room,
        owner: req.body.owner
    });

    // Save Classroom in the database
    classroom.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Classroom."
        });
    });
};

// Retrieve and return all Classroom from the database.
exports.findAll = (req, res) => {
    Classroom.find()
    .then(classroom => {
        res.send(classroom);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Classroom."
        });
    });
};

exports.findcreate = (req, res) => {
    Classroom.find({owner: req.params.email})
    .then(classroom => {
        res.send(classroom);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Classroom."
        });
    });
};

// Find a single Classroom with a id
exports.findOne = (req, res) => {
    Classroom.findById(req.params.id)
    .then(classroom => {
        if(!classroom) {
            return res.status(404).send({
                message: "Classroom not found with id " + req.params.id
            });            
        }
        res.send(classroom);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Classroom not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Classroom with id " + req.params.id
        });
    });
};

// Update a Classroom identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.classname) {
        return res.status(400).send({
            message: "Classroom content can not be empty"
        });
    }

    // Find Classroom and update it with the request body
    Classroom.findByIdAndUpdate(req.params.id, {
        classname: req.body.classname, 
        section:req.body.section,
        subject: req.body.subject,
        room: req.body.room
    }, {new: true})
    .then(classroom => {
        if(!classroom) {
            return res.status(404).send({
                message: "Classroom not found with id " + req.params.id
            });
        }
        res.send(classroom);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Classroom not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating Classroom with id " + req.params.id
        });
    });
};

// Delete a Classroom with the specified id in the request
exports.delete = (req, res) => {
    Classroom.findByIdAndRemove(req.params.id)
    .then(Classroom => {
        if(!Classroom) {
            return res.status(404).send({
                message: "Classroom not found with id " + req.params.id
            });
        }
        res.send({message: "Classroom deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Classroom not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete Classroom with id " + req.params.id
        });
    });
};
