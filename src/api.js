var $ = require('jquery');
module.exports = token => {
  var obj = new Object();
  obj._token = token;
  obj.req = opt => new Promise((resolve, reject) => {
    var tmp = opt;
    tmp.endpoint = !tmp.overrideAutoEndpoint && tmp.endpoint[0] == '/' ? tmp.endpoint.substring(1) : tmp.endpoint;
    tmp.token = tmp.token || obj._token;
    tmp.data = typeof opt.body == 'object' ? JSON.stringify(opt.body) : opt.body;
    if (!tmp.method)
      reject('Missing ajax method.');
    $.ajax({
      url: tmp.overrideAutoEndpoint ? tmp.endpoint : `https://api.spotify.com/v1/${tmp.endpoint}`,
      type: tmp.method,
      headers: {
        'Authorization': `Bearer ${tmp.token}`
      },
      contentType: tmp.contentType,
      dataType: 'json',
      data: tmp.data,
      success: data => resolve(data),
      error: (req, status) => reject(status)

    });
  });
  obj.myInfo = () => obj.req({
    endpoint: '/me',
    method: 'GET'
  });
  obj.myPlaylists = () => obj.req({
    endpoint: '/me/playlists?limit=50',
    method: 'GET'
  });
  obj.playlistTracks = href => obj.req({
    endpoint: href + (href.charAt(href.length - 1) == '/' ? '' : '/') + 'tracks',
    overrideAutoEndpoint: true,
    method: 'GET'
  });
  obj.createPlaylist = (name, id) => obj.req({
    endpoint: `/users/${id}/playlists`,
    method: 'POST',
    contentType: 'application/json',
    body: {
      name: name
    }
  });
  obj.addTracksToPlaylist = (href, uris) => obj.req({
    endpoint: href + (href.charAt(href.length - 1) == '/' ? '' : '/') + 'tracks',
    overrideAutoEndpoint: true,
    method: 'POST',
    contentType: 'application/json',
    body: {
      uris: uris
    }
  });
  return obj;
}
