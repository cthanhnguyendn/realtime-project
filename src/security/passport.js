/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */

import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as LocalStrategy } from 'passport-local';
// import { User, UserLogin, UserClaim, UserProfile } from './data/models';
import config from '../config';
import { UserService } from '../data/service';

/**
 * Sign in with Facebook.
 */
passport.use(
  new FacebookStrategy(
    {
      clientID: config.auth.facebook.id,
      clientSecret: config.auth.facebook.secret,
      callbackURL: '/login/facebook/return',
      profileFields: [
        'displayName',
        'name',
        'email',
        'link',
        'locale',
        'timezone',
      ],
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      /* eslint-disable no-underscore-dangle */
      const loginName = 'facebook';
      const claimType = 'urn:facebook:access_token';
      const fooBar = async () => {
        if (req.user) {
          const userLogin = await UserLogin.findOne({
            attributes: ['name', 'key'],
            where: { name: loginName, key: profile.id },
          });
          if (userLogin) {
            // There is already a Facebook account that belongs to you.
            // Sign in with that account or delete it, then link it with your current account.
            done();
          } else {
            const user = await User.create(
              {
                id: req.user.id,
                email: profile._json.email,
                logins: [{ name: loginName, key: profile.id }],
                claims: [{ type: claimType, value: profile.id }],
                profile: {
                  displayName: profile.displayName,
                  gender: profile._json.gender,
                  picture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
                },
              },
              {
                include: [
                  { model: UserLogin, as: 'logins' },
                  { model: UserClaim, as: 'claims' },
                  { model: UserProfile, as: 'profile' },
                ],
              },
            );
            done(null, {
              id: user.id,
              email: user.email,
            });
          }
        } else {
          const users = await User.findAll({
            attributes: ['id', 'email'],
            where: { '$logins.name$': loginName, '$logins.key$': profile.id },
            include: [
              {
                attributes: ['name', 'key'],
                model: UserLogin,
                as: 'logins',
                required: true,
              },
            ],
          });
          if (users.length) {
            const user = users[0].get({ plain: true });
            done(null, user);
          } else {
            let user = await User.findOne({
              where: { email: profile._json.email },
            });
            if (user) {
              // There is already an account using this email address. Sign in to
              // that account and link it with Facebook manually from Account Settings.
              done(null);
            } else {
              user = await User.create(
                {
                  email: profile._json.email,
                  emailConfirmed: true,
                  logins: [{ name: loginName, key: profile.id }],
                  claims: [{ type: claimType, value: accessToken }],
                  profile: {
                    displayName: profile.displayName,
                    gender: profile._json.gender,
                    picture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
                  },
                },
                {
                  include: [
                    { model: UserLogin, as: 'logins' },
                    { model: UserClaim, as: 'claims' },
                    { model: UserProfile, as: 'profile' },
                  ],
                },
              );
              done(null, {
                id: user.id,
                email: user.email,
              });
            }
          }
        }
      };

      fooBar().catch(done);
    },
  ),
);

passport.use(
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    (req, email, password, done) => {
      UserService.findUserByEmailAndPassword(email, password)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false, {
            message: 'username or password incorrect !',
          });
        })
        .catch(error => {
          console.error(error);
          done(error, false);
        });
    },
  ),
);
passport.use(
  'local-signup',
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    (req, email, password, done) => {
      UserService.findUserByEmailAndPassword(email, password)
        .then(user => {
          if (user) {
            return done(null, false, { message: 'email already taken' });
          }
          return UserService.createUserByEmailAndPassword(
            email,
            password,
          ).then(user => done(null, user));
        })
        .catch(error => {
          console.error(error);
          done(error, false);
        });
    },
  ),
);

export default passport;
