const passport = require('passport')
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const User = require('./models/usermodel')




passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: '357040066517-aaglkn83u08lk1pneq767j218j37a467.apps.googleusercontent.com',
    clientSecret: 'bb4esjK-41IE8Zfrplpwl9Lm'
}, async (accessToken, refreshToken, profile, done) => {
    try{
        console.log('accessToken', accessToken)
        console.log('refreshToken', refreshToken)
        console.log('profile', profile)
        //Check whether this current user exist in out database
        const existingUser = await User.findOne({ "google.id": profile.id})
        if(existingUser){
            console.log('exist')
            return done(null, existingUser)
        }
        console.log('doesent exist')
        //if new account
        const newUser = new User({
            method: 'google',
            google:{
                id: profile.id,
                email: profile.emails[0].value
            }
        })

        await newUser.save()
        done(null, newUser)
    }catch(error){
        done(error, false, error.message)
    }
    
}))