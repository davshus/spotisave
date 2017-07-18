var hash = require('./hash')();
var apigen = require('./api');

var auth = hash.obj;

// TODO: ADD STATE CHECKING

var api = apigen(auth.access_token);

async function test() {
  var info = await api.myInfo();
  var uid = info.id;
  console.log(info);
  var idk = await api.createPlaylist('Test API pls ignore', uid);
  console.log('done!');
  console.log(idk);
}

test();
