//MOVE OTHER HANDLES INTO GLOBAL SCOPE
var $paymentMenu = $('#payment');
var $activities = $('.activities input[type="checkbox"]');

var $creditCard = $('#credit-card');
var $paypal =  $creditCard.next();
var $bitcoin = $paypal.next();

var $form = $('form');

// disable browser form validation
$form.attr('novalidate', 'novalidate');


function appendOtherTitle() {
  var $text = $('<label for="other-title">Other title:</label>' +
                 '<input type="text" id="other-title"' +
                 'placeholder="Your Title"></input>');

  $('.container form fieldset').first().append($text);
}

function removeOtherTitle() {
  $('[for="other-title"]').remove();
  $('#other-title').remove();
}

function createValueString(optionVal) {
  var valueString = '[value="' + optionVal + '"]';
  return valueString;
}

function selectWithValue(valueString) {
  var $colorMenu = $('#color');
  $colorMenu.children(createValueString(valueString)).show();
}

function getEventTime(eventText) {
   var tuesday = new RegExp('Tuesday');
   var wednesday = new RegExp('Wednesday');
   var nine = new RegExp('9am');
   var one = new RegExp('1pm');

  var eventTime = [];

  if (eventText.match(tuesday)) eventTime.push('tuesday');
  if (eventText.match(wednesday)) eventTime.push('wednesday');
  if (eventText.match(nine)) eventTime.push('nine');
  if (eventText.match(one)) eventTime.push('one');

  return eventTime;
}

// use reduce?
function arraysEqual(one, two) {
  if (one.length !== two.length) return false;

  for (var i = 0; i < one.length; ++i) {
    if (one[i] !== two[i]) return false;
  }
  return true;
}

function initializePayment() {

  $paymentMenu.val('credit card');

  $paypal.hide();
  $bitcoin.hide();
}

function handleDesign() {
  var dMenuVal = $('#design').val();
  var $colorMenu = $('#color');

  if ( dMenuVal === 'js puns') {
    $colorMenu.children().hide();
    selectWithValue('cornflowerblue');
    selectWithValue('darkslategrey');
    selectWithValue('dimgrey');
    $colorMenu.val('cornflowerblue');
  } else if (dMenuVal === 'heart js') {
    $colorMenu.children().hide();
    selectWithValue('tomato');
    selectWithValue('steelblue');
    selectWithValue('dimgrey');
    $colorMenu.val('tomato');
  } else {
    $colorMenu.children().show();
  }
}

function handleOtherJob() {
  if($('#title').val() === 'other' && $('#other-title').length === 0) {
    appendOtherTitle();
  } else {
    removeOtherTitle();
  }
}

function handleEventConflicts() {
  // remember which event was clicked
  var eventIndex = $(this).parent().index();
  // grab day and time from event option
  var eventSetting = getEventTime($(this).parent().text()).sort();

  function checkForConflict() {
    // if an event overlaps and this isnt the box that was clicked
    var eachEvent = getEventTime($(this).parent().text()).sort();
    if (arraysEqual(eventSetting, eachEvent) &&
        eventIndex !== $(this).parent().index()) {
      $(this).prop('disabled', true);
    }
  }
  $activities.each(checkForConflict);
}

function handlePaymentOptions() {
  switch($paymentMenu.val()) {
    case 'credit card':
      $paypal.hide();
      $bitcoin.hide();
      $creditCard.show();
      break;
    case 'paypal':
      $creditCard.hide();
      $bitcoin.hide();
      $paypal.show();
      break;
    case 'bitcoin':
      $paypal.hide();
      $creditCard.hide();
      $bitcoin.show();
      break;
    default:
      break;
  }
}

// Form Validation
function validateName() {
  var $nameLabel = $('label[for="name"]');
  var errorString = ' (please provide your name)';
  var nameLblText = 'Name:';

  if ($('#name').val() === '') {
    $nameLabel.text(nameLblText + errorString);
    $nameLabel.css('color', 'darkred');
  } else {
    $nameLabel.text('Name:');
    $nameLabel.css('color', 'black');
  }
}

function validateEmail() {
  var $email = $('#mail');
  var $emailLabel = $email.prev();
  var emailLblText= 'Email:';
  var errorString = ' (please provide a valid email address)';
  var email = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

  if (!$email.val().match(email)) {
    $emailLabel.text(emailLblText + errorString);
    $emailLabel.css('color', 'darkred');
  } else {
    $emailLabel.text('Email:');
    $emailLabel.css('color', 'black');
  }

}

function validateActivities() {
  var $errorLabel = $('<label id="activity-error">Please select an Activity</label>');
  var $checkedBoxes = $('.activities input[type="checkbox"]:checked');

  $errorLabel.css('color', 'darkred');
  $errorLabel.css('margin-bottom', '1.5em');

  if ($checkedBoxes.length < 1 && $('#activity-error').length < 1) {
    $('.activities legend:first').after($errorLabel);
  } else if ($checkedBoxes.length > 0){
    $('#activity-error').remove();
  }
}

function ccNumValid(ccNum) {

}

function zipValid(zip) {
  var zipExp = /\b\d{5}\b/;
  if (zipExp.test(zip)) return true;
  else return false;
}

function cvvValid(cvv) {
  var cvvExp = /\b\d{3}\b/;
  if (cvvExp.test(cvv)) return true;
  else return false;
}

// RENAME THIS!!!!!!!!!!!!!!!!!
function redIfError ($field, isValid) {
  var $fieldLabel = $field.prev();

  if (isValid($field.val()))
    $fieldLabel.css('color', 'black');
  else
    $fieldLabel.css('color', 'darkred');
}

function validatePayment() {
  // REPLACE WITH QUERY OF STRING FROM HTML
  var paymentPrompt = "I'm going to pay with: ";
  var paymentError = ' Please select a payment method.';
  var $payLabel = $paymentMenu.siblings('label[for="payment"]');

  var $ccNum = $('#cc-num');
  var $zip = $('#zip');
  var $cvv = $('#cvv');
  var $expMonth = $('#exp-month');
  var $expYear = $('#exp-year');

  // if payment option not selected
  if ($paymentMenu.val() === 'select_method') {
    $payLabel.text(paymentPrompt + paymentError);
    $payLabel.css('color', 'darkred');
  } else {
    // if payment option is selected, remove error
    $payLabel.css('color', 'black');
    $payLabel.text(paymentPrompt);
  }
  // if cc selected, validate cc fields
  if ($paymentMenu.val() === 'credit card') {
    console.log('ccn: ', ccNumValid( $ccNum.val() ));

    redIfError($zip, zipValid);
    redIfError($cvv, cvvValid);

    //month
    //year
  }

}

function validatePage(evt) {
  evt.preventDefault();
  validateName();
  validateEmail();
  validateActivities();
  validatePayment();
}

function initializePage() {
  $('#name').focus();

  // event handlers
  $('#title').on('change', handleOtherJob);
  $('#design').on('change', handleDesign );

  // don't allow overlapping events
  $activities.on('change', handleEventConflicts);

  initializePayment();

  // payment menu
  $paymentMenu.on('change', handlePaymentOptions);

  // form Validation
  $form.submit(validatePage);

}

initializePage();
