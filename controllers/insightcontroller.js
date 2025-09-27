const Expense=require("../models/Expense");

const getInsights=async(req,res)=>{
    try{
        const expenses=await Expense.find();
        if(expenses.length === 0){
           return res.json({total: "You spent $0 in total",
                            breakdown: {},
                            trend: "Not enough data to give insights.."});
        }
        const total=expenses.reduce((sum,exp)=>sum+exp.amount,0);


        const categoryTotals={};
        expenses.forEach(exp=>{
            categoryTotals[exp.category]=(categoryTotals[exp.category] || 0) +Number(exp.amount);
        })

        const categoryBreakdown={};
        for(let cat in categoryTotals){
            categoryBreakdown[cat]=((categoryTotals[cat]/total )*100).toFixed(2)+"%";
        }



        const now=new Date();
        let lastDay=new Date(now.setDate(now.getDate()-1));
        let lastDayExpenses=expenses.filter(exp=>exp.createdAt && new Date(exp.createdAt)>=lastDay);
        let prevDay=new Date(lastDay.setDate(lastDay.getDate()-1));
      
        let prevDayExpenses=expenses.filter(exp=>exp.createdAt && new Date(exp.createdAt) < lastDay && new Date(exp.createdAt) >= prevDay);


        let lastDayTotal=lastDayExpenses.reduce((sum,exp)=>sum + exp.amount,0);
         let prevDayTotal=prevDayExpenses.reduce((sum,exp)=>sum + exp.amount,0);

         let trendMessage="Not enough data to give insights..";
         if(prevDayTotal>0){
            let change=(((lastDayTotal-prevDayTotal)/prevDayTotal)*100).toFixed(2);
            trendMessage=change>0 ? `Your Expenses increased by ${change}% compared to last week!`:
            `Your Expenses decreased by ${Math.abs(change)}% compared to last week!`;
         }
         console.log("Debug => total:", total, "breakdown:", categoryBreakdown, "last:", lastDayTotal, "prev:", prevDayTotal);

         res.json({
            total:`You spent $${total} in total`,breakdown:categoryBreakdown,trend:trendMessage
         });
    }   

    catch(err){
        res.status(500).json({message:"Error getting insights!!Try again...", error : err.message});

    }
    
}
module.exports={getInsights};