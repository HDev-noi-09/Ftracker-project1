const express=require('express');
const router=express.Router();
const Expense=require("../models/Expense");


router.get("/", async (req,res)=>{
    try{
        const expenses = await Expense.find();
        res.json(expenses);

    } catch (err){
        res.status(500).json({error:`Error occured ${err.message}`});
    }
    // const expenses=[
    //     {"id":1,"category": "groceries", "expense":`${50}`},
    //     {"id":2,"category":"Medicines", "expense":`${330}`},
    //     {"id":3,"category":"miscellaneous", "expense":`${500}`}
    // ];
  
    
});


router.post("/" , async (req,res)=>{
    try{
        const NewExpense= req.body;

        
            NewExpense.category=NewExpense.category.trim().toLowerCase();
        
        
         const savedExpenses = await Expense.findOneAndUpdate(
        { category: NewExpense.category },
        { $inc: { amount: NewExpense.amount } }, 
        { new: true, upsert: true }
      );
    

    res.status(201).json({message:"Expenses recieved!", expense:savedExpenses});
}
     catch(err){
        res.status(401).json({error:`Error occured ${err}`});

    }
});

router.put("/:id" , async (req,res)=>{
 
    try{
        let { id } = req.params;
        let { category , amount } = req.body;
        if(category){
            category=category.trim().toLowerCase();
        }
        let updatedExpense =await Expense.findByIdAndUpdate(
            id,
            {category , amount},
            {new:true , runValidators:true}
           
        );
        if(!updatedExpense){
            res.status(404).json({Message:"Expense not found"});
        }

        res.status(200).json({message:"Updation Successful!",uexpense:updatedExpense});
    } catch(error){
        res.status(400).json({message:error.message})
    }
    });

router.delete("/:id" , async (req,res)=>{
    try{
        const {id}= req.params;
        const deleted =await Expense.findByIdAndDelete(id);
        if(!deleted){
            res.status(404).json({message:"Expense not found!"})
        }
        res.status(200).json({message:"Deletion Successful",expense :deleted});
    } catch(error){
        res.status(500).json({message:error.message})
    }
    });


module.exports=router;