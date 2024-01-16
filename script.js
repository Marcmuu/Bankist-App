'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-01-28T09:15:04.904Z',
    '2019-04-01T10:17:24.185Z',
    '2019-05-27T17:01:17.194Z',
    '2019-07-11T23:36:17.929Z',
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-03-08T14:11:59.604Z',
    '2020-03-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-01-25T14:18:46.235Z',
    '2019-02-05T16:33:06.386Z',
    '2019-03-10T14:43:26.374Z',
    '2019-04-25T18:49:59.371Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-02-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};


const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-05-27T17:01:17.194Z',
    '2022-07-11T23:36:17.929Z',
    '2023-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-05-27T17:01:17.194Z',
    '2022-07-11T23:36:17.929Z',
    '2023-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const accounts = [account1, account2, account3, account4];

// Elements
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

const divErrorMessage = document.querySelector('.errorMessage');

const startLogOutTimer = function () {
  // There is always this 1s delay after the app loads and the start of the timer. And also between logins. So let's export the timer callback into its own function, and run it right away
  const tick = function () {
    let minutes = String(parseInt(time / 60, 10)).padStart(2, '0');
    let seconds = String(parseInt(time % 60, 10)).padStart(2, '0');
    // console.log(minutes, seconds);

    // Displaying time in element and clock
    labelTimer.textContent = `${minutes}:${seconds}`;

    // Finish timer
    if (time === 0) {
      // We need to finish the timer, otherwise it will run forever
      clearInterval(timer);

      // We log out the user, which means to fade out the app
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }

    // Subtract 1 second from time for the next iteration
    time--;
  };

  // Setting time to 5 minutes in seconds
  let time = 10 * 60;
  // let time = 10;

  tick();
  const timer = setInterval(tick, 1000);

  // LATER
  return timer;
};

const printWelcome = function (name) {
  const now = new Date();
  const greetings = new Map([
    [[6, 7, 8, 9, 10], 'Good Morning'],
    [[11, 12, 13, 14], 'Good Day'],
    [[15, 16, 17, 18], 'Good Afternoon'],
    [[19, 20, 21, 22], 'Good Evening'],
    [[23, 0, 1, 2, 3, 4, 5], 'Good Night'],
  ]);

  const arr = [...greetings.keys()].find(key => key.includes(now.getHours()));
  const greet = greetings.get(arr);
  labelWelcome.textContent = `${greet}, ${name}!`;
};

const formatMovementDate = function (date, locale) {
  // LEC 12) add locale
  const calcDaysPassed = (date1, date2) =>
    Math.round((date1 - date2) / (60 * 60 * 24 * 1000));
  const now = new Date();
  const daysPassed = calcDaysPassed(now, date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};



const displayMovements = function (acc, sort = false) {
   //to eliminate all the text from the HTML
   containerMovements.innerHTML = ""; 

  // metode slice() ens crea una copia del array movs, aixi no toquem els valors del array movs i podem seguir concatenant metodes
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    let printDate = "";

    if (acc.movementsDates) {
      const date =  new Date(acc.movementsDates[i]);
      // const day = `${date.getDate()}`.padStart(2, 0);
      // // Remember that MONTHS are 0-based!
      // const month = `${date.getMonth() + 1}`.padStart(2, 0);
      // const year = now.getFullYear();
      // const displayDate = `${day}/${month}/${year}`;
      printDate = formatMovementDate(date, acc.locale);
    }

    // Now we can finally use the user's locale and account currency!
    // const formattedMov = new Intl.NumberFormat(account.locale, {
    //   style: 'currency',
    //   currency: account.currency,
    //   // currency: 'USD',
    // }).format(mov);
    const formattedMov = formatCur(movement, acc.locale, acc.currency);

    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__date">${printDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
 
};

// printMovements(account1);

//funcion para añadir a cada account una propiedad username, con el valor de las primeras letras del owner
function createUsernames(accs){
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name=> name[0]).join('');
  })
};
createUsernames(accounts);


//Funcion para añadir el balance de la cuenta y printarlo en pantalla

const calcDisplayBalance = function (account) {
  const balance = account.movements.reduce((accum, cur) => accum + cur, 0);
  currentAccount.balance = balance;
// canviar el signo de € dependiendo del tipo de cuenta
  labelBalance.textContent = formatCur(balance, account.locale, account.currency);
};

//========================================================================================================


