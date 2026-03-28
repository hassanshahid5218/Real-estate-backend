const exp=require('express')
const router=exp.Router()
const {creatingList,deleteListing,updateListing,getListing,getListings}=require('../controller/list controller.js')
const { verifyToken } = require('../utills/verifyuser.js')
router.post('/create',verifyToken,creatingList)
router.delete('/delete/:id',verifyToken,deleteListing)
router.post('/update/:id',verifyToken,updateListing)
router.get('/get/:id',getListing)
router.get('/get',getListings)


module.exports=router