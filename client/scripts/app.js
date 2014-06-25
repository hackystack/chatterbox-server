var App = {
  // 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
  server: 'http://moderatelygoodchatapp.azurewebsites.net/classes/messages'
};

App.roomList = {};

App.friends = {};

//Initialize, retrieve, refreshes messages, etc... every second
App.init = function(){
  setInterval(function(){
    App.retrieve();
    },1000);
};

$(document).ready(function(){
  App.init();

    // collects inputs messages
  App.inputMessage;
  $('.submitMessage').on('click',function() {
    App.inputMessage = $('#message').val();
    App.post(App.inputMessage);
  });

  // collects room name
  $('#roomSelect').on('change', function() {
    App.roomName = $('#roomSelect').val();
  });

  // creates new room
  $('.submitNewRoom').on('click', function(){
    console.log("test");
    App.roomName = $('#newRoom').val();
    App.post('');
  });

});

//retrieve
App.retrieve = function (){
  $.ajax({
    url: App.server,
    type: 'GET',
    // data: {order: createdAt},
    contentType: 'application/json',
    success: function(data){
      App.forEachChat(data);
    },
    error: function(){
      console.log('ERROR');
    }
  });
};

App.post = function(input){
  var username = window.location.search.slice(10);
  var text = input;

  var message = {
    'username': username,
    'text': text,
    'roomname': App.roomName
  };

  $.ajax({
    url: App.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data){
      console.log('chatterbox: Message sent');
    },
    error: function(data){
      console.error('chatterbox: Failed to send message');
    }
  });
};

App.forEachChat = function(data){
  var storage = {};
  $('.post').remove();
  for (var i = 0; i < data.results.length; i++){
    var chatObject = data.results[i];
    App.getRoomNames(data.results[i]['roomname']);
    if(App.roomName === undefined ||
       chatObject['roomname'] === App.roomName){
      App.display(chatObject);
    }
  }
  App.displayRooms();
};

//get room names function
App.getRoomNames = function(roomName){
  //need to find unique list of names, sort alphabetically
  if(App.roomList[roomName] === undefined){
    App.roomList[roomName] = roomName;
  }
};

//display room list on drop down
App.displayRooms = function(){
  $('option').remove();
  for (var room in App.roomList) {
    var element = $('<option value ='+ room + '>' + room + '</option>');
    $('#roomSelect').append(element);
  }
};

//display function
App.display = function(chatObject){
  // console.log(chatObject)
  if(chatObject['text'] !== undefined){
    var message = chatObject['text'];
    var username = chatObject['username'];
    var time = chatObject['createdAt'];

    var post = $('<li class="post"></li>');
    // var post = $('<li class="post"></li>');

    if(App.friends[chatObject['username']] === undefined){
      var textNode = ('<span>:' + message + '</span>');
    }else{
      var textNode = ('<span>:<b>' + message + '</b></span>');
    }

    post.append('<button type="button" class="addFriend" value='+ username + '>' + username + '</button>' ).append(textNode);
    $('#chats').append(post);
    $('.addFriend').on('click', function(){
      App.friends[$(this).val()] = $(this).val();
      // console.log(App.friends);
    });
  }

};