//funcion para añadir el resumen de ingresos, despesas y intereses y printarlo en pantalla
const calcDisplaySummary = function(acc){
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
  // console.log(incomes);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outputs = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  // console.log(outputs);
  //Math.abs() serveix per fer el numero absolut, és a dur sense signe 
  labelSumOut.textContent = formatCur(Math.abs(outputs), acc.locale, acc.currency);

  const interest = acc.movements.filter(mov => mov > 0)
    .map(mov => mov * (currentAccount.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr); 
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  
    labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency );
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENT HANDLERS
let currentAccount, timer;

// const now = new Date();
// const day = `${now.getDate()}`.padStart(2, 0);
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const year = now.getFullYear();
// const hour = now.getHours();
// const minute = now.getMinutes();
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;

btnLogin.addEventListener("click", function(ev){
  //prevent form from submitting
  ev.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  //compte activa
  // console.log(currentAccount);

  // ? es per saber si existeix la compte, sino el posem ens retorna un undefined (si la conte que posem al input no existeix)
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // If there is already a timer, then cancel it!
    if (timer) clearInterval(timer);

    // Start 5 minutes timer to log out user automatically)
    timer = startLogOutTimer();


    //Display UI and message
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(" ")[0]}!`;

    // Set current date and time!
    const now = new Date();
    const options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options,
    ).format(now);


    //posem la opacitat i li afegim una transisció
    containerApp.style.opacity = 100;
    containerApp.style.transition = "all 1s";
    //treiem el display del missatge d'error
    divErrorMessage.style.display = "none";

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    //remove the blinking from the input pin
    inputLoginPin.blur();

    //update UI
    updateUI(currentAccount);

  }else{
    containerApp.style.opacity = 0;
    containerApp.style.transition = "all 0s";
    labelWelcome.innerHTML = "Log in to get started";
    divErrorMessage.style.display = "flex";
  }
})


btnTransfer.addEventListener("click", function(ev){
  ev.preventDefault();

  const amount = Math.floor(inputTransferAmount.value);
  const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);

  //Borrar els valors dels input al transferir
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  // console.log(amount);
  // console.log(receiverAccount);

  // receiverAccount  (a soles es per saber si existeix o no), sino podriem transferir a persones que no existeixen
  // l'inrerrogant es fa servir per si el valor no existeix, ens retorna un undefined, aleshores no entra al if
  if(amount > 0 && amount <= currentAccount.balance && receiverAccount && receiverAccount?.username !== currentAccount.username){
    // pop up mensaje correcto 
    console.log("Transfer ok");
    // Efectuar las transferencias
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    // Añadir fecha de las transferencias
    currentAccount.movementsDates.push(new Date());
    receiverAccount.movementsDates.push(new Date());

    //Actualizar datos
    updateUI(currentAccount);

    //Limpiar contador
    clearInterval(timer);
    timer = startLogOutTimer();
  }else{
    // pop up mensaje de error
    console.log("transfer bad")
    //Limpiar el texto de transferencia a..
    inputTransferTo.value = inputTransferAmount.value = '';
  }

});

btnLoan.addEventListener("click", function(ev){
  ev.preventDefault();

  const amount = Math.floor(+inputLoanAmount.value);
  // la  condicio es que nomes es donara els diners si hi ha algun movement de la compte amb el 10% del que demana
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)){
    //add movement
    // crear un alert de correcte de loan
    currentAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date());

    //update UI con delay de 2,5seg
    setTimeout(() => {
      updateUI(currentAccount);
    }, 2500);

    // Limpiar tiempo
    clearInterval(timer);
    timer = startLogOutTimer();

  }else{
    console.log("at least you need to have 10% of the loan amount");
    // crear un alert d'error de loan
  }

  //Limpiar valor de loan
  inputLoanAmount.value = '';
})


btnClose.addEventListener("click", function(ev){
  ev.preventDefault();
 // Number(inputClosePin) o +inputClosePin, sutilitza per passar el valor de text a number.
  if(currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)){
    //returns true or false
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log(index);

    //Delete the account from the array accounts
    //splice canvia el array accounts (ens treura la compte amb el index i nomes eliminara 1 )
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
    containerApp.style.transition = "all 0s";
    labelWelcome.innerHTML = "Log in to get started";
  }else{
    console.log("error")
  }
})

let sorted = false;
btnSort.addEventListener("click", function(ev){
  ev.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted =!sorted;
  
})


function updateUI(account){
  //Display movements
  displayMovements(account);

  //Display balance
  calcDisplayBalance(account);

  //Display summary
  calcDisplaySummary(account);
}





/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


// console.log(movements)
// const deposits = movements.filter(function(movement){
//   return movement > 0;
// });
// console.log(deposits)

// const withdrawals = movements.filter(mov=> mov < 0);

// console.log(withdrawals)


// const balance = movements.reduce(function(acc, movement, i, arr){
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + movement;
// }, 0);
// console.log(balance)


//maximum value
// const max = movements.reduce(function(acc, movement){
//   if(acc > movement){
//     return acc;
//   }else{
//     return movement;
//   }
// }, movements[0]);
// console.log(max);



// const eurToUsd = 1.1;

// const totalDepositsUSD = movements.filter(mov => mov > 0).map(mov => mov * eurToUsd).reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);


// console.log(movements);
// EQUALITY
// console.log(movements.includes(-130));

// SOME : Condition
// // Condition (if there is any value  that (condition) and this return true or false)
// console.log(movements.some(mov => mov === -130));
// const anyDeposits = movements.some(mov => mov > 1500);
// console.log(anyDeposits);

// EVERY
// comprova si tots els moviments son positius
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));



// // FLAT METHOD (default value is 1, but you can do it on more levels)
// const arr = [[1, 2, 3], [4, 5, 6], 7];
// console.log(arr.flat());

// const arrDeep = [[[1,2], 3],[4,[5, 6]], 7, 8];
// console.log(arrDeep.flat());
// console.log(arrDeep.flat(2));

// //without chaining methods
// const accountsMovements = accounts.map(acc => acc.movements);
// console.log(accountsMovements);
// const allMovements = accountsMovements.flat();
// console.log(allMovements);
// const overAllBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBalance);

// //chaining methods
// const overallBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);


// //FLATMAP METHOD (fa el mateix que el map, i al final li afegeix el flat, NOMES FA UN NIVELL DE FLAT)
// const overallBalance2 = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);


// //SORT METHOD (serveix per els strings, pels numeros no va tant bé)
// const owners = ['Jonas', 'Marc', 'Jan', 'Arnau'];
// console.log(owners);
// //method sort() canvia el array original
// console.log(owners.sort());
// console.log(owners);

// //Numbers
// console.log(movements);
// // console.log(movements.sort());


// //ASCENDING ORDER
//   //return < 0, A, B (keep order)
//   // return > 0, A, B (switch order)

// // movements.sort((a, b) => {
// //   if(a > b) return 1;
// //   if(a < b) return -1;
// // });

// movements.sort((a,b) => a - b);

// console.log(movements);

// //DESCENDING ORDER
//     //return < 0, A, B (keep order)
//     // return > 0, A, B (switch order)
//   // movements.sort((a, b) => {
//   //   if(a < b) return 1;
//   //   if(a > b) return -1;
//   // });

//   movements.sort((a,b) => b - a);
//   console.log(movements);


// IF THE ARRAY IS MIXED (STRINGS AND NUMBERS) THE METHOD SORTS DOESN'T WORK



// //FILL METHOD
// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// //empty array + fill()
// const x = new Array(7);
// console.log(x);

// // x.fill(1);
// // x.fill(1, 3);
// x.fill(1, 3, 5);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr)


// // Array.from   (first 0bject, then a function)
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// // (_) s'tilitza quan no utilitzem la variable que s'ha de passar al metode
// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);

//   const movementsUI2 = [...document.querySelectorAll('.movements__value')];
// });



// 100 rolls of dice with a random number between 1 and 6 and its all keep in diceRollsArray
// const diceRollsArray = Array.from({length: 100}, (dice, i) =>{
//   return `Dice Roll number ${i+1}: ${Math.floor(Math.random() * 6) + 1}`;
// })

// console.log(diceRollsArray);









/////////////////////////////////////////////////
//Challenge 1
/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const julia1 = [3, 5, 2, 12, 7];
// const kate1 = [4, 1, 15, 8, 3];


// const julia2 = [9, 16, 6, 8, 3];
// const kate2 = [10, 5, 6, 1, 4];

// function checkDogs(dogsJulia, dogsKate) {
//   const onlyDogsJulia = dogsJulia.slice(1, -2);
//   console.log(dogsJulia);
//   console.log(onlyDogsJulia);

//   const dogs = [...onlyDogsJulia,...dogsKate];
//   console.log(dogs);
//   dogs.forEach(function (dog, i) {
//     if (dog >= 3){
//       console.log(`Dog number ${i+1} is an adult, and is ${dog} years old`);
//     }else{
//       console.log(`Dog number ${i+1} is still a puppy 🐶`);
//     }
//   })
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs(julia2, kate2);

// const eurToUsd = 1.1;
// const movementsUSD = movements.map(mov => mov * eurToUsd);


/////////////////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// function calcAverageHumanAge(ages){
//   const humanAges = ages.map(function(dogAge){
//     if(dogAge <= 2){
//       return 2 * dogAge;
//     }else if(dogAge > 2){
//       return 16 + dogAge * 4;
//     }
//   });
//   console.log(humanAges);
//   const dogsMore18 = humanAges.filter(dogsHumanAge=> dogsHumanAge >= 18)
//   console.log(dogsMore18);
// }

// function calculateAverageHumanAge(ages){
//   console.log(ages);
// }

//bona solucio
// function calcAverageHumanAge(ages){
//   const humanAges = ages.map(dogAge => dogAge <= 2? 2 * dogAge : 16 + dogAge * 4);
//   console.log(humanAges);
  
//   const adults = humanAges.filter(age=> age >= 18)
//   console.log(adults);

//   // const average = adults.reduce((acc, age) => acc + age, 0)/adults.length;
//   const average = adults.reduce((acc, age, i, arr) => acc + age/arr.length, 0);
//   console.log(average);
//   return average;
// }


// // calculateAverageHumanAge();
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// console.log(avg1, avg2);


///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calculateAverageHumanAge = ages => ages.map(dogAge => dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4)
// .filter(adults => adults >= 18)
// .reduce((acc, age, i, arr) => acc + age/arr.length, 0);


// console.log(calculateAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calculateAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
