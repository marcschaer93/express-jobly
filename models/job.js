"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const {
  sqlForPartialUpdate,
  createSqlFilterFromQuery,
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
   * */

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
   * Returns [{ title, salary, equity, company_handle}, ...]
   * */
  // static async findAll() {
  //   const jobsResults = await db.query(`
  //   SELECT  j.id, j.title,
  //           j.equity, j.company_handle AS "companyHandle",
  //           c.name AS "companyName"
  //   FROM jobs AS j
  //   LEFT JOIN companies AS c
  //   ON c.handle = j.company_handle
  //   `);
  //   return jobsResults.rows;
  // }
  static async findAll() {
    const jobsResults = await db.query(`
    SELECT title, salary, equity, company_handle
    FROM jobs
    ORDER by title
    `);
    return jobsResults.rows;
  }

  /** Given a company id return data about company.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
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
