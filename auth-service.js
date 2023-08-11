const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// var Schema = mongoose.Schema; Is this necessary???
var userSchema = new mongoose.Schema({
    "userName" : {
        "type" : String,
        "unique" : true 
    },
    "password" : String,
    "email" : String,
    "loginHistory" : [{
        "dateTime" : Date,
        "userAgent" : String
    }]
});

let User; // to be defined on new connection (see initialize)


module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        // let db = mongoose.createConnection("mongodb+srv://manreet:manreet@senecamanreet.wwafflw.mongodb.net/?retryWrites=true&w=majority");
        let db = mongoose.createConnection("mongodb+srv://sumanjit:sumanjit@senecaweb.umrujdw.mongodb.net/?retryWrites=true&w=majority");

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
};

module.exports.registerUser = function(userData) {
    return new Promise(function (resolve, reject) { 
        if (userData.password == userData.password2) {
            bcrypt.hash(userData.password, 10, function(err, hash) {
                if (err) {
                    reject("There was an error encrypting the password");
                }
                userData.password = hash;
                let newUser = new User(userData);
                newUser.save(function(err) {
                    if (err) {
                        if (err.code == 11000) {
                            reject("User Name already taken");
                        } else {
                            reject("There was an error creating the user: " + err);
                        }
                    } else {
                        resolve();
                    }
                });
            })
            } else {
            reject("Passwords do not match");
        }
    });
};




module.exports.checkUser = function(userData) {
    return new Promise(function (resolve, reject) {
        User.find({ userName: userData.userName }).exec()
        .then((users) => {
            if (users.length == 0) {
                reject("Unable to find user: " + userData.userName);
            } else {
                bcrypt.compare(userData.password, users[0].password, function (err, result) {
                    if (result === true) {
                        if (users[0].loginHistory == null)
                            users[0].loginHistory = []; // make array if none exists (first login)

                        users[0].loginHistory.push({ 
                            dateTime: (new Date()).toString(),
                            userAgent: userData.userAgent
                        });
                        
                        // using updateOne instead of update
                        User.updateOne({ userName: users[0].userName },
                            { $set: { loginHistory: users[0].loginHistory } }
                        ).exec()
                        .then(function() { 
                            resolve(users[0]);
                        })
                        .catch(function(err) { 
                            reject("There was an error verifying the username: " + err);
                        });
                    } else if (result === false) {
                        reject("Incorrect Password for user: " + userData.userName);
                    }
                });
            }
        })
        .catch(function() {
            reject("Unable to find user: " + userData.userName);
        }); 
    })
}