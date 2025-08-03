const form = document.querySelector(".form");
const amountInput = document.getElementById("amount");
const termInput = document.getElementById("term");
const rateInput = document.getElementById("rate");
const resultText = document.querySelector(".result-p");
const resultDesc = document.querySelector(".text");
const illus = document.querySelector(".illus");

// eventlistener
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Clear previous error
  document
    .querySelectorAll(".error-msg")
    .forEach((el) => (el.textContent = ""));
  document
    .querySelectorAll("input")
    .forEach((input) => input.classList.remove("input-error"));

  document.getElementById("mortgage-type-error").textContent = "";

  document.querySelector(".pounds").style.backgroundColor = "hsl(61, 70%, 52%)";
  document.querySelector(".pounds").style.color = "black";

  // Reset span background color
  document.querySelectorAll(".suffix, .years").forEach((el) => {
    el.style.backgroundColor = "lightblue";
    el.style.color = "black";
  });

  // form submission

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const amount = parseFloat(amountInput.value.replace(/,/g, ""));
  const years = parseInt(termInput.value); //parseInt is for whole numbers
  const rate = parseFloat(rateInput.value); //parseFloat is for decimals (e.g. 3.5%),

  let hasError = false;

  if (!data.amount || isNaN(amount)) {
    showError("amount", "This field is required.");
    hasError = true;
  }

  if (!data.term || isNaN(years)) {
    showError("term", "This field is required.");
    hasError = true;
  }

  if (!data.rate || isNaN(rate)) {
    showError("rate", "This field is required.");
    hasError = true;
  }
  if (hasError) return;

  const selectedType = form.querySelector('input[name="mortgageType"]:checked');

  if (!selectedType) {
    const errorMsg = document.getElementById("mortgage-type-error");
    errorMsg.textContent = "This field is required.";
    return; // prevent the form from continuing
  }

  // Calculations
  const monthlyRate = rate / 100 / 12;
  const totalPayments = years * 12;

  let monthlyRepayment, totalRepayment;

  illus.style.display = "none"; // hide the image
  resultText.textContent = "Your results";
  resultDesc.textContent = resultDesc.textContent =
    "Your results are shown below based on the information you provided. To adjust the results, edit the form and click 'calculate repayments' again.";

  resultText.classList.add("active-result-heading");
  resultDesc.classList.add("active-result-desc");

  document.querySelector(".result-wrapper").style.display = "block";

  const monthlyOutput = document.querySelector(".monthly-output");
  const totalOutput = document.querySelector(".total-output");

  monthlyOutput.style.display = "block";
  totalOutput.style.display = "block";

  if (selectedType.value === "fixed") {
    // Standard repayment mortgage
    if (rate === 0) {
      monthlyRepayment = amount / totalPayments;
      totalRepayment = amount;
    } else {
      monthlyRepayment =
        (amount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -totalPayments));
      totalRepayment = monthlyRepayment * totalPayments;
    }

    monthlyOutput.innerHTML = `Your monthly repayments<br><strong>£${monthlyRepayment.toFixed(
      2
    )}</strong>`;
    totalOutput.innerHTML = `Total you'll repay over the term<br><strong class="total">£${totalRepayment.toFixed(
      2
    )}</strong>`;
  } else if (selectedType.value === "variable") {
    // Interest-only mortgage
    monthlyRepayment = amount * monthlyRate;
    totalRepayment = monthlyRepayment * totalPayments;

    monthlyOutput.innerHTML = `Monthly interest payment: <strong>£${monthlyRepayment.toFixed(
      2
    )}</strong>`;
    totalOutput.innerHTML = `Total interest paid over ${years} years: <strong>£${totalRepayment.toFixed(
      2
    )}</strong>`;
  }
});

const showError = function (fieldId, message) {
  const input = document.getElementById(fieldId);
  const wrapper =
    input.closest(".form-group") || input.parentElement.parentElement;
  const errorSpan = wrapper.querySelector(".error-msg");

  errorSpan.textContent = message;
  input.classList.add("input-error");

  // pounds color

  if (fieldId === "amount") {
    document.querySelector(".pounds").style.backgroundColor = "red";
    document.querySelector(".pounds").style.color = "white";
  }
  // Handle suffix or years span coloring
  const siblingSpan = input.nextElementSibling;
  if (
    siblingSpan &&
    (siblingSpan.classList.contains("suffix") ||
      siblingSpan.classList.contains("years"))
  ) {
    siblingSpan.style.backgroundColor = "red";
    siblingSpan.style.color = "white";
  }
};

const clearBtn = document.getElementById("clear-btn");

clearBtn.addEventListener("click", function (e) {
  e.preventDefault(); // prevent page jump

  form.reset(); // clear all input fields and radio buttons

  // Clear error messages and styles
  document
    .querySelectorAll(".error-msg")
    .forEach((el) => (el.textContent = ""));
  document
    .querySelectorAll("input")
    .forEach((input) => input.classList.remove("input-error"));

  // Reset colored spans
  document.querySelector(".pounds").style.backgroundColor = "hsl(61, 70%, 52%)";
  document.querySelector(".pounds").style.color = "black";
  document.querySelectorAll(".suffix, .years").forEach((el) => {
    el.style.backgroundColor = "lightblue";
    el.style.color = "black";
  });

  // Hide result section and restore empty state
  illus.style.display = "block";
  resultText.textContent = "Results shown here";
  resultText.className = "result-p"; // reset to default class
  resultDesc.textContent =
    "Complete the form and click “calculate repayments” to see what your monthly repayments would be.";
  resultDesc.className = "text";

  // Hide dynamic result wrapper
  document.querySelector(".result-wrapper").style.display = "none";

  // Hide output fields
  document.querySelector(".monthly-output").style.display = "none";
  document.querySelector(".total-output").style.display = "none";
});
