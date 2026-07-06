// Mortgage Calculator Logic
// Simple, straightforward - calculates monthly payments and amortization

function calculateMortgage() {
  var homePrice = parseFloat(document.getElementById('homePrice').value) || 0;
  var downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
  var interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
  var loanTerm = parseInt(document.getElementById('loanTerm').value) || 30;
  var propertyTax = parseFloat(document.getElementById('propertyTax').value) || 0;
  var homeInsurance = parseFloat(document.getElementById('homeInsurance').value) || 0;

  if (homePrice <= 0) {
    alert('Please enter a valid home price.');
    return;
  }

  var loanAmount = homePrice - downPayment;

  if (loanAmount <= 0) {
    alert('Down payment cannot be greater than or equal to the home price.');
    return;
  }

  if (interestRate <= 0) {
    alert('Please enter a valid interest rate.');
    return;
  }

  var monthlyRate = interestRate / 100 / 12;
  var numPayments = loanTerm * 12;

  // standard amortization formula
  var monthlyPrincipalInterest = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

  var monthlyTax = propertyTax / 12;
  var monthlyInsurance = homeInsurance / 12;
  var totalMonthly = monthlyPrincipalInterest + monthlyTax + monthlyInsurance;

  var totalInterest = (monthlyPrincipalInterest * numPayments) - loanAmount;
  var totalCost = loanAmount + totalInterest;

  // show results
  document.getElementById('resultSection').classList.remove('hidden');
  document.getElementById('placeholder').classList.add('hidden');

  document.getElementById('monthlyAmount').textContent = '$' + formatNum(totalMonthly);
  document.getElementById('principalInterest').textContent = '$' + formatNum(monthlyPrincipalInterest);
  document.getElementById('monthlyTax').textContent = '$' + formatNum(monthlyTax);
  document.getElementById('monthlyInsurance').textContent = '$' + formatNum(monthlyInsurance);
  document.getElementById('loanAmountDisplay').textContent = '$' + formatNum(loanAmount);
  document.getElementById('totalInterest').textContent = '$' + formatNum(totalInterest);
  document.getElementById('totalCost').textContent = '$' + formatNum(totalCost);

  // generate amortization schedule
  buildAmortTable(loanAmount, monthlyRate, numPayments, monthlyPrincipalInterest);
}

function buildAmortTable(principal, monthlyRate, numPayments, monthlyPayment) {
  var balance = principal;
  var rows = '';
  var totalInterestPaid = 0;

  for (var i = 1; i <= numPayments; i++) {
    var interestPayment = balance * monthlyRate;
    var principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    totalInterestPaid += interestPayment;

    if (balance < 0) balance = 0;

    rows += '<tr>' +
      '<td>' + i + '</td>' +
      '<td>$' + formatNum(monthlyPayment) + '</td>' +
      '<td>$' + formatNum(principalPayment) + '</td>' +
      '<td>$' + formatNum(interestPayment) + '</td>' +
      '<td>$' + formatNum(Math.max(0, balance)) + '</td>' +
      '</tr>';
  }

  document.getElementById('amortBody').innerHTML = rows;

  // show amortization section
  document.getElementById('amortSection').classList.remove('hidden');
}

function formatNum(n) {
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function toggleAmort() {
  var table = document.getElementById('amortTableWrap');
  var btn = document.getElementById('amortBtn');
  if (table.classList.contains('hidden')) {
    table.classList.remove('hidden');
    btn.textContent = 'Hide Schedule';
  } else {
    table.classList.add('hidden');
    btn.textContent = 'Show Full Schedule';
  }
}

function resetForm() {
  document.getElementById('mortgageForm').reset();
  document.getElementById('resultSection').classList.add('hidden');
  document.getElementById('placeholder').classList.remove('hidden');
  document.getElementById('amortSection').classList.add('hidden');
}

// contact form fake submit (no backend needed for static site)
function handleContactForm(e) {
  e.preventDefault();
  document.getElementById('successMsg').style.display = 'block';
  e.target.reset();
}

// run on page load if contact form exists
document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', handleContactForm);
  }
});
