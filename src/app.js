var hash = require('./hash')();
var apigen = require('./api');

var auth = hash.obj;

// TODO: ADD STATE CHECKING

var api = apigen(auth.access_token);
function generateDWName() {
  var date = new Date();
  date.setDate((date.getDate() - date.getDay()) + 1);
  var month = date.getMonth() + 1, day = date.getDate(), year = date.getFullYear();
  var playlistName = 'DW ' + month + '/' + day + '/' + year.toString().substring(year.toString().length - 2);
  return playlistName;
}
async function exportDW() {
  var userInfo = await api.myInfo();
  var uid = userInfo.id;
  var playlists = await api.myPlaylists();
  var dw = playlists.items.filter(i=>i.owner.id == "spotify" && i.name == "Discover Weekly");
  if (dw.length < 1) {
    console.error("No Discover Weekly was found!");
    return false;
  }
  dw = dw[0];
  var dwTracks = await api.playlistTracks(dw.href);
  var name = generateDWName();
  var createPlaylistRes = await api.createPlaylist(name, uid);
  var addPlaylistRes = await api.addTracksToPlaylist(createPlaylistRes.href, dwTracks.items.map(i=>i.track.uri));
}
// exportDW();
