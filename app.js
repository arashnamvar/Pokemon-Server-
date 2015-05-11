var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.urlencoded());
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
 res.render('index');
});

var server = app.listen(8000, function() {
 console.log('listening on port 8000');
});

// GLOBALS


var users = [];


// SOCKETS

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

  	socket.emit("server_response");

  	socket.broadcast.emit("usercreated2client", users);

  	socket.on("movement", function(data) {

	  	var x = parseInt(data[1]);

	  	// Detect if collision,
	  	// if there is, them send message to all IOS devices with both ids 

	  	// IOS CODE: 
	  	// check if the iOS device's ID is equal to one of the messaged ids
	  	// if it is, then start the fight sequence {
	  	// Show both user's, health and levels 
	  	// }
	  	// DO all the attack math on the iOS device and send over what changes to the health (and which ID to change) to server via socket
	  	// START DUEL MUSIC

	  	// interact with pokemon {
	  	// if there is no pokemon with the user, then set interval that gives them one of the random ones we have after 10 seconds
	  	//  BUT if there is a pokemon, then have a fight with a pokemon happnen every 30-60 seconds
	  	// } START FUN MUSIC


	  	for (var i = 0; i < users.length; i++) {
	  		if (users[i].id == x && data[0] == "up") {
	  			users[i].yxord -= 25;
	  		}
	  		if (users[i].id == x && data[0] == "down") {
	  			users[i].yxord += 25;
	  		}
	  		if (users[i].id == x && data[0] == "left") {
	  			users[i].xcord -= 25;
	  		}
	  		if (users[i].id == x && data[0] == "right") {
	  			users[i].xcord += 25;
	  		}

	  		for (var z in users) {
	  			for (var k in users) {
	  				if (users[k].id != users[z].id) {
		  				if(isCollide(users[z].yxord, users[z].xcord, users[k].yxord, users[k].xcord)) {
		  					console.log(users[z].id);
		  					console.log(users[k].id);
		  					var duelids = [users[z].id, users[k].id];
		  					console.log(duelids);
		  					socket.emit("duel", duelids);
		  				}
		  			}
	  			}
	  		}

	  	}
	  	socket.broadcast.emit("usercreated2client", users);
	});

	// USER CONNECTS TO GAME SERVER, CREATE INSTANCE OF USER
  	socket.on("usercreated", function(data) {
  		var one = data[0];
  		var two = data[1];
  		var iOSuser = new User(one,two);
	  	users.push(iOSuser);
	  	console.log("users", users);
	  	socket.broadcast.emit("usercreated2client", users);
	});

	  socket.on("photo", function (data) {
		  console.log("receiving from ios");
		  socket.broadcast.emit("image", data); 
		});
});

// COLISION DETECTION

	function isCollide(ay, ax, by, bx) {
	    return !(
	        ((ay + 20) < (by)) ||
	        (ay > (by + 20)) ||
	        ((ax + 20) < bx) ||
	        (ax > (bx + 20))
	    );
	}


	function User(id, username) {
	  this.id = id;
	  this.image = null;
	  this.username = username;
	  this.health = 100;
	  this.pokemon = null;
	  this.level = 1;
	  this.xcord = Math.floor((Math.random() * 200));
	  this.yxord = Math.floor((Math.random() * 200));
	}

	    // player.x = player.x.clamp(0, CANVAS_WIDTH - player.width);
	    // player.y = player.y.clamp(0, CANVAS_HEIGHT - player.height);