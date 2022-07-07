function editNav() {
  var x = document.getElementById('myTopnav');
  if (x.className === 'topnav') {
    x.className += ' responsive';
  } else {
    x.className = 'topnav';
  }
}

// DOM Elements
const modalbg = document.querySelector('.bground');
const modalBtn = document.querySelectorAll('.modal-btn');
const formData = document.querySelectorAll('.formData');
const closeBtn = document.querySelector('.close');
const [reserveForm] = document.getElementsByName('reserve');
const checkboxInput = document.querySelectorAll('.checkbox-input');
const textControl = document.querySelectorAll('.text-control');

// Variables
const typesObject = getTypeFields(
  'text',
  'email',
  'number',
  'date',
  'radio',
  'checkbox'
);

const emailPattern =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const { text: textElement } = typesObject;

// Functions
const hideInvalidMessage = input => {
  input.parentElement.dataset.errorVisible = false;
  input.parentElement.dataset.error = '';
};

const displayInputValid = (valid, input) => {
  if (valid) {
    input.parentElement.dataset.errorVisible = false;
  } else {
    input.parentElement.dataset.errorVisible = true;
  }
};

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

const assert = (value, errMess, input) => {
  if (!value) {
    input.parentElement.dataset.error = displayErrMess(input.name);
    return false;
  }
  return true;
};

const assertRequired = input => {
  const required = input.hasAttribute('required') ? true : false;
  return assert(
    !required || input.value !== '',
    `${input.name} field can't be empty.`,
    input
  );
};

const assertMinLength = input => {
  const minLength = (input.minLength ?? 0) >= 0 ? input.minLength : 0;
  return assert(
    input.value.length >= minLength,
    `${input.name} field must contain at least ${minLength} characters.`,
    input
  );
};

const assertEmail = input => {
  return assert(
    input.value.match(emailPattern),
    `${input.name} field must contain an email address.`,
    input
  );
};

const assertMinQuantity = input => {
  const min = Number(input.min);
  return assert(
    isNaN(min) || Number(input.value) >= min,
    `${input.name} field can't be smaller than ${min}.`,
    input
  );
};

const assertMaxQuantity = input => {
  const max = Number(input.max);
  return assert(
    isNaN(max) || Number(input.value) <= max,
    `${input.name} field can't be bigger than ${max}.`,
    input
  );
};

const assertRadioChecked = inputArray => {
  const [first] = inputArray;
  const [checkedValue] = Array.from(inputArray).filter(input => input.checked);
  return [
    assert(
      checkedValue !== undefined,
      `One option of ${first.name} field has to be selected.`,
      first
    ),
    checkedValue,
  ];
};

const assertCheckBoxChecked = input => {
  return assert(input.checked, `${input.id} has to be checked.`, input);
};

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
    alert('Merci ! Votre réservation a été reçue.');
    modalbg.style.display = 'none';
  }
};

function getTypeFields(...types) {
  const typesObject = [];
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

// Events Listeners
// launch modal event
modalBtn.forEach(btn => btn.addEventListener('click', launchModal));

// launch modal form
function launchModal() {
  modalbg.style.display = 'block';
}

// close modal form
closeBtn.addEventListener('click', () => {
  modalbg.style.display = 'none';
});

// Submit the form
reserveForm.addEventListener('submit', validate);

// Check a radio / checkbox field
checkboxInput.forEach(input => {
  input.addEventListener('click', event => {
    hideInvalidMessage(input);
  });
});

// Fill a text-control element
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
