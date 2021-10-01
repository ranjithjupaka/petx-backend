const mongoose = require('mongoose');
const uuidv1 = require('uuidv1');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    trim: true,
  },
  salt:{
      type: String
  },
  role: {
      type: Number,
      default:0,
  },
  history:{
      type:Array,
      default:[],
  }
},{timestamps:true});


userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = uuidv1()
    let secure_pass = (password) => {
      if (!password) return ''
      try {
        return crypto
          .createHmac('sha1', this.salt)
          .update(password)
          .digest('hex')
      } catch (err) {
        return ''
      }
    }
    this.hashed_password = secure_pass(password)
    console.log(this)
  })
  .get(function () {
    return this._password
  })

userSchema.methods = {
  encryptPassword(password) {
    if (!password) return ''
    try {
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    } catch (err) {
      return ''
    }
  },
  authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
}


module.exports = mongoose.model('User',userSchema);