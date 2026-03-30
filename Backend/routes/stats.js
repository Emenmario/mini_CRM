import express from 'express'
import db from "../db.js"

const router=express.Router()
router.get("/", async(req,res)=>{ 
    try {
        const [stats] = await db.execute(
            `select count(*) as totalLeads,
            sum(case when status="New" then 1 else 0 end) as newLeads,
            sum(case when status="contacted" then 1 else 0 end) as contactedLeads,  
            Round(sum(case when status="won" then 1 else 0 end)/count(*)*100,1) as conversionRate 
            from leads where assigned_to=?`, [req.user.id]
        )

        const row = stats[0]; 

        res.json({
            total: row.totalLeads || 0,
            new: row.newLeads || 0,
            contacted: row.contactedLeads || 0,
            conversion: row.conversionRate || 0        
        })
    } catch(error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
})
export default router;