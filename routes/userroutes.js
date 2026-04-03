const exp=require('express')
const {test,updateuserinfo,deleteuser,getUserListing,getUser}=require('../controller/user controller')
const { verifyToken } = require('../utills/verifyuser')
const router=exp.Router()

router.get('/test',test)
router.post('/update/:id',verifyToken,updateuserinfo)
router.delete('/delete/:id',verifyToken,deleteuser)
router.get('/listings/:id',verifyToken,getUserListing)
router.get('/:id',getUser)

module.exports=router