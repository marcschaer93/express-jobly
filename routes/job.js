"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const {
  ensureLoggedIn,
  isAdmin,
  correctUserOrAdmin,
} = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Job = require("../models/job");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** POST / { user }  => { user, token }
 *
 * Adds a new job.
 *
 * This returns the newly created job and an authentication token for them:
 *  {job: { title, salary, equity, handleCompany }, token }
 *
 * Authorization required: login & admin
 **/

router.post("/", ensureLoggedIn, isAdmin, async function (req, res, next) {
  try {
    console.log("req-body", req.body);
    let newJob = await Job.create(req.body);
    console.log("Works!!");
    console.log("newJob", newJob);
    return res.status(201).json({ newJob });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
