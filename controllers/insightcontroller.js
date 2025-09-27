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
        let lastWeek=new Date(now.setDate(now.getDate()-7));
        let lastWeekExpenses=expenses.filter(exp=>exp.createdAt && new Date(exp.createdAt)>=lastWeek);
        let prevWeek=new Date(lastWeek.setDate(lastWeek.getDate()-7));
      
        let prevWeekExpenses=expenses.filter(exp=>exp.createdAt && new Date(exp.createdAt) < lastWeek && new Date(exp.createdAt) >= prevWeek);


        let lastWeekTotal=lastWeekExpenses.reduce((sum,exp)=>sum + exp.amount,0);
         let prevWeekTotal=prevWeekExpenses.reduce((sum,exp)=>sum + exp.amount,0);

         let trendMessage="Not enough data to give insights..";
         if(prevWeeTotal>0){
            let change=(((lastWeekTotal-prevWeekTotal)/prevWeekTotal)*100).toFixed(2);
            trendMessage=change>0 ? `Your Expenses increased by ${change}% compared to last week!`:
            `Your Expenses decreased by ${Math.abs(change)}% compared to last week!`;
         }
         console.log("Debug => total:", total, "breakdown:", categoryBreakdown, "last:", lastWeekTotal, "prev:", prevWeekTotal);

         res.json({
            total:`You spent $${total} in total`,breakdown:categoryBreakdown,trend:trendMessage
         });
    }   

    catch(err){
        res.status(500).json({message:"Error getting insights!!Try again...", error : err.message});

    }
    
}
module.exports={getInsights};
