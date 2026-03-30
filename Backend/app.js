import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import  auth  from "./auth.js"; 
import leads from "./routes/leads.js"
import stats from "./routes/stats.js"
import notes from "./routes/notes.js"
import jwt from "jsonwebtoken"
const app = express();

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));
const authMiddleware=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"no token provided gng"})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next()
    }
    catch(error){
        console.error(error)
        res.status(500).json({message:"invalid token"})
    }
}
app.use(express.json());
app.use('/auth',auth)
app.use('/leads',authMiddleware,leads)
app.use("/stats" ,authMiddleware,stats)
app.use("/notes" ,authMiddleware,notes)


app.get('/', (req, res) => {
    res.send('CRM Backend is live');
});


app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});