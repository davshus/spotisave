module.exports = (function() {
  var obj = new Object();
  obj._status = "Loading";
  obj._counter = 0;
  obj._elem = document.getElementById('status');
  obj._statGen = () => {
    obj._elem.innerHTML = `${obj._status}${'.'.repeat(obj._counter)}`
    obj._counter++;
    obj._counter = obj._counter % 4;
  };
  obj.setStatus = stat => {
    var tmp = stat;
    if (stat.substring(stat.length - 3) == '...') tmp = stat.substring(0, stat.length - 3)
    obj._status = tmp;
  };
  obj.start = () => obj._interval = setInterval(obj._statGen, 333);
  obj.stop = () => clearInterval(obj._interval);
  return obj;
})();
