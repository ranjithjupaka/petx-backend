const { body, validationResult } = require('express-validator')

//this sets the rules on the request body in the middleware
exports.validationRules = () => {
  return [
    body('name', 'Name should be atleast 3 char').isLength({ min: 3 }),
    body('email', 'Enter proper email').isEmail(),
    body('password', 'Password should be atleast 6 char').isLength({
      min: 6,
    }),
    body('password', 'Password should contain atleast one number').matches(/\d/)
  ]
}


//while this function executes the actual rules against the request body
exports.validation = () => {
  return (req, res, next) => {
     const errors = validationResult(req)
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors })
     }
     next()
  }
}


