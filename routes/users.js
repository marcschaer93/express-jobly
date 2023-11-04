"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const {
  ensureLoggedIn,
  isAdmin,
  correctUserOrAdmin,
} = require("../middleware/auth");
const { BadRequestError, ExpressError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: login
 **/

router.post("/", ensureLoggedIn, isAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: login
 **/

router.get("/", ensureLoggedIn, isAdmin, async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin }
 *
 * Authorization required: login
 **/

router.get(
  "/:username",
  ensureLoggedIn,
  correctUserOrAdmin,
  async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: login
 **/

router.patch(
  "/:username",
  ensureLoggedIn,
  correctUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, userUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const user = await User.update(req.params.username, req.body);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: login
 **/

router.delete(
  "/:username",
  ensureLoggedIn,
  correctUserOrAdmin,
  async function (req, res, next) {
    try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  }
);

/**
 * Apply for a job by its ID for a specific user.
 *
 * This route handler allows a user to apply for a job by providing their username
 * and the job's ID. It checks if the user has already applied for the job and
 * responds with an error message if they have. If not, it applies the user to the job
 * and confirms the application with a JSON response.
 */

router.post(
  "/:username/jobs/:id",
  correctUserOrAdmin,
  async function (req, res, next) {
    try {
      const { username, id } = req.params;

      // Convert 'id' to a number before using includes
      const jobId = parseInt(id, 10);
      const alreadyAppliedJobs = await User.getAppliedJobs(username);
      // Extract job IDs from the array
      const alreadyAppliedJobIds = alreadyAppliedJobs.map((job) => job.id);

      if (alreadyAppliedJobIds.includes(jobId)) {
        throw new ExpressError(`Already Applied for that Job!`);
      }

      await User.applyToJob(req.params);
      return res.json({ applied: id });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
