var hash = require('./hash')();
var apigen = require('./api');

var auth = hash.obj;

// TODO: ADD STATE CHECKING

var api = apigen(auth.access_token);

async function test() {
  var info = await api.myPlaylists();
  console.log(info);
}

test();
