var parameters = ['#presiding','#intermediate-hymn','#sacrament-hymn','#opening-hymn','#announcer','#chorister','#pianist','#conducting','#closing-hymn','#benediction','#invocation']
var leaders = ['#presiding','#announcer','#chorister','#pianist','#conducting', '#benediction'];
var hymns = ['#intermediate-hymn','#sacrament-hymn','#opening-hymn','#closing-hymn'];
var speakers = ['#speaker'];
var program = {};
var inOrderParams = ['Presiding','Conducting','Pianist','Chorister','Announcer','Invocation','Benediction','Opening_hymn','Sacrament_hymn','Intermediate_hymn','Closing_hymn',];
var number = $('.form-top').last().attr('number');
$(document).ready(function(){
  loadForm();
  $('body').on('click','#addSpeaker',function(){
    let target = $('.form-top').last();
    let i = $('.form-top').last().attr('number') + 1;
    let id = 'speaker' + i;
    let text = "Speaker";
    let html = "<div class='form-group form-top' number=\'" + i + "\' id=\'form-group" + i + "\'>";
      html += "<label for='a'>" + text + "</label>";
        html += "<div class='form-group' style='display:flex;'>";
        html += "<input type='text' class='form-control' id='"+ id.toLowerCase() +"' placeholder='"+ text +"'>";
        html += "<button type='button' class='btn btn-primary' id='removeSpeaker' number = \'"+ i + "\'>Remove</button>";
        html += '</div>';
    html += "</div>";
    console.log(target);
    $(target).append(html);
  });

  $('body').on('click','#removeSpeaker',function(){
    let num = $('.form-top').last().attr('number');
    console.log(num);
    let id='#form-group' + num;
    $(id).remove();
    $(this).remove();
  });

  $('body').on('click','#submitProgram',function(){
    if(!verifyForm()){
      $('#errorMessage').css('display', 'block');
      return;
    }
    else{
      $('#errorMessage').css('display', 'none');
    }
    let json = {};
    for(let i = 0 ; i < parameters.length; i++)
    {
      let id = parameters[i];
      let value = $(id).val();
      json[id] = value;
    }
    json['#speaker'] = "";
    elements = document.getElementsByClassName('speakerInput');
    for(let i = 0; i < elements.length; i++){
      currentElement = elements[i];
      //console.log(currentElement);
      if(i < elements.length -1){
        json['#speaker'] += currentElement.value + " ";
      }
      else {
        json['#speaker'] += currentElement.value;
      }

    }
    makeChanges(json);
  });
  $('body').on('keyup','#opening-hymn',function(){
    getHymns('#opening-hymn');
  });
  getHymns();
  getMostRecentProgram();
});

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}
function matchesHymnName(hymn_name, entry) {
  return hymn_name.search(entry) != -1;
}
function matchesHymnNumber(hymn_number, entry){
  return hymn_number.search(entry) != -1;
}

function hashCode(p) {
  var hash = 0;
  if(p.length == 0){
    return hash;
  }
  for(var i = 0; i < p.length; i++){
    var char = p.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
  }
  return hash;
};

function getMostRecentProgram(){
  var request = {};
  request['type'] = 'get';
  $.post('/admin', request, function(data, err){
    if(err){
      console.log(err, data);
    }
    console.log(data[0]);
    setProgramValues(data[0]);
    $("#extra-form").append("<div id='additional-speakers'></div><button type='button' id='addSpeaker' class='btn btn-primary'>Add Speaker </button>");
  });
}
function setFastProg() {
  let num = $('.form-top').last().attr('number');
  //remove the speakers section
  for(let i = 1 ; i < num+1; i++){
    let id='#form-group'+i;
    $(id).remove();
  }
  //hide speaker
  $('#addSpeaker').css("display","none");
  //hide intermediate_hymn
  $('#intermediate_hymn').css("display","none");
}

function setNormalProg() {

}
function setProgramValues(prog){
  for(key in prog){
    let selector = "#" + key;
    console.log(selector);
    let value = prog[key];
    if(value != undefined){
      console.log('changing ' + selector + " to " + value);
      $(selector).val(value);
    }
  }
}

function getHymns(target_id) {
  var hymnURL= 'https://cdn.rawgit.com/pseudosavant/LDSHymns/83bdcf9cce634e61f76aa879fb490e2f64b9d768/hymns.json';
  try {
    $.getJSON(hymnURL, function(hymns, err){
      if(err) console.log(err);
      var value = $(target_id).val();
      value = value.toLowerCase();
      let matchingHymns = [];
      for(key in hymns){
        let name = hymns[key]['name'].toLowerCase();
        let number = key;
        if(matchesHymnNumber(number, value) || matchesHymnName(name, value)){
          matchingHymns.push(number + " " + hymns[key]['name']);
        }
      }
      $('#ohautocomplete').html("");
      console.log('matches', matchingHymns.sort());
      matchingHymns = matchingHymns.sort();
      for(let i = 0; i < matchingHymns.length; i++){
        let html = "<option class='ac-entry'>" + matchingHymns[i] + "</option>";
        $('#ohautocomplete').append(html);
      }

    });
  } catch(e) {
    console.log(e);
  }
}
function loadForm(){
  target = $('#extra-form');
  for(let i = 0; i < inOrderParams.length; i++){
    let id = inOrderParams[i];
    let placeholder = inOrderParams[i].toLowerCase();
    placeholder = placeholder.replace("_", " ");
    let text = inOrderParams[i].replace("_", " ");
    let html = "<div class='form-group'>";
    html += "<label for='a'>" + text + "</label>";
    html += "<input type='text' class='form-control' id='"+ id.toLowerCase() +"' placeholder='"+ text +"'>";
    html += "</div>";
    target.append(html);
  }
  for(let i = 1; i < 4; i++){
    let id = 'speaker' + i;
    let text = "Speaker";
    let html = "<div class='form-group form-top' number=\'" + i + "\' id=\'form-group" + i + "\'>";
      html += "<label for='a'>" + text + "</label>";
        html += "<div class='form-group' style='display:flex;'>";
        html += "<input type='text' class='form-control' id='"+ id.toLowerCase() +"' placeholder='"+ text +"'>";
        html += "<button type='button' class='btn btn-primary' id='removeSpeaker' number = \'"+ i + "\'>Remove</button>";
        html += '</div>';
    html += "</div>";
    target.append(html);
  }

}
function setProgram(p){
  program = p;
}

function makeChanges(json){
  //console.log('json', json);
  json['type'] = 'add';
  //console.log(json);
  try{
    $.post('/admin', json, function(data, err){
      if(err) console.log(err);
      console.log('success', data);
    });
  } catch(e) {
    console.log(e);
  }
}

function isEmpty(str){
  b = true;
  if(str == ""){
    return b;
  }
  else {
    for(var i = 0; i < str.length; i++){
      if(str[i] != " "){
        b = false;
      }
    }
  }
  return b;
}

function verifyForm(){
  for(let i = 0; i < parameters.length; i++){
    item = $(parameters[i]);
    let value = $(item).val();
    if(value == undefined || isEmpty(value)){
      return false;
    }
  }
  return true;
}
