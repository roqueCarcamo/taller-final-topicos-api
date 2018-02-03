const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcryptjs');

const schema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(value) {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email address'
    },
  },
  password: {
    type: String,
    required: true
  }
},{
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.password;
      }
    }
});

schema.pre('save', function(next) {
  const user = this;
  
  if(user.isNew || user.isModified('password')){
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
      });
    });
  }else{
    next();
  }
});

schema.methods.comparePassword = function(password, next) {
  const user = this;
  bcrypt.compare(password, this.password, function(err, match) {
    if (err) {
      next(new Error(err))
    } else {
      next(null, match);
    }
  });
}
  
module.exports = mongoose.model('user', schema);
