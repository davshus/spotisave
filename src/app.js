var hash = require('./hash')();
var apigen = require('./api');

var auth = hash.obj;

// TODO: ADD STATE CHECKING

var api = apigen(auth.access_token);

async function test() {
  var info = await api.myInfo();
  console.log(info);
}

test();
