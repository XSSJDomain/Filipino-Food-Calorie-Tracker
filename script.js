let totalCalories = 0;
let totalProtein = 0;

let foodHistory = [];

const foodSelect = document.getElementById("foodSelect");
const foodList = document.getElementById("foodList");

foods.forEach(food => {
  const option = document.createElement("option");
  option.value = food.name;
  option.textContent = `${food.name} (${food.category})`;
  foodSelect.appendChild(option);
});

function calculateNeeds() {
  const weight = Number(document.getElementById("weight").value);
  const height = Number(document.getElementById("height").value);
  const age = Number(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;
  const activity = Number(document.getElementById("activity").value);
  const goal = document.getElementById("goal").value;

  let bmr = 0;

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  let calories = bmr * activity;

  if (goal === "bulk") calories += 400;
  if (goal === "cut") calories -= 400;

  let protein = weight * 2;

  document.getElementById("caloriesResult").textContent =
    Math.round(calories);

  document.getElementById("proteinResult").textContent =
    Math.round(protein);
}

function addFood() {
  const selectedFood = foodSelect.value;
  const food = foods.find(f => f.name === selectedFood);

  if (!food) return;

  totalCalories += food.calories;
  totalProtein += food.protein;

  foodHistory.push(food.calories);

  const li = document.createElement("li");
  li.innerHTML = `
    ${food.name} - ${food.calories} kcal | ${food.protein}g protein
    <button onclick="removeFood(this, ${food.calories}, ${food.protein})">Remove</button>
  `;

  foodList.appendChild(li);

  updateTotals();
  updateChart();
}

function removeFood(button, calories, protein) {
  totalCalories -= calories;
  totalProtein -= protein;

  button.parentElement.remove();

  updateTotals();
}

function updateTotals() {
  document.getElementById("totalCalories").textContent =
    totalCalories;

  document.getElementById("totalProtein").textContent =
    totalProtein;
}

let chart;

function updateChart() {
  const ctx = document.getElementById("progressChart");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: foodHistory.map((_, i) => `Meal ${i + 1}`),
      datasets: [{
        label: "Calories Intake",
        data: foodHistory,
        borderWidth: 3,
        tension: 0.3
      }]
    },
    options: {
      responsive: true
    }
  });
}
