"use strict";

/** Routes for jobs. */

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
const jobUpdateSchema = require("../schemas/jobUpdate.json");
const jobNewSchema = require("../schemas/jobNew.json");

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
    const validator = jsonschema.validate(req.body, jobNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    console.log("Validator Works!");
    let newJobData = req.body;

    let newJob = await Job.create(newJobData);
    console.log("New Job Data:", newJob); // Debugging line

    return res.status(201).json({ newJob });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { jobs: [ {title, salary, equity, company_handle }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    const jobs = await Job.findAll();

    return res.status(201).json({ jobs });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const jobId = req.params.id;

    const job = await Job.get(jobId);

    return res.status(200).json({ job });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", ensureLoggedIn, isAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", ensureLoggedIn, isAdmin, async function (req, res, next) {
  try {
    const jobId = req.params.id;

    await Job.remove(jobTitle);

    return res.json({ message: `Removed title with id: ${jobId}` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
