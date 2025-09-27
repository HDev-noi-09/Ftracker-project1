const mongoose=require('mongoose');


const expenseSchema=new mongoose.Schema({
    category:{type:String,required:true},
    amount:{type:Number,required:true}}, {timestamps:true}
);

const Expense =mongoose.model("Expense",expenseSchema);
module.exports=Expense;