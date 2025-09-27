const express=require('express');
const mongoose=require('mongoose');
const expenseRoutes=require('./routes/expenses');
const insightRoutes= require('./routes/insightRoutes.js');
const cors=require("cors");


const app=express();

app.use(cors(
    {
          origin: "http://127.0.0.1:5500"
    }
));
app.use(express.json());
app.use("/insights",insightRoutes);

app.use("/expenses",expenseRoutes);




app.get("/",(req,res)=>{
    res.send("Finance tracker app running behind...");
});



mongoose.connect("mongodb+srv://erhimaghna09_Ftracker_01:FtrackER09p_01@financetrackercluster.cghapyl.mongodb.net/?retryWrites=true&w=majority&appName=FinancetrackerCluster")
.then(()=>console.log("MongoDB Connected Successfully")).catch((error)=>console.log("Error occured in connection",error));
app.listen(5000,()=>{
    console.log("Server is successfully running on port 5000...");
});