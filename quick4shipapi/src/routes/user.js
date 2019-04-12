const express = require('express')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const bcrypt = require('bcrypt')
var async = require("async")
var nodemailer = require("nodemailer")
var crypto = require("crypto")
const passport = require('passport')
const router = express.Router()



//import usermodel
const User = require('../models/usermodel')



//Token verification method
function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null'){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretkey')
    if(!payload){
        return res.status(401).send('Unauthorized request')
    }
    req.userId = payload.subject
    next()
}



//user root level => /user
router.get('/', (req,res) => {
    res.send('From user endpoint')
})

router.post('/register', (req,res) => {
    let userData = req.body
    //Joi validation structure  
    const localSchema = Joi.object().keys({
        username: Joi.string().min(3).max(12).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().alphanum().min(6).max(16).required()
    })      
    const schema = Joi.object().keys({
        method: Joi.string().required(),
        local: localSchema 
    })
    //check input field validations
    Joi.validate(req.body, schema, (err, result) => {
        if(err){
            res.status(401).send(err.details[0].message)
        }else{
                var emailCheck = false
                checkEmail(userData, emailCheck, res)
        }
    }) 
})

    async function checkEmail(userData, emailCheck, res){
        try{
            //check weither email exist on the database before register
            await User.findOne({ "local.email": userData.local.email}, (error, user) => {
                if(error){
                    console.log(error)
                }else{
                    if(user){
                        emailCheck = true
                        res.status(422).send('Email Address Exist')
                    }
                }
            })
        }catch(err){
            console.log(err)
        }
        registerUser(userData, emailCheck, res)
    }


    async function registerUser(userData, emailCheck, res){
        try{
            if(emailCheck === false){
                
                let user = new User(userData)
                //hash the plaintext password
                bcrypt.hash(user.local.password, 10, function(err, hash){
                    //save user to mongo
                    user.local.password = hash
                    user.save((error, registeredUser) =>{
                        if(error){
                        console.log(error)
                        }else{
                            let payload = { subject: registeredUser._id}
                            let token = jwt.sign(payload, 'secretkey')
                            let userData = {
                                username: registeredUser.local.username,
                                email: registeredUser.local.email
                            }
                            res.status(200).send({token, userData})
                        }
                    })
                })
                emailCheck = false
            }
        }catch(err){
            console.log(err)
        }    
    }


router.post('/login', (req,res) => {
    let userData = req.body
    //Joi validation structure
    const localSchema = Joi.object().keys({
        email: Joi.string().trim().email().required(),
        password: Joi.string().alphanum().min(6).max(16).required()
    })      
    const schema = Joi.object().keys({
        method: Joi.string().required(),
        local: localSchema 
    })
    //check input fields validation
    Joi.validate(req.body, schema, (err, result) => {
        if(err){
            res.status(401).send(err.details[0].message)
        }else{
            //get the user from the database
            User.findOne({ "local.email": userData.local.email}, (error, user) => {
                if(error){
                    console.log(error)
                }else{
                    if(!user){
                        res.status(401).send('Invalid email')
                    }else{
                        //compare plaintext password with hashed password
                        bcrypt.compare(userData.local.password, user.local.password, function(err, result){
                            if(result){
                                let payload = { subject: user._id}
                                let token = jwt.sign(payload, 'secretkey')
                                let userData = {
                                        username: user.local.username,
                                        email: user.local.email
                                }
                                res.status(200).send({token, userData})
                            }else{
                                res.status(401).send('Invalid password')
                            }
                        })
                    }  
                }
            })
        }
    })
})



router.post('/resetpassword', (req,res,next) => {
    
    const schema = Joi.object().keys({
        email: Joi.string().email().required()
    })
    Joi.validate(req.body, schema, (err, result) => {
        if(err){
            res.json({message:err.details[0].message})
        }else{
            async.waterfall([
                function(done) {
                  crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                  });
                },
                function(token, done) {
                  User.findOne({ "local.email": req.body.email }, function(err, user) {
                    if (!user) {
                        res.json({message:'Email Does not Exist'})
                    }else{
                        user.local.resetPasswordToken = token;
                        user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            
                        user.save(function(err) {
                            done(err, token, user);
                        });
                    }
                  });
                },
                function(token, user, done) {
                  var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail', 
                    auth: {
                      user: 'mrslegends@gmail.com',
                      pass: 'MRSlegends7788'
                    }
                  });
                  var mailOptions = {
                    to: user.local.email,
                    from: 'mrslegends@gmail.com',
                    subject: 'Node.js Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                      'http://localhost:4200/resetpassword/' + token + '\n\n' +
                      'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                  };
                  smtpTransport.sendMail(mailOptions, function(err) {
                    console.log('mail sent');
                    res.json({message: `An e-mail has been sent to  ${user.local.email}  with further instructions.`, status: true})
                    done(err, 'done');
                  });
                }
              ], function(err) {
                if (err) return next(err);
              });
        }
    }) 
})



