var parameters = ['#presiding','#intermediate-hymn','#sacrament_hymn','#opening_hymn','#announcer','#chorister','#pianist','#conducting','#closing_hymn','#invocation','#benediction',]
var leaders = ['#presiding','#announcer','#chorister','#pianist','#conducting', '#benediction'];
var hymns = ['#intermediate-hymn','#sacrament-hymn','#opening-hymn','#closing-hymn'];
var speakers = ['#speaker'];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var day_ends = {
  1:'st',
  2:'nd',
  3:'rd'
}

var program = {};
$(document).ready(function(){

  //date functionality
  let today = new Date();
  let ending = today.getDate() % 10;
  ending in day_ends ? ending = day_ends[ending] : ending = 'th';
  let date = today.getDate() + ending + ' ' + months[today.getMonth()] + ',  ' + today.getFullYear();
  $('#current_date').html(date);

  //update program based on last entry
  getMostRecentProgram();

});

function getMostRecentProgram(){
  $.post('/', function(data, err){
    if(err){
      console.log(err, data);
    }
    console.log(data[0]);
    setProgramValues(data[0]);
  });
}

function setProgramValues(prog){
  for(key in prog){
    if(key == 'speakers'){
      var speakerArray = prog[key].split(" ");
      for(let i = 0; i < speakerArray.length; i++){
        let num = i+1;
        let id = '#speaker' + num;
        console.log(id);
        console.log('changing ' + id + " to " + speakerArray[i]);
        $(id).html(speakerArray[i]);
      }
      continue;
    }
    let selector = "#" + key;
    console.log(selector);
    let value = prog[key];
    if(value != undefined){
      console.log('changing ' + selector + " to " + value);
      $(selector).html(value);
    }
  }
}
