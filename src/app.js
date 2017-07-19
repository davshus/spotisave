var hash = require('./hash')();
var apigen = require('./api');
var status = require('./status');
var $ = require('jquery');
var auth = hash.obj;

// TODO: ADD STATE CHECKING
function error(msg) {
  status.stop();
  console.error(msg);
  status._elem.innerHTML = msg;
  $('#dots').css('display', 'none');
  $('.done-background').css('fill', 'rgb(223, 1, 1)').css('opacity', 1);
  $('#done-container').css('display', 'flex');
  $('.error1').addClass('draw');
  $('.error2').addClass('draw');
}
function success(msg) {
  status.stop();
  console.log(msg);
  status._elem.innerHTML = msg;
  $('#dots').css('display', 'none');
  $('.done-background').css('opacity', 1);
  $('#done-container').css('display', 'flex');
  $('.checkmark').addClass('draw');
}
var api = apigen(auth.access_token);
function generateDWName() {
  var date = new Date();
  date.setDate((date.getDate() - date.getDay()) + 1);
  var month = date.getMonth() + 1, day = date.getDate(), year = date.getFullYear();
  var playlistName = 'DW ' + month + '/' + day + '/' + year.toString().substring(year.toString().length - 2);
  return playlistName;
}
async function exportDW() {
  //Check for security state
  if (Storage) {
    if (sessionStorage.spotisaveState != auth.state) {
      return "Our access to your spotify account may have been tampered with.  Aborting due to security concerns. Please try again from the home page.";
    }
  } else {
    console.warn("Storage is not supported in this browser.  Accepting the token as in insecure mode.")
  }
  status.start();
  status.setStatus('Making an awesome playlist...');
  try {
    var userInfo = await api.myInfo();
  } catch (e) {
    console.error(e);
    return "Could not retrieve user info. Try going home and signing in again.";
  }
  var uid = userInfo.id;
  try {
    var playlists = await api.myPlaylists();
  } catch (e) {
    console.error(e);
    return "Could not retrieve playlists. Try going home and signing in again.";
  }
  var dw = playlists.items.filter(i=>i.owner.id == "spotify" && i.name == "Discover Weekly");
  if (dw.length < 1) {
    console.error(e);
    return "No Discover Weekly was found. Try unfollowing it, then following it.";
  }
  dw = dw[0];
  try {
    var dwTracks = await api.playlistTracks(dw.href);
  } catch (e) {
    console.error(e);
    return "Could not get Discover Weekly's tracks.";
  }
  var name = generateDWName();
  try {
    var createPlaylistRes = await api.createPlaylist(name, uid);
  } catch (e) {
    console.error(e);
    return "Could not create a new playlist to back up to.";
  }
  try {
    await api.addTracksToPlaylist(createPlaylistRes.href, dwTracks.items.map(i=>i.track.uri));
  } catch (e) {
    console.error(e);
    return "Could not add tracks to a new playlist.";
  }
  return true;
}
exportDW().then(res => {
  if (res === true) {
    success("Done!");
  } else {
    error(res);
  }
});
