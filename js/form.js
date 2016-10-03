function appendOtherTitle() {
  var $text = $('<label for="other-title">Other title:</label>' +
                 '<input type="text" id="other-title"' +
                 'placeholder="Your Title"></input>');

  $('.container form fieldset').first().append($text);
  console.log('worked');
}

function createValueString(optionVal) {
  var valueString = '[value="' + optionVal + '"]';
  return valueString;
}
function selectWithValue(valueString) {
  var $colorMenu = $('#color');
  $colorMenu.children(createValueString(valueString)).show();
}

function initializePage() {
    $('#name').focus();

    // event handlers
    $('#title').on('change', function () {
      if($('#title').val() === 'other' && $('#other-title').length === 0) {
        appendOtherTitle();
      } else {
        $('[for="other-title"]').remove();
        $('#other-title').remove();
      }
    });

    $('#design').on('change', function () {
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
    });
}

initializePage();
