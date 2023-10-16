'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementsDates: [
    '2023-08-01T11:14:00',
    '2023-08-15T08:59:00',
    '2023-09-23T20:20:00',
    '2023-09-28T18:25:00',
    '2023-10-04T15:10:00',
    '2023-10-09T07:15:00',
    '2023-11-11T09:50:00',
    '2023-11-13T12:30:00',
  ],
  cashBackRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementsDates: [
    '2023-08-01T11:14:00',
    '2023-08-15T08:59:00',
    '2023-09-23T20:20:00',
    '2023-09-28T18:25:00',
    '2023-10-04T15:10:00',
    '2023-10-09T07:15:00',
    '2023-11-11T09:50:00',
    '2023-11-13T12:30:00',
  ],
  cashBackRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementsDates: [
    '2023-08-01T11:14:00',
    '2023-08-15T08:59:00',
    '2023-09-23T20:20:00',
    '2023-09-28T18:25:00',
    '2023-10-04T15:10:00',
    '2023-10-09T07:15:00',
    '2023-11-11T09:50:00',
    '2023-11-13T12:30:00',
  ],
  cashBackRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  movementsDates: [
    '2023-08-01T11:14:00',
    '2023-09-23T20:20:00',
    '2023-09-28T18:25:00',
    '2023-10-09T07:15:00',
    '2023-11-11T09:50:00',
    '2023-11-13T12:30:00',
  ],
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
const btnHidden = document.querySelector('.btn_hidden');

/////////////////////////////////////////////////
// Functions

function displayMovements(acc, sort) {
  containerMovements.innerHTML = '';

  let sortedMovements = sort
  ? [...acc.movements].sort((a, b) => a - b) 
  : acc.movements;

  sortedMovements.forEach((move, ind) => {
    let type = move > 0 ? 'deposit' : 'withdrawal';
    let time = new Date(acc.movements[ind]);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          1 ${type}
        </div>
        <div class="movements__date">${displayTime(time)}</div>
        <div class="movements__value">${move}$</div>
      </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function displayBalance(movements) {
  let balance = movements.reduce((acc, element) => acc + element, 0);
  labelBalance.textContent = `${balance}$`;
}

function displaySummary(account) {
  const income = account.movements
    .filter(move => move > 0)
    .reduce((acc, val) => acc + val, 0);

  labelSumIn.textContent = `${income}$`;

  const outCome = account.movements
    .filter(move => move < 0)
    .reduce((acc, val) => acc + val, 0);

  labelSumOut.textContent = `${Math.abs(outCome)}$`;

  const cashback = account.movements
    .filter(move => move > 0)
    .map(move => move * (account.cashBackRate / 100))
    .filter(cash => cash > 1)
    .reduce((acc, val) => acc + val, 0);

  labelSumCashBack.textContent = `${cashback}$`;
}

accounts.forEach(acc => {
  let userName = acc.owner
    .toLowerCase()
    .split(' ')
    .map(el => el[0])
    .join('');

  acc.userName = userName;
});

function updateUI(user) {
  displayMovements(user);
  displayBalance(user.movements);
  displaySummary(user);
}

function displayTime(date) {
  let now = new Date();

  function calcPassedDay(date1, date2) {
    let day = Math.trunc(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

    if (date1.getHours() - date2.getHours() < 0) return ++day;

    return day;
  }

  let passedDay = calcPassedDay(now, date);

  let year = date.getFullYear();
  let month = addZeroBegin(date.getMonth() + 1);
  let day = addZeroBegin(date.getDate());
  let hour = addZeroBegin(date.getHours());
  let minut = addZeroBegin(date.getMinutes());

  if (passedDay == 0) return `Today, ${hour}:${minut}`;
  if (passedDay == 1) return `Yesterday, ${hour}:${minut}`;

  return `${day}/${month}/${year}, ${hour}:${minut}`;
}

function userLogOut() {
  let time = 300;

  let min = Math.trunc(time / 60);
  let sec = time % 60;

  timer = setInterval(() => {
    labelTimer.textContent = `${addZeroBegin(min)}:${addZeroBegin(sec)}`;

    if (sec == 0 && min != 0) {
      min--;
      sec = 60;
    } else if (min == 0 && sec == 0) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';

      clearInterval(timer);
    }

    sec--;
  }, 500);
}

function addZeroBegin(num) {
  return String(num).padStart(2, '0');
}

let currentUser, timer;

btnLogin.addEventListener('click', e => {
  e.preventDefault();

  let user = accounts.find(
    acc => inputLoginUsername.value.toLowerCase() == acc.userName
  );
  modal.style.display = 'none';

  if (!user || inputLognPin.value != user.pin) {
    modal.style.display = 'flex';
    return;
  }

  currentUser = user;

  inputLoginUsername.value = inputLognPin.value = '';

  containerApp.style.opacity = 1;
  labelWelcome.textContent = `Hello ${currentUser.owner.split(' ')[0]}!`;
  labelDate.textContent = displayTime(new Date());

  clearInterval(timer);

  updateUI(currentUser);
  userLogOut();
});

btnHidden.addEventListener('click', () => {
  modal.style.display = 'none';
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  let amount = +inputTransferAmount.value;
  let transferTo = accounts.find(acc => acc.userName == inputTransferTo.value);

  if (!transferTo) {
    alert('User no found');
  } else if (transferTo.userName == currentUser.userName) {
    alert(`you cann't transfer yourself`);
  } else if (amount > parseInt(labelBalance.textContent)) {
    alert(`You have not the amount to transfer`);
  } else {
    currentUser.movements.push(-amount);
    transferTo.movements.push(amount);

    inputTransferTo.value = inputTransferAmount.value = '';

    updateUI(currentUser);
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  let loan = +inputLoanAmount.value;

  let isEnough = currentUser.movements.some(el => el >= loan * 0.1);

  if (!isEnough && loan <= 0) {
    alert('sorry');
    return;
  }
  setTimeout(() => {
    currentUser.movements.push(loan);
    currentUser.movementsDates.push(new Date().toISOString());
    inputLoanAmount.value = '';

    updateUI(currentUser);
  }, 3000);
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  let userName = inputCloseUsername.value;
  let pin = +inputClosePin.value;
  let userIndex = accounts.findIndex(el => el.userName == userName);

  if (
    userIndex == -1 ||
    userName != currentUser.userName ||
    currentUser.pin != pin
  ) {
    alert('Credentials are not correct');
    return;
  }

  accounts.splice(userIndex, 1);
  containerApp.style.opacity = 0;
});

let sort = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();

  sort = !sort;
  displayMovements(currentUser, sort);
});
