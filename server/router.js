const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false }); // any route with this uses authentication
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  // app.get('/', requireAuth, (req, res) => {
  //   res.send({ message: req.user._id });
  // });
  app.get('/', requireAuth, Authentication.feature);
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
}
