"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Company = require("./company.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

/************************************** create */

// describe("create", function () {
//   let newJob = {
//     companyHandle: "c1",
//     title: "Test",
//     salary: 100,
//     equity: "0.1",
//   };

//   test("works", async function () {
//     let job = await Job.create(newJob);
//     expect(job).toEqual({
//       ...newJob,
//       id: expect.any(Number),
//     });
//   });
// });
/************************************** create */

describe("Create Job", function () {
  const newJob = {
    title: "j1",
    salary: 5000,
    equity: "0.1",
    companyHandle: "c1",
  };

  test("create new job works", async function () {
    const result = await Job.create(newJob);
    expect(result).toEqual(newJob);
  });
});

// CREATE TABLE jobs (
//     id SERIAL PRIMARY KEY,
//     title TEXT NOT NULL,
//     salary INTEGER CHECK (salary >= 0),
//     equity NUMERIC CHECK (equity <= 1.0),
//     company_handle VARCHAR(25) NOT NULL
//       REFERENCES companies ON DELETE CASCADE
//   );

// title: 'j1', salary: 5000, equity: '0.1', companyHandle: 'c1'
