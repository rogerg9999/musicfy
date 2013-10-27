exports.snapshots = function (req, res) {
  var name = req.params.name;
  res.render('snapshots/' + name);
};
