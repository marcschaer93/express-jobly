"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

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
    RETURNING title, salary, equity, company_handle AS "companyHandle"   
    `,
      [title, salary, equity, companyHandle]
    );

    let job = result.rows[0];
    console.log("job", job);

    return job;
  }
}

module.exports = Job;

// CREATE TABLE jobs (
//     id SERIAL PRIMARY KEY,
//     title TEXT NOT NULL,
//     salary INTEGER CHECK (salary >= 0),
//     equity NUMERIC CHECK (equity <= 1.0),
//     company_handle VARCHAR(25) NOT NULL
//       REFERENCES companies ON DELETE CASCADE
//   );
