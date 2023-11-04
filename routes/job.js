"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureLoggedIn, isAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Job = require("../models/job");
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
    let newJobData = req.body;

    let newJob = await Job.create(newJobData);
    console.log("New Job Data:", newJob);

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
    const queryParams = req.query;
    const filteredJobs = await Job.findFilteredJobs(queryParams);

    if (filteredJobs.length === 0) {
      return res.json({ message: `No Jobs found!` });
    }

    return res.json({ filteredJobs });
  } catch (err) {
    return next(err);
  }
});

/**
 * Retrieve job information by its ID.
 *
 * This route handler fetches details of a specific job based on its ID and returns
 * the job data in a JSON response with a 200 status code.
 */

router.get("/:id", async function (req, res, next) {
  try {
    const jobId = req.params.id;

    const job = await Job.get(jobId);

    return res.status(200).json({ job });
  } catch (err) {
    return next(err);
  }
});

/**
 * Update job information by its ID.
 *
 * This route handler validates and processes updates to job details based on the ID.
 * If the update data is valid, it updates the job and responds with the updated job data.
 */

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

/**
 * Delete a job by its ID.
 *
 * This route handler deletes a job based on its ID. If successful, it responds with a
 * JSON message confirming the removal of the job.
 */

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
