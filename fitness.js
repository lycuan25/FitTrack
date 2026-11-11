
// ======================================
// 1. BMI CALCULATOR
// ======================================

const bmiForm = document.getElementById("bmiForm");

// Listen for form submission instead of button clicks.
// This also works when the user presses Enter.

bmiForm.addEventListener("submit", function(event) {

    // Prevent the browser from refreshing the page.
    event.preventDefault();

    const weight = Number(document.getElementById("bmiWeight").value);
    const height = Number(document.getElementById("bmiHeight").value);

    // BMI requires height in meters, not centimeters.
    const heightInMeters = height / 100;

    // BMI formula: weight divided by height squared.
    const bmi = weight / (heightInMeters * heightInMeters);

    // Keep only one decimal place for a cleaner result.
    const roundedBMI = bmi.toFixed(1);

    // These variables will hold the category and its explanation.
    let category = "";
    let explanation = "";

    // Each condition checks which BMI range the result belongs to.
    if (bmi < 18.5) {
        category = "Underweight";
        explanation = "Your BMI is below the usual adult reference range.";
    }
    else if (bmi < 25) {
        category = "Normal range";
        explanation = "Your BMI is within the usual adult reference range.";
    }
    else if (bmi < 30) {
        category = "Overweight";
        explanation = "Your BMI is above the usual adult reference range.";
    }
    else {
        category = "Obesity range";
        explanation = "Your BMI is in the adult obesity screening range.";
    }

    // textContent changes existing HTML content without replacing its elements.
    document.getElementById("bmiValue").textContent = roundedBMI;
    document.getElementById("bmiCategory").textContent = category;
    document.getElementById("bmiMessage").textContent = explanation;

    // The same result is also sent to the overview dashboard.
    document.getElementById("overviewBMI").textContent = roundedBMI;
    document.getElementById("overviewBMIStatus").textContent = category;

});


// ======================================
// 2. DAILY CALORIE ESTIMATOR
// ======================================

const calorieForm = document.getElementById("calorieForm");

calorieForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Read the user's information from the form.
    // Number() converts numerical input strings into actual numbers.

    const age = Number(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const weight = Number(document.getElementById("calWeight").value);
    const height = Number(document.getElementById("calHeight").value);
    const activity = Number(document.getElementById("activity").value);
    const goal = document.getElementById("goal").value;

    // BMR estimates the energy the body uses at rest.
    // The formula changes depending on the selected sex.

    let bmr;

    if (gender === "male") {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    }
    else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Multiplying BMR by activity estimates total daily energy needs.
    const maintenanceCalories = bmr * activity;

    // The fitness goal determines whether calories increase or decrease.
    let targetCalories;
    let goalMessage = "";

    if (goal === "lose") {
        targetCalories = maintenanceCalories - 300;
        goalMessage = "Estimated calorie target for gradual weight loss.";
    }
    else if (goal === "gain") {
        targetCalories = maintenanceCalories + 300;
        goalMessage = "Estimated calorie target for gradual weight gain.";
    }
    else {
        targetCalories = maintenanceCalories;
        goalMessage = "Estimated calorie target for weight maintenance.";
    }

    // Math.round() removes decimal places from the calorie estimates.
    const roundedCalories = Math.round(targetCalories);
    const roundedMaintenance = Math.round(maintenanceCalories);

    // toLocaleString() adds separators to large numbers (2,000 instead of 2000).
    document.getElementById("calorieValue").textContent =
        roundedCalories.toLocaleString() + " kcal";

    // Capitalize the first letter of the selected fitness goal.
    document.getElementById("calorieGoal").textContent =
        goal.charAt(0).toUpperCase() + goal.slice(1) + " Goal";

    document.getElementById("calorieMessage").textContent =
        goalMessage + " Maintenance estimate: " +
        roundedMaintenance.toLocaleString() + " kcal/day.";

    // The dashboard displays maintenance calories, not the adjusted goal.
    document.getElementById("overviewCalories").textContent =
        roundedMaintenance.toLocaleString();

});


// ======================================
// 3. WATER INTAKE TRACKER
// ======================================

// Store frequently used HTML elements in variables.
// This avoids searching the document every time we need them.

const waterWeight = document.getElementById("waterWeight");
const setWaterGoal = document.getElementById("setWaterGoal");
const waterGoalDisplay = document.getElementById("waterGoal");
const waterAmount = document.getElementById("waterAmount");
const waterPercentage = document.getElementById("waterPercentage");
const waterMessage = document.getElementById("waterMessage");
const waterProgress = document.querySelector(".water-progress");

// localStorage keeps information in the browser even after closing the page.
// The saved goal is reused when the user visits the website again.

let dailyWaterGoal = Number(
    localStorage.getItem("fittrackWaterGoal")
) || 0;

