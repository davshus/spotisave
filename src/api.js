var $ = require('jquery');
module.exports = token => {
  var obj = new Object();
  obj._token = token;
  obj.req = opt => new Promise((resolve, reject) => {
    var tmp = opt;
    tmp.endpoint = tmp.endpoint[0] == '/' ? tmp.endpoint.substring(1) : tmp.endpoint;
    tmp.token = tmp.token || obj._token;
    if (!tmp.method)
      reject('Missing ajax method.');
    $.ajax({
      url: `https://api.spotify.com/v1/${tmp.endpoint}`,
      type: tmp.method,
      date: {
        format: 'json'
      },
      headers: {
        'Authorization': `Bearer ${tmp.token}`
      },
      success: data => resolve(data),
      error: (req, status) => reject(status)
    });
  });
  obj.myInfo = () => obj.req({
    endpoint: '/me',
    method: 'GET'
  });
  return obj;
}
