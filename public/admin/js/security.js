

$(document).ready(function(){
  $('#submitButton').click(function(){
    var p = $('#pwd-input').val();
    console.log(p);
    if(p.length == 0){
      return;
    }
    else {
      checkPassword(p);
    }
  });


});
