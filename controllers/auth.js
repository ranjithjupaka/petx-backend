const { errorHandler } = require('../helpers/errHandler');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();



exports.signup = (req,res) => {
  console.log('req.body', req.body)
  const user = new User(req.body)

  user.save((err, user) => {
    if (err) {
      console.log(err)
      return res.status(400).json({
        err: errorHandler(err),
      })
    }
    user.salt = undefined
    user.hashed_password = undefined
    res.json({
      user,
    })
  })
}


exports.signin = (req,res) => {

    console.log('req.body', req.body)
    const { email, password } = req.body;

     User.findOne({ email }, (err, user) => {
       if (err || !user) {
         return res.status(400).json({
           error: 'User with that email does not exist. Please signup',
         })
       }
       // if user is found make sure the email and password match
       // create authenticate method in user model
       if (!user.authenticate(password)) {
         return res.status(401).json({
           error: 'Email and password dont match',
         })
       }
       // generate a signed token with user id and secret
       const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY)
       // persist the token as 't' in cookie with expiry date
       res.cookie('tkn', token, { expire: new Date() + 9999 })
       // return response with user and token to frontend client
       const { _id, name, email, role } = user
       return res.json({ token, user: { _id, email, name, role } })
     })

}

exports.signout = (req,res) => {
    res.clearCookie('tkn');
    res.json({message:"signout sucess"});
}

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET_KEY,
  algorithms: ['HS256'], // added later
  userProperty: 'auth',
})

exports.isAuth = (req,res,next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;

    if(!user){
        return res.status(403).json({
            error:'not authorized'
        });
    }

    next();
};

exports.isAdmin = (req, res, next) => {

  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'Admin acess denied',
    });
  }

  next();
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  res.send(req.profile);
}

exports.update = (req, res) => {
  User.findOneAndUpdate(
    {_id:req.profile._id},
    {$set:req.body},
    {new:true},
    (err,user) => {
      if(err){
      return res.status(400).json({
        error: 'You are not authorized to perform this action',
      })
      }
     user.hashed_password = undefined
     user.salt = undefined
     res.json(user)
  })
}