var mongoose = require('mongoose');
var plm = require("passport-local-mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/pass')
var userSchema = mongoose.Schema({
  username:String,
  password:String,
  retypepassword:String,
  // Number:Number,
  // image:String,
  like:{
    type:Array,
    default:[]
  }
})
userSchema.plugin(plm);
module.exports = mongoose.model('user',userSchema);