router.post('/reset', (req,res) =>{

    const schema = Joi.object().keys({
        password: Joi.string().alphanum().min(6).max(16).required(),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } }),
        token: Joi.string().required()
    })
    
    Joi.validate(req.body, schema, (err, result) => {
        if(err){
            res.json({message:err.details[0].message})
        }else{
            async.waterfall([
                function(done) {
                    //check token is valid or not
                    User.findOne({ "local.resetPasswordToken": req.body.token, "local.resetPasswordExpires": { $gt: Date.now() } }, function(err, user) {
                    if(err){
                        console.log(err)
                    }
                    
                    if (!user) {
                      res.json({message:'Password reset token is invalid or has expired.'})
                    }else{
                        try{
                            user.local.resetPasswordToken = undefined;
                            user.local.resetPasswordExpires = undefined;
                            //hash the plaintext password
                            bcrypt.hash(user.local.password, 10, function(err, hash){
                                //save user to mongo
                                user.local.password = hash
                                user.save((error, registeredUser) =>{
                                    if(error){
                                    console.log(error)
                                    }else{
                                        let payload = { subject: registeredUser._id}
                                        let token = jwt.sign(payload, 'secretkey')
                                        let userData = {
                                            username: registeredUser.local.username,
                                            email: registeredUser.local.email
                                        }
                                        res.status(200).send({token, userData})
                                    }
                                    done(err, registeredUser);
                                })
                            })
                        }catch(err){
                            console.log(err)
                        }
                    }
                   
                  });
                },
               function(user, done) {
                  var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail', 
                    auth: {
                        user: 'mrslegends@gmail.com',
                        pass: 'MRSlegends7788'
                    }
                  });
                  var mailOptions = {
                    to: user.local.email,
                    from: 'mrslegends@gmail.com',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' +
                      'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
                  };
                  smtpTransport.sendMail(mailOptions, function(err) {
                    done(err);
                  });
                }
              ], function(err) {
                  
              });
        }
    })

})



//client id = 357040066517-aaglkn83u08lk1pneq767j218j37a467.apps.googleusercontent.com
//client secret = bb4esjK-41IE8Zfrplpwl9Lm


//Google Oauth
router.route('/oauth/google')
    .post(passport.authenticate('googleToken', { session: false}), (req,res) =>{
        let user = req.user
        if(user){
            let payload = { subject: user.google.id}
            let token = jwt.sign(payload, 'secretkey')
            let username = user.google.email.split('@')[0]
            let userData = {
                    username: username,
                    email: user.google.email
            }
            res.status(200).send({token, userData})
        }else{
            res.status(500).send('some thing is wrong')
        }
    })


router.get('/events', (req,res) => {
    let events = [
        {
            "_id": "1",
            "name": "malith",
            "description": "so fun",
            "date": "2012-04-23"
        },
        {
            "_id": "2",
            "name": "dulan",
            "description": "so fun",
            "date": "2012-04-23"
        },
        {
            "_id": "3",
            "name": "kuruwita",
            "description": "so fun",
            "date": "2012-04-23"
        },
        {
            "_id": "4",
            "name": "roshen",
            "description": "so fun",
            "date": "2012-04-23"
        }
    ]

    res.json(events)
})


router.get('/special', verifyToken,(req,res) => {
    let events = [
        {
            "_id": "1",
            "name": "malith",
            "description": "so fun",
            "date": "2012-04-23"
        },
        {
            "_id": "2",
            "name": "dulan",
            "description": "so fun",
            "date": "2012-04-23"
        },
        {
            "_id": "3",
            "name": "kuruwita",
            "description": "so fun",
            "date": "2012-04-23"
        },
        {
            "_id": "4",
            "name": "roshen",
            "description": "so fun",
            "date": "2012-04-23"
        }
    ]

    res.json(events)
})



module.exports = router