'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: "Jonas Schmedtmann",
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    cashBackRate: 1.2,
    pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  cashBackRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  cashBackRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  cashBackRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumCashBack = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.Login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.Login__input__user');
const inputLognPin = document.querySelector('.Login__input__pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const modal = document.querySelector('.hidden');
/////////////////////////////////////////////////
// Functions



function displayMovements(movements){
    containerMovements.innerHTML = '';

    movements.forEach(move =>{
        let type = move > 0 ? 'deposit' : "withdrawal";

        const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            1 ${type}
          </div>
          <div class="movements__date">24/01/2037</div>
          <div class="movements__value">${move}$</div>
        </div>
        `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}

function displayBalance(movements){
    let balance = movements.reduce((acc, element) => acc+element, 0);
    labelBalance.textContent = `${balance}$`;
}

function displaySummary(account){
    const income = account.movements
    .filter(move => move > 0)
    .reduce((acc, val) => acc+val, 0);

    labelSumIn.textContent = `${income}$`

    const outCome = account.movements
      .filter(move => move < 0)
      .reduce((acc, val) => acc + val, 0);

    labelSumOut.textContent = `${Math.abs(outCome)}$`

    const cashback = account.movements
      .filter(move => move > 0)
      .map(move => move * (account.cashBackRate / 100))
      .filter(cash => cash > 1)
      .reduce((acc, val) => acc + val, 0);

    labelSumCashBack.textContent = `${cashback}$`;
}

accounts.forEach((acc)=>{
  let userName = acc.owner
    .toLowerCase()
    .split(' ')
    .map(el => el[0])
    .join('');

  acc.userName = userName
});

let currentUser;

btnLogin.addEventListener('click', (e)=>{
  e.preventDefault();

  let user = accounts.find(acc => inputLoginUsername.value == acc.userName);
 
  console.log(user);

  if(!user || inputLognPin.value != user.pin){
    modal.style.display = 'flex'
    return
  }

  currentUser = user;

  inputLoginUsername.value = inputLognPin.value = '';

  labelWelcome.textContent = `Hello ${currentUser.owner.split(' ')[0]}`
  containerApp.style.opacity = 1

  displayMovements(currentUser.movements);
  displayBalance(currentUser.movements);
  displaySummary(currentUser);
})


displayMovements(account1.movements);
displayBalance(account1.movements);
displaySummary(account1);

const currencies = new Map([
    ["USD", "United States dollor"],
    ["EUR", "Euro"],
    ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];



