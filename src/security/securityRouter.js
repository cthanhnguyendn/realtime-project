import { Router } from 'express';
import jwt from 'jsonwebtoken';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import passport from './passport';
import config from '../config';

const parseJwtRequest = expressJwt({
  secret: config.auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token,
});
const authenErrorHandle = (err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
};
const securityRouter = Router();

securityRouter.get(
  '/login/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'user_location'],
    session: false,
  }),
);
securityRouter.get(
  '/login/facebook/return',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, config.auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  },
);
securityRouter.post('/login', (req, res, next) => {
  passport.authenticate(
    'local',
    {
      failureRedirect: '/login',
      session: false,
    },
    (err, user, info) => {
      if (err) next();
      if (user) {
        const expiresIn = 60 * 60 * 24 * 180; // 180 days
        const token = jwt.sign(user, config.auth.jwt.secret, { expiresIn });
        res.cookie('id_token', token, {
          maxAge: 1000 * expiresIn,
          httpOnly: true,
        });
        res.send({ message: 'success' });
      } else {
        res.status(401);
        res.send(info);
      }
    },
  )(req, res, next);
});
securityRouter.post('/signup', (req, res, next) => {
  passport.authenticate(
    'local-signup',
    {
      session: false,
    },
    (err, user, info) => {
      if (err) next();
      if (user) {
        const expiresIn = 60 * 60 * 24 * 180; // 180 days
        const token = jwt.sign(user, config.auth.jwt.secret, { expiresIn });
        res.cookie('id_token', token, {
          maxAge: 1000 * expiresIn,
          httpOnly: true,
        });
        res.send({ message: 'success' });
      } else {
        res.status(401);
        res.send(info);
      }
    },
  )(req, res, next);
});

export { securityRouter, parseJwtRequest, authenErrorHandle };
