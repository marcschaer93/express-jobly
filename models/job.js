"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const {
  sqlForPartialUpdate,
  createSqlFilterForJob,
} = require("../helpers/sql");

/** Related functions for jobs. */
class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, company_handle }
   *
   * Returns { title, salary, equity, company_handle }
   *
   * Throws BadRequestError if job already in database.
   */
  static async create({ title, salary, equity, companyHandle }) {
    const result = await db.query(
      `
    INSERT INTO jobs (title, salary, equity, company_handle)
    VALUES ($1, $2, $3, $4)
    RETURNING title, salary, equity, company_handle AS "companyHandle", id   
    `,
      [title, salary, equity, companyHandle]
    );

    let job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   *
   * Returns an array of job objects: [{ title, salary, equity, company_handle }, ...]
   */
  static async findAll() {
    const jobsResults = await db.query(`
    SELECT title, salary, equity, company_handle
    FROM jobs
    ORDER by title
    `);
    console.log("jobsResults.rows", jobsResults.rows);
    return jobsResults.rows;
  }
  /**
   * Retrieve filtered job data based on query parameters.
   *
   * This function generates an SQL filter using query parameters. If no parameters
   * are provided, the filter is set to null. It fetches job data, applies the filter
   * if available, and sorts the results by job title.
   *
   * @param {Object} queryParams - Parameters for filtering job data.
   * @returns {Array} An array of filtered job objects.
   */

  static async findFilteredJobs(queryParams) {
    const sqlFilter = await createSqlFilterForJob(queryParams);

    let query = `
      SELECT 
        j.id, j.title, j.salary,
        j.equity, j.company_handle AS "companyHandle",
        c.name AS "companyName"
      FROM jobs AS J
      LEFT JOIN companies AS c 
      ON c.handle = j.company_handle
    `;
    if (sqlFilter) {
      query += sqlFilter;
    }
    query += ` ORDER by title`;

    const jobResults = await db.query(query);
    return jobResults.rows;
  }

  /** Given a job ID, return data about the job.
   *
   * Returns a job object { id, title, salary, equity, companyHandle }
   *
   * Throws NotFoundError if the job with the specified ID is not found.
   **/
  static async get(id) {
    const jobResult = await db.query(
      `
      SELECT id, title, salary, equity, company_handle
      FROM jobs
      WHERE id=$1
      `,
      [id]
    );

    const job = jobResult.rows[0];
    if (!job) throw new NotFoundError(`No job with id: ${id} found!`);

    return job;
  }

  /** Update a job with specified data.
   *
   * Returns the updated job object { id, title, salary, equity, companyHandle }
   *
   * Throws NotFoundError if the job with the specified ID is not found.
   **/
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity,
                                company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /** Remove a job by ID.
   *
   * Returns the removed job's title.
   *
   * Throws NotFoundError if the job with the specified ID is not found.
   **/
  static async remove(id) {
    const result = await db.query(
      `
    DELETE 
    FROM jobs
    WHERE id=$1
    RETURNING title
    `,
      [id]
    );

    const job = result.rows[0];
    if (!job) throw new NotFoundError(`No job with id: ${id} found!`);
  }
}

module.exports = Job;
