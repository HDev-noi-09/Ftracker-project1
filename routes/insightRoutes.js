const express=require("express");
const {getInsights}=require("../controllers/insightcontroller");

const router=express.Router();
 
router.get("/",getInsights);
module.exports=router;