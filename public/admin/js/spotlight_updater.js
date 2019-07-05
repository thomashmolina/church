var spotlights = 1;
$(document).ready(function(){
  loadSpotlights();
  $('#addSpotlight').click(() => {
    spotlights++;
    let html = "";
    html += '<div id=\"spotlight' + spotlights + '\" number=\"' + spotlights + '\">';

      html += '<label for="username">First and Last Name</label>';
      html += '<div class="input-group">';
        html += '<input type="text" id="name" class="form-control" placeholder="First and Last Name" aria-label="First and Last Name" aria-describedby="basic-addon1">';
      html += '</div>';

      html += '<div class="input-group">';
        html += '<label for="image">Link to Image</label><div class="input-group">';
        html += '<input type="text" id ="image_link" class="form-control" placeholder="Image Link" aria-label="image" aria-describedby="basic-addon1">';
      html += '</div>';

      html += '<div class="input-group">';
        html += '<label for="basic-url">Instagram URL</label><div class="input-group mb-3"><div class="input-group">';
        html += '<span class="input-group-text" id="basic-addon3">https://instagram.com/</span>';
        html += '<input type="text" id="instagram_username" placeholder = "username" class="form-control" id="basic-url" aria-describedby="basic-addon3">';
      html += "</div>";

      html += '<button class="btn btn-primary" type="button" id="removeSpotlight" number="'+ spotlights +'">Remove</button>';

    html += '</div>';
    $('#spotlight_form').append(html);
    changeButton();
  });

  $('body').on('click', '#removeSpotlight', (e) => {
    console.log('removing spotlight');
    console.log(e.target.attributes[3].value);
    let spotlight_number = e.target.attributes[3].value;
    let id_to_remove = "#spotlight" + spotlight_number;
    console.log(id_to_remove);
    $(id_to_remove).remove();
    spotlights--;
    spotlights < 0 ? spotlights = 0 : spotlights = spotlights;
    console.log($(this).attr('number'));
    changeButton();
  });

  $('body').on('click', '#submitChangesButton', () => {
    if(!checkForm()){
      return;
    }
    else {
      request = {'what':'add_spotlight', 'content': {}};
      addInfo(request);
      console.log(request);
      changeContent(request);
    }
  });

});

function loadSpotlights() {
  request = {'what':'spotlights'};
  $.get('/admin/spotlight', request, function(data, err){
    if(err) console.log(err);
    console.log('success', data);
    generateSpotlight(data);
  });
}

function changeContent(request){
  $.post('/admin/spotlight', request, function(data, err){
    if(err) console.log(err);
    console.log('success', data);
  });
}

function generateSpotlight(data){
  console.log(data);
  spotlights++;
  let html = "";
  html += '<div id=\"spotlight' + spotlights + '\" number=\"' + spotlights + '\">';
  html += "<div id='errormsg'></div>";
    html += '<label for="username">First and Last Name</label>';
    html += '<div class="input-group">';
      html += '<input type="text" id="name" class="form-control" placeholder="First and Last Name" aria-label="First and Last Name" aria-describedby="basic-addon1"';
      html += 'value=\"' + data["name"] + '\"';
      html += '>';
    html += '</div>';

    html += '<div class="input-group">';
      html += '<label for="image">Image</label>'
      html += '<div class="input-group">';
        html += '<form method="post" enctype="multipary/form-data" action="/upload">'
          html += '<input type="file" id ="image_link" name="file" aria-label="image" aria-describedby="basic-addon1">';
        html += '</form>';
      html += '</div>';
      html += '<small class="text-muted"> For this to work, get a working link to their social media profile, not a link to a file from your computer.</small>';
    html += '</div>';

    html += '<div class="input-group">';
      html += '<label for="basic-url">Social Media</label><div class="input-group mb-3"><div class="input-group">';
      html += '<span class="input-group-text" id="basic-addon3">https://</span>';
      html += '<input type="text" id="social_media" placeholder = "username" class="form-control" id="basic-url" aria-describedby="basic-addon3"';
      html += ' value=\"'+data["insta"]+'\"';
      html += '>';
    html += "</div>";

    html += '<button class="btn btn-primary" type="button" id="removeSpotlight" number="'+ spotlights +'">Remove</button>';

  html += '</div>';
  $('#spotlight_form').append(html);

}

function addInfo(content) {
  names = []
  insta = []
  let item = $('.form-control');
  for(let i = 0; i < item.length; i++){
    let id = item[i].id;
    if(id == 'social_media'){
      insta.push(item[i].value);
    }
    else if(id == 'name'){
      names.push(item[i].value);
    }
  }
  console.log($('#image_link')[0].value);
  content.names = names;
  content.insta = insta;
}

function checkForm(){
  if(spotlights <= 0){
    return false;
  }
  let item = $('.form-control');
  for( let i = 0; i < item.length; i++){
    let value = item[i].value;
    let id = item[i].id;
    if(value=="" && id!='image_link'){
      $("#errormsg").html("");
      let html = "";
      category = id.replace("_", " ");
      html += "<small id='helpMsg' class='text-muted'>";
      html += "You cannot leave the " + category + " empty.";
      html += "</small>";
      $("#errormsg").html(html);
      id = "#" + id;
      return false;
    }
  }
  return true;
}

function changeButton(){
  if(spotlights > 0){
    $('#submitChangesButton').attr('disabled', false);
  }
  else {
    $('#submitChangesButton').attr('disabled', true);
  }
}
