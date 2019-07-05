var minutes = ["00","15","30","45"];
var meridian = ["PM", "AM"];
var doc_ids = ['#hour','#minute','#meridian','#place','#address', '#description', '#image'];
var doc_keys = ['time','place','address', 'description', 'image'];

$(document).ready(function(){
  popTimes();
  getMostRecentData();
  $('#change_fhe').click(function(){
    if(!verifyForm()){
      $('.invalid_feedback').css('display', 'block');
      return;
    }
    updateFHE();
  });
});


//populates the time selects
function popTimes() {
  let hour = $('#hour');
  let minute = $('#minute');
  let meridians = $('#meridian');
  for(let i = 1; i < 13; i++){
    i == 7 ? selected = 'selected' : selected = '';
    hour.append("<option hour = " + i  + " id='option_hour' " + selected + ">" + i + "</option>")
  }
  for(let i = 0; i < minutes.length; i++){
    minute.append("<option minute = " + minutes[i] + " id=option_minute>" + minutes[i] + "</option>")
  }
  for(let i = 0; i < meridian.length; i++){
    meridians.append("<option meridian = " + meridian[i] + " id=option_meridian>" + meridian[i] + "</option>")
  }
}

//verifies that all paramters are filled in correctly
function verifyForm(){
  for(let i = 0; i < doc_ids.length-1; i++){
    let item = $(doc_ids[i]);
    let value = $(item).val();
    if(value == undefined || isEmpty(value)){
      return false;
    }
  }
  return true;
}

//updates FHE site on main page
function updateFHE(){
  let json = getInfo();
  post_data = {};
  post_data = json;
  console.log(post_data);
  //post to the admin page and update the tables

  try{
    $.post('/admin/fhe', post_data, function(data, err){
      if(err) console.log(err);
      console.log('success', data);
      data == "OK"
      ? $('.valid_feedback').css('display', 'block')
      : $('.invalid_feedback').css('display','block');
    });
  } catch(e) {
    console.log(e);
  }
}

function getMostRecentData(){
  post_data = {'type' : 'most_recent'};
  console.log(post_data);
  try{
    $.get('/admin/fhe', post_data, function(data, err){
      if(err) console.log(err);
      console.log('success', data);
      for(key in data){
        if(key == 'time') continue;
        id = '#' + key;
        val = data[key];
        $(id).val(val);
      }
    });
  } catch(e) {
    console.log(e);
  }
}

//gets all filled in information
function getInfo(){
  let to_return = {};
  for(let i = 0; i < doc_keys.length-1; i++){
    let param = doc_keys[i];
    if(i == 0){
      to_return[param] = $('#hour').val() + ":" + $('#minute').val() + " " + $('#meridian').val()
    }
    else {
      index = i + 2;
      to_return[param] = $(doc_ids[index]).val();
    }
  }
  console.log(to_return);
  return to_return;
}

//checks if value is empty
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
