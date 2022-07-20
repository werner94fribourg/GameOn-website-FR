function editNav() {
  var x = document.getElementById('myTopnav');
  if (x.className === 'topnav') {
    x.className += ' responsive';
  } else {
    x.className = 'topnav';
  }
}

/*
 * DOM Elements
 */
const modalbg = document.querySelector('.bground');
const modalBtn = document.querySelectorAll('.modal-btn');
const formData = document.querySelectorAll('.formData');
const closeBtn = document.querySelector('.close');
const [reserveForm] = document.getElementsByName('reserve');
const checkboxInput = document.querySelectorAll('.checkbox-input');
const textControl = document.querySelectorAll('.text-control');
const validMessage = document.querySelector('.valid-message');

/*
 * Variables
 */
// typesObject : object that selects and sort all input fields in the reserve form by its type
// sorting by its type make it easy to loop over the fields and to apply a certain check constraint to a certain type of field
const typesObject = getTypeFields(
  'text',
  'email',
  'number',
  'date',
  'radio',
  'checkbox'
);
//emailPattern : regex used to check if a string corresponds to an email type
const emailPattern =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

/*
 * Helpers functions
 */
// Function used to hide the display of an invalid error message
const hideInvalidMessage = input => {
  input.parentElement.dataset.errorVisible = false;
  input.parentElement.dataset.error = '';
};
//Function used to display the invalid error message
const displayInputValid = (valid, input) => {
  if (valid) {
    input.parentElement.dataset.errorVisible = false;
  } else {
    input.parentElement.dataset.errorVisible = true;
  }
};
// Function used to display an error message based on the field name
const displayErrMess = name => {
  switch (name) {
    case 'first':
      return 'Veuillez rentrer un prénom valide (au moins deux charactères).';
    case 'last':
      return 'Veuillez rentrer un nom valide (au moins deux charactères).';
    case 'email':
      return 'Veuillez rentrer une adresse e-mail valide.';
    case 'quantity':
      return "Veuillez sélectionner un nombre d'évenements valide (entre 0 et 99 inclus).";
    case 'birthdate':
      return 'Veuillez rentrer une date de naissance valide.';
    case 'location':
      return 'Veuillez sélectionner au moins une location existante.';
    case 'conditions':
      return "Veuillez accepter les conditions d'utilisation pour pouvoir procéder à l'inscription.";
  }
};
// Function used to assert if an input is valid by checking a condition and display an error message if it isn't the case
const assert = (condition, input) => {
  if (!condition) {
    input.parentElement.dataset.error = displayErrMess(input.name);
    return false;
  }
  return true;
};
// Function used to check if required input aren't empty
const assertRequired = input => {
  const required = input.hasAttribute('required') ? true : false;
  return assert(!required || input.value !== '', input);
};
// Function used to check if text input has a minLength property and if it respects the setted length
const assertMinLength = input => {
  const minLength = (input.minLength ?? 0) >= 0 ? input.minLength : 0;
  return assert(input.value.length >= minLength, input);
};
// Function used to check if email input follows the e-mail pattern regex
const assertEmail = input => {
  return assert(input.value.match(emailPattern), input);
};
// Function used to check if a number input's value is bigger or equal to the minimal accepted value
const assertMinQuantity = input => {
  const min = Number(input.min);
  return assert(isNaN(min) || Number(input.value) >= min, input);
};
// Function used to check if a number input's value is less or equal to the maximal accepted value
const assertMaxQuantity = input => {
  const max = Number(input.max);
  return assert(isNaN(max) || Number(input.value) <= max, input);
};
// Function used to check if in a list of radio buttons, at least one radio button is selected
const assertRadioChecked = inputArray => {
  const [first] = inputArray;
  const [checkedValue] = Array.from(inputArray).filter(input => input.checked);
  return [assert(checkedValue !== undefined, first), checkedValue];
};
// Function used to check if an input checkbox is checked
const assertCheckBoxChecked = input => {
  return assert(input.checked, input);
};
// Function that retrieves all the child input elements of a .formData div element
function switchInput(type, array) {
  switch (type) {
    case 'radio':
      return array.map(element => element.querySelectorAll('.checkbox-input'));
    case 'checkbox':
      return array.map(element => element.querySelectorAll('.checkbox-input'));
    default:
      return array.map(element => element.querySelector('.text-control'));
  }
}
// Function that retrieves all input DOM elements in the reserve form, filtered by their type field
// types : types that we want to retrieve from the input DOM elements
function getTypeFields(...types) {
  const typesObject = {};
  types.forEach(type => {
    typesObject[type] = switchInput(
      type,
      Array.from(formData).filter(
        field => field.querySelector('input').type === type
      )
    );
  });
  return typesObject;
}

