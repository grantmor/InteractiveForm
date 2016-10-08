//MOVE OTHER HANDLES INTO GLOBAL SCOPE
var $creditMenu = $('#payment');
var $activities = $('.activities input[type="checkbox"]');

var $creditCard = $('#credit-card');
var $paypal =  $creditCard.next();
var $bitcoin = $paypal.next();


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

  $creditMenu.val('credit card');

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
  console.log(eventSetting, $(this).parent().index());
  $activities.each(checkForConflict);
}

function handlePaymentOptions() {
  switch($creditMenu.val()) {
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

function initializePage() {
  $('#name').focus();

  // event handlers
  $('#title').on('change', handleOtherJob);
  $('#design').on('change', handleDesign );

  // don't allow overlapping events
  $activities.on('change', handleEventConflicts);

  initializePayment();

  // payment menu
  $creditMenu.on('change', handlePaymentOptions);
}

initializePage();
