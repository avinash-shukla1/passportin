var express = require('express');
var router = express.Router();
var userModel = require("./users")
const passport = require('passport');
const localStrategy =require("passport-local")

passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/profile',isLoggedIn,function(req,res,next){  
  userModel.findOne({ username: req.session.passport.user})
  .then(function(founduser){
    res.render("profile",{ user: founduser});
    
  })
});
router.get('/feed',function(req,res){
  userModel.find().then(function(allusers){
    res.render("feed",{allusers})
  })
})
router.post('/register',function(req,res){
  var userDets = new userModel ({
    username: req.body.username,
    retypepassword: req.body.retypepassword,

    number: req.body.number,
  })
  userModel.register(userDets, req.body.password)
  .then(function(){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile')
    })
  })
})

router.post('/login', passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect: '/' 
}),function(req,res,next){} );

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
function isLoggedIn (req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect("/profile")
  }
}
router.get('/like/:id',isLoggedIn,function(req,res,next){
  userModel.findOne({_id: req.params.id})
  .then(function(post){
   if(post.like.indexOf(req.session.passport.user) === -1){
    post.like.push(req.session.passport.user);
   }
   else{
    post.like.splice(post.like.indexOf(req.session.passport.user) === -1)

    post.save()
    .then(function(){
      res.redirect("back");
    });
   }
})
});
module.exports = router;
