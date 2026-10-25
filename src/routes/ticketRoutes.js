const router=require('express').Router();
const repo=require('../repositories/ticketRepository');
router.get('/available',async(req,res)=>{try{res.json(await repo.findAvailable());}catch(e){console.error(e);res.status(500).json({error:'Loi truy van ticket'});}});
module.exports=router;
