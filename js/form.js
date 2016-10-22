//MOVE OTHER HANDLES INTO GLOBAL SCOPE
var $paymentMenu = $('#payment');
var $activities = $('.activities input[type="checkbox"]');

var $creditCard = $('#credit-card');
var $paypal =  $creditCard.next();
var $bitcoin = $paypal.next();

var $form = $('form');

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

  // hide color menu if design is not selected
  if (dMenuVal !== 'js puns' && dMenuVal !== 'heart js') {
    $colorMenu.hide();
    $colorMenu.prev().hide();
  } else {
    $colorMenu.show();
    $colorMenu.prev().show();
  }


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

function updateActivities() {
  // remember which event was clicked
  var clickedBox = $(this);
  var eventIndex = $(this).parent().index();
  // grab day and time from event option
  var eventSetting = getEventTime($(this).parent().text()).sort();

  function accumulateTotal() {
    var total = 0;
    $activities.each(function(){
      if($(this).is(':checked')) {
        var text = $(this).parent().text();
        var dollarSignPos = text.indexOf('$');
        var amount = text.slice(dollarSignPos + 1, text.length);
        console.log(amount);
        total += parseInt(amount);
        console.log(total);
      }
    });
    return total;
  }

  function updateTotal() {
    var total = 0;
    var totalString = '$0';
    var $totalLabel = $('<label id="total-cost">Total: $0</label>');

    total = accumulateTotal();
    totalString = 'Total: ' + '$' + total.toString();

    // if total cost text is not present, add it
    if($('#total-cost').length < 1) {
      $('.activities').append($totalLabel);
      // css for total text
      $totalLabel.css('font-family', 'Roboto');
      $totalLabel.css('font-size', '1.25em');
      $totalLabel.css('font-weight', '500');
      $totalLabel.css('color', '#184f68');
      $totalLabel.css('display', 'block');

    }

    // update total string
    $('#total-cost').text(totalString);
  }

  function checkForConflict() {
    var eachEvent = getEventTime($(this).parent().text()).sort();
    // check to see if this box is already checked
    if (clickedBox.is(':checked')) {
      // if not, disable conflicting events
      if (arraysEqual(eventSetting, eachEvent) &&
        eventIndex !== $(this).parent().index()) {
      $(this).prop('disabled', true);
      // also gray out text
      $(this).parent().css('color', 'gray');
    }
  } else {
      // if so, enable conflicting events
      if (arraysEqual(eventSetting, eachEvent) &&
        eventIndex !== $(this).parent().index()) {
        $(this).prop('disabled', false);
        $(this).parent().css('color', 'black');
      }
    }
  }
  $activities.each(checkForConflict);
  updateTotal();
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

function validateJobRole() {

  var $error = $('<label id="title-error">Please enter a job role:</label>');
  $error.css('color', 'darkred');
  $error.css('margin-bottom', '1em');

  if ($('#other-title').length > 0 && $('#other-title').val() === '') {
    console.log('othertitle');
    $('label[for="title"]').after($error);
  } else {
    $('#title-error').remove();
  }
}

function validateShirt() {
  var $error = $('<label id="tshirt-error">Please Select a design.</label>');
  $error.css('color', 'darkred');
  $error.css('margin-bottom', '1em');

  if ($('#design').val() !== 'js puns' && $('#design').val() !== 'heart js') {
    $('#tshirt-error').remove();
    $('.shirt legend').after($error);
  } else {
    $('#tshirt-error').remove();
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

function toInt(char) {
  return parseInt(char);
}

function oddIndexByTwo (cur, index) {
  if ((index + 1) % 2 !== 0) return cur * 2;
  else return cur;
}

function makeUnderTen (digit) {
  if (digit > 9) return (digit - 9);
  else return digit;
}

function addTogether (prev, cur) {
  return prev + cur;
}

// Luhn Algorithm
function ccNumValid(ccNum) {

  if (ccNum.length < 1)
    return false;

  var cardNumber = ccNum.trim().split('').map(toInt);
  var lastDig = cardNumber.pop();

  var testNumber = cardNumber.reverse()
                             .map(oddIndexByTwo)
                             .map(makeUnderTen)
                             .reduce(addTogether);

  if (testNumber % 10 === lastDig) return true;
  else return false;
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

  if (isValid($field.val()) && $field.val() !== '') {
  console.log($field.val());
    $fieldLabel.css('color', 'black');
  } else {
    $fieldLabel.css('color', 'darkred');
  }
}

function validatePayment() {
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

    redIfError($ccNum, ccNumValid);
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
  validateJobRole();
  validateShirt();
  validateActivities();
  validatePayment();
}

function initializePage() {
  $('#name').focus();

  // event handlers
  $('#title').on('change', handleOtherJob);
  $('#design').on('change', handleDesign );

  // don't allow overlapping events
  $activities.on('change', updateActivities);

  initializePayment();

  // payment menu
  $paymentMenu.on('change', handlePaymentOptions);

  // form Validation
  $form.submit(validatePage);

  // disable browser form validation
  $form.attr('novalidate', 'novalidate');

  // hide color menu by default
  $('#color').hide();
  $('#color').prev().hide();
}

initializePage();
