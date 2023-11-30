var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/passportdb');

var userSchema = mongoose.Schema({
  username:String,
  password:String,
  email:String,
  like:{
    type : Array,
    default: []
  },
  image:{
    type:String,
    default:"default.jpg"
  },
  number:Number
});

userSchema.plugin(passportLocalMongoose,{usernameField:'email'});

module.exports = mongoose.model("user",userSchema);
