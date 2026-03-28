const exp=require('express');
const {signup,signin,handlegoogle,updateUser,handlesignout}=require('../controller/auth controller.js')
const router=exp.Router();

router.post('/signup',signup)
router.post('/signin',signin)
router.post('/google',handlegoogle)
router.put('/update/:id', updateUser);
router.get('/signout',handlesignout);

module.exports=router