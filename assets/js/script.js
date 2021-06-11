'use strict';

////////// DATA //////////
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
////////////////////////////////////////////////////////////////////////////////////////////////////

////////// ELEMENTS
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
////////////////////////////////////////////////////////////////////////////////////////////////////


const displayMovements = function (movements) {
  // empty the entire container before adding new movements
  containerMovements.innerHTML = "";

  movements.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${index + 1}. ${type}</div>
      <div class="movements__date">DATE</div>
      <div class="movements__value">${movement}€</div>
    </div>
    `;
    // insert new child element 'html' right after the beginning of the parent element 'containerMovements'
    containerMovements.insertAdjacentHTML("afterbegin", html)
  });
};

////////////////////////////////////////////////////////////////////////////////////////////////////


const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

////////// Convert 1 Euro = 1.22 USD
const eurToUSD = 1.22;
const movementsUSD = movements.map(function (movement) {
  return movement * eurToUSD;
});

const movementsDescriptions = movements.map(function (movement, i) {
  if (movement > 0) {
    return `Movement ${i + 1}: You deposited ${movement}`;
  } else {
    return `Movement ${i + 1}: You withdrew ${Math.abs(movement)}`;
  }
});

////////// Computing Usernames
const createUsernames = function (allAccounts) {
  allAccounts.forEach(function (individualAccount) {
    individualAccount.username = individualAccount.owner.toLowerCase().split(" ").map(function (name) {
      return name[0];
    }).join("");
  });
};
createUsernames(accounts);

////////// Filter out withdrawals to only display deposits
const deposits = movements.filter(function (movement) {
  return movement > 0;
});

////////// Filter out deposits to only display withdrawals
const withdrawals = movements.filter(function (movement) {
  return movement < 0;
});

////////// Reduce add multiple values (deposits and withdrawals) to determine global balance of the account with an initial value of 0
const calcPrintBalance = function (movements) {
  const balance = movements.reduce(function (accumulator, currentValue, i, arr) {
    return accumulator + currentValue;
  }, 0);

  labelBalance.textContent = `${balance} €`
};

////////// Take all the movement deposits - convert them from Euros to Dollars and add them all up in order to view total balance
const totalDepositsUSD = movements
  .filter(function (movement) {
    return movement > 0;
  }).map(function (movement) {
    return movement * eurToUSD;
  }).reduce(function (accumulator, movement) {
    return accumulator + movement;
  }, 0);

////////// Display deposits & withdrawals and interest summary
const calcDisplaySummary = function (account) {

  // display deposits
  const incomes = account.movements.filter(function (movement) {
    return movement > 0;
  }).reduce(function (accumulator, movement) {
    return accumulator + movement
  }, 0);

  labelSumIn.textContent = `${incomes}€`;

  // display withdrawals
  const out = account.movements.filter(function (movement) {
    return movement < 0;
  }).reduce(function (accumulator, movement) {
    return accumulator + movement
  }, 0);

  // remove the negative sign by using the absolute value
  labelSumOut.textContent = `${Math.abs(out)}€`;

  // display interest
  // int = added interest
  const interest = account.movements.filter(function (movement) {
    return movement > 0;
  }).map(function (deposit) {
    return deposit * acccount.interestRate / 100;
  }).filter(function (int) {
    return int >= 1;
  }).reduce(function (accumulator, int) {
    return accumulator + int;
  }, 0);

  labelSumInterest.textContent = `${interest}€`;
};

////////// Event Handler
let currentAccount;

btnLogin.addEventListener("click", function (event) {
  // prevent form from submitting (page reload)
  event.preventDefault();

  currentAccount = accounts.find(function (account) {
    return account.username === inputLoginUsername.value
  });
  console.log(currentAccount);

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    // display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;

    // clear input fields
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur();

    // display movements 
    displayMovements(currentAccount.movements);

    // display balance
    calcPrintBalance(currentAccount.movements);

    // display summary
    calcDisplaySummary(currentAccount.movements);
  }

});