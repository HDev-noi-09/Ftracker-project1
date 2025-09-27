document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:5000/insights");
    const data = await response.json();

    const totalSpentElement = document.getElementById("totalspent");
    const trendElement = document.getElementById("trend");
    totalSpentElement.textContent = data.total;
    trendElement.textContent = data.trend;

    const breakdownSection = document.getElementById("category-breakdown");
    const oldlist = document.getElementById("breakdown-list");
    if (oldlist) oldlist.remove();

    const ul = document.createElement("ul");
    ul.id = "breakdown-list";

    if (data.breakdown) {
      Object.entries(data.breakdown).forEach(([category, amount]) => {
        const li = document.createElement("li");
        li.textContent = `${category}: ${amount}`;
        ul.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No category breakdown available.";
      ul.appendChild(li);
    }

    breakdownSection.appendChild(ul);
  } catch (error) {
    console.error("Error fetching the insights!", error);
    document.getElementById("totalspent").textContent =
      "Error handling insights";
    document.getElementById("trend").textContent = "";
  }
});
