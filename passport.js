const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./models/Users');

const cookieExtractor = req =>{
    let token = null;
    if(req && req.cookies){
        token=req.cookies["access_token"];
    }
    return token
}

//Autherization
passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey:"NoobCoder"
},(payload,done)=>{
    User.findById({_id: payload.sub}, (err, user)=>{
        if(err){
            return done(err,false)
        }
        if(user){
            return done(null,user)
        }
        else{
            return done(null,false)
        }
    });
}));

//Authendication local statergy username and password
passport.use(new LocalStrategy((username,password,done)=>{
    User.findOne({username},(err,user)=>{
        //something went wrong with database
        if(err){console.log(err)}
        //if user does'nt exists
        if(!user){return done(null,false)}
        //check if password is correct
        user.comparePassword(password,done);
    })
}))