let waterConsumed = 0;

// Compare today's date with the date stored in the browser.
// This prevents yesterday's water intake from appearing as today's progress.

const today = new Date().toLocaleDateString("en-CA");
const savedWaterDate = localStorage.getItem("fittrackWaterDate");

if (savedWaterDate === today) {

    // Restore today's previous progress.
    waterConsumed = Number(
        localStorage.getItem("fittrackWaterConsumed")
    ) || 0;

}
else {

    // A new day means the consumed amount starts from zero.
    waterConsumed = 0;

    localStorage.setItem("fittrackWaterDate", today);
    localStorage.setItem("fittrackWaterConsumed", 0);

}


// This function keeps all three water values synchronized in storage.
function saveWaterData() {

    localStorage.setItem("fittrackWaterDate", today);
    localStorage.setItem("fittrackWaterGoal", dailyWaterGoal);
    localStorage.setItem("fittrackWaterConsumed", waterConsumed);

}


// Update every part of the water tracker whenever its data changes.
function updateWaterDisplay() {

    // Without a goal, there is no percentage to calculate.
    if (dailyWaterGoal <= 0) {

        waterAmount.textContent = waterConsumed + " ml / 0 ml";
        waterPercentage.textContent = "0%";

        waterProgress.style.background =
            "conic-gradient(#4b9cdb 0%, #e8f0f5 0%)";

        document.getElementById("overviewWater").textContent = "0%";

        return; // Stop here because the goal has not been set.
    }

    // Calculate how much of the daily target has been completed.
    const percentage = Math.round(
        (waterConsumed / dailyWaterGoal) * 100
    );

    waterAmount.textContent =
        waterConsumed.toLocaleString() + " ml / " +
        dailyWaterGoal.toLocaleString() + " ml";

    waterPercentage.textContent = percentage + "%";

    // The circle stops visually at 100%, even if consumption goes higher.
    const visualPercentage = Math.min(percentage, 100);

    waterProgress.style.background =
        `conic-gradient(#4b9cdb ${visualPercentage}%, #e8f0f5 ${visualPercentage}%)`;

    // Keep the main dashboard updated with the same percentage.
    document.getElementById("overviewWater").textContent =
        percentage + "%";

    // Give feedback depending on whether the target has been reached.
    if (percentage >= 100) {
        waterMessage.textContent =
            "Your estimated daily goal has been reached!";
    }
    else {
        waterMessage.textContent =
            "Keep tracking your hydration throughout the day.";
    }

}


// Calculate a daily target based on the user's body weight.
setWaterGoal.addEventListener("click", function() {

    const weight = Number(waterWeight.value);

    // Reject empty, zero, negative or unrealistic input values.
    if (!weight || weight <= 0 || weight > 500) {

        waterMessage.textContent = "Please enter a valid weight.";
        return;
    }

    // Use an approximate estimate of 35 ml for each kilogram.
    dailyWaterGoal = Math.round(weight * 35);

    waterGoalDisplay.innerHTML =
        dailyWaterGoal.toLocaleString() + " <span>ml</span>";

    // Save the new target before refreshing the display.
    saveWaterData();
    updateWaterDisplay();

    waterMessage.textContent =
        "Your estimated daily water target is ready!";

});


// Each button stores its own water amount in a data attribute.
// This allows different buttons to use the same event handler.

const waterButtons = document.querySelectorAll(".water-add");

waterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Water cannot be tracked until a daily target exists.
        if (dailyWaterGoal <= 0) {

            waterMessage.textContent =
                "Calculate your water goal first.";

            return;
        }

        // Read the amount directly from the clicked button.
        const amount = Number(button.dataset.amount);

        waterConsumed += amount;

        // Save the new amount and refresh all progress indicators.
        saveWaterData();
        updateWaterDisplay();

    });

});


// Reduce the recorded amount by 250 ml without allowing negative values.
document.getElementById("removeWater").addEventListener("click", function() {

    waterConsumed = Math.max(0, waterConsumed - 250);

    saveWaterData();
    updateWaterDisplay();

});


// Reset only today's consumed water, keeping the daily target.
document.getElementById("resetWater").addEventListener("click", function() {

    waterConsumed = 0;

    saveWaterData();
    updateWaterDisplay();

    waterMessage.textContent = "Today's water intake has been reset.";

});


// ======================================
// 4. INITIALIZE WATER TRACKER
// ======================================

// Restore the saved target when the website loads.
if (dailyWaterGoal > 0) {

    waterGoalDisplay.innerHTML =
        dailyWaterGoal.toLocaleString() + " <span>ml</span>";

}

// If the date changed, save today's reset progress.
if (savedWaterDate !== today) {
    saveWaterData();
}

// Display the correct values immediately without waiting for a button click.
updateWaterDisplay();