/*
 * Main functions
 */
// Function used to check validation when submitting the form
// It loops over the typesObject array and checks, for each type of field
// if it respects the validation assertion defined for it
// the formValid variable is a variable that is updated through the assertion checking :
// it will be set to false the moment when a first assertion doesn't work and will hold this value
// until the end of the loop
// Once the assertion loop is finished, it will submit and display the validation message
// if all fields were valid and hide the fields of the form
// Otherwise, it will let the form being visible
const validate = event => {
  event.preventDefault();
  let formValid = true;
  for (const [key, fields] of Object.entries(typesObject)) {
    switch (key) {
      case 'text':
        fields.forEach(data => {
          const valid = assertRequired(data) && assertMinLength(data);
          formValid = formValid === false ? formValid : valid;
          displayInputValid(valid, data);
        });
        break;
      case 'email':
        fields.forEach(data => {
          const valid = assertRequired(data) && assertEmail(data);
          formValid = formValid === false ? formValid : valid;
          displayInputValid(valid, data);
        });
        break;
      case 'number':
        fields.forEach(data => {
          const valid =
            assertRequired(data) &&
            assertMinQuantity(data) &&
            assertMaxQuantity(data);
          formValid = formValid === false ? formValid : valid;
          displayInputValid(valid, data);
        });
        break;
      case 'date':
        fields.forEach(data => {
          const valid = assertRequired(data);
          formValid = formValid === false ? formValid : valid;
          displayInputValid(valid, data);
        });
        break;
      case 'radio':
        fields.forEach(data => {
          const [valid, input] = assertRadioChecked(data);
          const displayInput = input === undefined ? data[0] : input;
          formValid = formValid === false ? formValid : valid;
          displayInputValid(valid, displayInput);
        });
        break;
      case 'checkbox':
        fields.forEach(data => {
          const [checkbox1, checkbox2] = Array.from(data);
          const valid = assertCheckBoxChecked(checkbox1);
          formValid = formValid === false ? formValid : valid;
          displayInputValid(valid, checkbox1);
        });
    }
  }
  if (formValid) {
    reserveForm.style.display = 'none';
    validMessage.style.display = 'block';
  }
};
// Function used to display the modal form when it is hidden
// This function is called as a callback function when we click a btn-modal DOM element on the page
function launchModal(event) {
  event.preventDefault();
  modalbg.classList.toggle('active');
}

/*
 * Event listeners
 */
// launch modal event
modalBtn.forEach(btn => btn.addEventListener('click', launchModal));

// close modal form
closeBtn.addEventListener('click', () => {
  modalbg.classList.toggle('active');
  validMessage.style.removeProperty('display');
  reserveForm.style.removeProperty('display');
});

// Submit the form
reserveForm.addEventListener('submit', validate);

// Check a radio / checkbox field : hide its invalid message if checked
checkboxInput.forEach(input => {
  input.addEventListener('click', event => {
    hideInvalidMessage(input);
  });
});

// Fill a text-control element : check if the new input is valid and hide the error message if it's the case
textControl.forEach(input => {
  input.addEventListener('blur', event => {
    if (input.parentElement.dataset.errorVisible === 'true') {
      switch (input.type) {
        case 'text':
          if (assertRequired(input) && assertMinLength(input))
            hideInvalidMessage(input);
          break;
        case 'email':
          if (assertRequired(input) && assertEmail(input))
            hideInvalidMessage(input);
          break;
        case 'number':
          if (
            assertRequired(input) &&
            assertMinQuantity(input) &&
            assertMaxQuantity(input)
          )
            hideInvalidMessage(input);
          break;
        case 'date':
          if (assertRequired(input)) hideInvalidMessage(input);
          break;
      }
    }
  });
});
