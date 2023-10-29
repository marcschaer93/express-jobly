"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /users */

// describe("POST /jobs", function () {
//   test("Add a new Job", async function () {
//     const resp = request(app)
//       .post("/jobs")
//       .send({
//         title: "j1",
//         salary: "111",
//         equity: 0.1,
//         companyHandle: "company1",
//       })
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       newJob: {
//         title: "j1",
//         salary: "111",
//         equity: 0.1,
//         companyHandle: "company1",
//       },
//     });
//   });
// });

/************************************** POST /jobs */

describe("POST /jobs", function () {
  test("ok for admin", async function () {
    const resp = await request(app)
      .post(`/jobs`)
      .send({
        companyHandle: "c1",
        title: "J-new",
        salary: 10,
        equity: "0.2",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      newJob: {
        title: "J-new",
        salary: 10,
        equity: "0.2",
        companyHandle: "c1",
      },
    });
  });
});
