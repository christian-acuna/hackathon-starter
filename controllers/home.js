/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

exports.phantom = (req, res) => {
  res.render('phantom', {
    title: 'Phantom HTML',
  });
};
