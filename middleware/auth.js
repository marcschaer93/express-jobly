"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");
const { restart } = require("nodemon");

/**
 * Middleware for JWT authentication.
 * If a valid JWT is provided, it sets the user in res.locals.
 */
*
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/**
 * Middleware to use when they must be logged in.
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Middleware to verify if the user is an admin.
 * If the user is not an admin, it throws an UnauthorizedError.
 */

function isAdmin(req, res, next) {
  try {
    if (!res.locals.user.isAdmin) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Middleware to ensure the request is made by the correct user or an admin.
 * If the user doesn't match or is not an admin, it throws an UnauthorizedError.
 */

function correctUserOrAdmin(req, res, next) {
  try {
    const usernameInRoute = req.params.username;
    const currentUser = res.locals.user;

    if (usernameInRoute === currentUser.username || res.locals.user.isAdmin) {
      return next();
    } else {
      throw new UnauthorizedError();
    }
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  isAdmin,
  correctUserOrAdmin,
};
