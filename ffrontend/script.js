const categoryinput=document.getElementById("category");
const amountresult=document.getElementById("amount");
const expenseform=document.getElementById("expense-form");
const expensebody=document.getElementById("expensebody");

expenseform.addEventListener( "submit", async(e)=>{
    e.preventDefault();

    const category=categoryinput.value.trim();
    const amount=amountresult.value.trim();

    if(!category||!amount){
        alert("Please fill in both the fields...!");
        return;

    }

    const newExpense={category,amount:Number(amount)};
    try{
        const res=await fetch("http://localhost:5000/expenses", {
            method:"POST",
            headers:{
                "Content-type":"application/json",
            },
            body:JSON.stringify(newExpense)
    });
 
    if (!res.ok) {
    
    const errorData = await res.json().catch(() => ({}));
    alert("Error adding expense! " + (errorData.message || ""));
    return;
  }


  const data = await res.json();

  addExpenseToTable(data.expense);
  await getresponses();

  categoryinput.value = "";
  amountresult.value = "";


 } catch(error){
        console.error("Error...",error);
        alert("Something went wrong!");

    }
});


async function getresponses(){
    try{
        const res=await fetch("http://localhost:5000/expenses");
        const expenses =await res.json();
        expensebody.innerHTML=""

        expenses.forEach(exp=>addExpenseToTable(exp));


    }
    catch(err){
        console.error("Error fetching expenses!",err);

    }
}
window.onload=getresponses;



function addExpenseToTable(expense){
    const row=document.createElement("tr");
     row.setAttribute("id", expense._id);
     const newnamecategory=expense.category.charAt(0).toUpperCase() + expense.category.slice(1);
    row.innerHTML=`
    <td>${newnamecategory}</td>
    <td>${expense.amount}</td>
    <td>
    <button type="button" onclick="editExpense('${expense._id}', '${newnamecategory}', ${expense.amount})" class="bt1">Edit</button>
    <button type="button" onclick="deleteExpense('${expense._id}')" class="bt2">Delete</button>
    </td>
    `;
    expensebody.appendChild(row);

}

async function editExpense(id,oldcategory,oldexpense){
    let newcategory=prompt("Enter new category",oldcategory);
    let newamount=prompt("Enter new expense",oldexpense);
    newamount=Number(newamount);

    if(!newcategory||!newamount){
        return;
    }

    try{
        const res=await fetch(`http://localhost:5000/expenses/${id}`,
            {
                method:"PUT",
                headers:{"Content-type":"application/json"

                },
                body:JSON.stringify({category:newcategory,amount:Number(newamount)})
            
    });
    const data=await res.json();
    if(res.ok){
        alert("Expense Updated successfully!");
        getresponses();
    }
    else{
        alert("Error in Updating your expense, please try again!",data.message);
    }
    }
    catch(err){
        console.error("Error...",err);

    }
}

async function deleteExpense(id){
try{
    const res=await fetch(`http://localhost:5000/expenses/${id}`,{
        method:"DELETE", 

    });

    const data=await res.json();
    if(res.ok){
        alert(data.message);
        getresponses();

}
else{
alert("Error in deletion!",data.message)
}
}
catch(err){
    console.error("Error in deletion!",err);

}
}