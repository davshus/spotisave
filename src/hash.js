module.exports = function() {
  var obj = new Object();
  obj.hash = window.location.hash,
  obj.val = obj.hash.substring(1), //Remove #
  obj.toObj = function() {
    var tmp = {};
    var pairs = this.val.split('&').map(i=>i.split('='));
    for (let i of pairs) {
      tmp[i[0]] = i[1];
    }
    return tmp;
  };
  obj.obj = obj.toObj();
  return obj;
};
