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

// Variables
const typesObject = getTypeFields(
  'text',
  'email',
  'number',
  'date',
  'radio',
  'checkbox'
);
const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/y;
const { text: textElement } = typesObject;

// Functions
const displayInputValid = (valid, input) => {
  if (valid) {
    console.log(input.value);
  }
};

const assert = (value, errMess, input) => {
  if (!value) {
    console.error(errMess);
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
      checkedValue
    ),
    checkedValue,
  ];
};

const assertCheckBoxChecked = input => {
  return assert(input.checked, `${input.id} has to be checked.`, input);
};

const validate = event => {
  event.preventDefault();
  for (const [key, fields] of Object.entries(typesObject)) {
    switch (key) {
      case 'text':
        fields.forEach(data => {
          const valid = assertRequired(data) && assertMinLength(data);
          displayInputValid(valid, data);
        });
        break;
      case 'email':
        fields.forEach(data => {
          const valid = assertRequired(data) && assertEmail(data);
          displayInputValid(valid, data);
        });
        break;
      case 'number':
        fields.forEach(data => {
          const valid =
            assertRequired(data) &&
            assertMinQuantity(data) &&
            assertMaxQuantity(data);
          displayInputValid(valid, data);
        });
        break;
      case 'date':
        fields.forEach(data => {
          const valid = assertRequired(data);
          displayInputValid(valid, data);
        });
        break;
      case 'radio':
        fields.forEach(data => {
          const [valid, input] = assertRadioChecked(data);
          displayInputValid(valid, input);
        });
        break;
      case 'checkbox':
        fields.forEach(data => {
          const [checkbox1, checkbox2] = Array.from(data);
          const valid = assertCheckBoxChecked(checkbox1);
          displayInputValid(valid, checkbox1);
          displayInputValid(true, checkbox2);
        });
    }
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
