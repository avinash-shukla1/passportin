var express = require('express');
var router = express.Router();
const localStrategy = require('passport-local')
var userModel = require("./users");
const passport = require('passport');
const multer = require('multer');
const path = require("path");
  
/* GET home page. */
passport.use(new localStrategy(userModel.authenticate()));
passport.use(userModel.createStrategy())

function fileFilter (req, file, cb) {
  if(file.mimetype==="image/png" || file.mimetype ==="image/jpg" || file.mimetype === "image/jpeg"){
    cb(null, true)                                            
  } 
  else{
    cb(new Error('I don\'t have a clue!'))
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    var dt = new Date();
    var fn = Math.floor(Math.random()*10000000) + dt.getTime() + file.originalname;
    cb(null,fn)
  } 
})

const upload = multer({ storage: storage , fileFilter : fileFilter})



router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
}); 

router.get('/register', function(req, res) {
  res.send("hello");
});

router.get('/profile',function(req, res) {
  userModel.findOne({email:req.session.passport.user})
  .then(function(foundUser){
    res.render("profile",{user:foundUser});
  })
});

router.post('/uploads',isLoggedIn,upload.single('filename'),function(req,res){
  userModel.findOne({email:req.session.passport.user})
  .then(function(loggedUser){
    loggedUser.image = req.file.filename;
    loggedUser.save()
  })
  .then(()=>{
    res.redirect("back"); 
  })
});


router.get('/feed', function(req, res, next) {
  userModel.find().then(function(AllUser){
    res.render("feed",{AllUser});
  })
});

// router.get('/profile',isLoggedIn,async function(req,res){
//   let data = await req.user
//   await data.save()
//   res.render('profile',{data})
// })

router.get('/like/:id',isLoggedIn,function(req, res) {
  userModel.findOne({_id:req.params.id})
  .then(function(user){
    var indexJisParMilega = user.like.indexOf(req.session.passport.user);
    if(indexJisParMilega === -1){
      user.like.push(req.session.passport.user);
    }
    else{
      user.like.splice(indexJisParMilega,1);
    }
    user.save()
    .then(function(){
      res.redirect("back");
    })
  })
});


router.post('/register',function(req,res){
  var newUser = new userModel({
    username:req.body.username,
    email:req.body.email,
    number:req.body.number,
    image:req.body.image
  })
  userModel.register(newUser ,req.body.password)
  .then(function(user){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile')
    })
  })
});

router.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/'
}),function(req,res){});    

router.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/')
  }
}

module.exports = router;