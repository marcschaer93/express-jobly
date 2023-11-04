const { BadRequestError, ExpressError } = require("../expressError");

/**
 * Generate SQL SET clause and values for partial updates.
 *
 * This function takes an object containing data to update and a mapping of keys
 * to their corresponding database column names and returns an object with the
 * SET clause and values suitable for SQL update statements.
 *
 * @param {Object} dataToUpdate - The data to update, where keys are object field names.
 * @param {Object} jsToSql - A mapping of object field names to database column names.
 * @returns {Object} An object with properties:
 *   - setCols: A string containing SQL SET clause with placeholders.
 *   - values: An array of values to be used with placeholders in the SQL query.
 *
 * @throws {BadRequestError} If dataToUpdate is empty.
 *
 * @example
 * const dataToUpdate = { firstName: 'Aliya', age: 32 };
 * const jsToSql = { firstName: 'first_name', age: 'age' };
 * const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
 * // Result:
 * // {
 * //   setCols: '"first_name"=$1, "age"=$2',
 * //   values: ['Aliya', 32]
 * // }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

/**
 * Generate an SQL filter for company queries based on provided parameters.
 *
 * This function creates an SQL filter for querying companies based on parameters
 * like name, minimum employees, and maximum employees.
 *
 * @param {Object} queryParams - Parameters for filtering companies.
 * @returns {string} An SQL filter to be added to the SQL query.
 *
 * @throws {ExpressError} If invalid parameters are provided.
 *
 * @example
 * const queryParams = { nameLike: 'tech', minEmployees: 100, maxEmployees: 500 };
 * const sqlFilter = createSqlFilterForCompany(queryParams);
 * // Result: 'WHERE LOWER(handle) LIKE '%tech%' AND num_employees >= 100 AND num_employees <= 500'
 */

function createSqlFilterForCompany(queryParams) {
  const { nameLike, minEmployees, maxEmployees } = queryParams;
  const conditions = [];

  /**
   * If a filter is provided, it must be a valid number; otherwise, it's ignored.
   */

  if (minEmployees !== undefined) {
    if (!isNaN(minEmployees)) {
      conditions.push(`num_employees >= ${minEmployees}`);
    } else {
      throw new ExpressError(
        `Query Parameter 'minEmployees' must be a number!`,
        400
      );
    }
  }
  if (maxEmployees !== undefined) {
    if (!isNaN(maxEmployees)) {
      conditions.push(`num_employees <= ${maxEmployees}`);
    } else {
      throw new ExpressError(
        `Query Parameter 'maxEmployees' must be a number!`,
        400
      );
    }
  }

  if (nameLike) {
    conditions.push(`LOWER(handle) LIKE '%${nameLike.toLowerCase()}%'`);
  }

  return conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
}

/**
 * Generate an SQL filter for job queries based on provided parameters.
 *
 * This function creates an SQL filter for querying jobs based on parameters like
 * title, minimum salary, and equity.
 *
 * @param {Object} queryParams - Parameters for filtering jobs.
 * @returns {string} An SQL filter to be added to the SQL query.
 *
 * @throws {ExpressError} If invalid parameters are provided.
 *
 * @example
 * const queryParams = { title: 'developer', minSalary: 50000, hasEquity: true };
 * const sqlFilter = createSqlFilterForJob(queryParams);
 * // Result: 'WHERE LOWER(title) LIKE '%developer%' AND salary >= 50000 AND equity IS NOT NULL AND equity > 0'
 */

function createSqlFilterForJob(queryParams) {
  const { title, minSalary, hasEquity } = queryParams;

  const conditions = [];

  /**
   * If a filter is provided, it must be a valid number; otherwise, it's ignored.
   */

  if (minSalary !== undefined) {
    if (!isNaN(minSalary)) {
      conditions.push(`salary >= ${minSalary}`);
    } else {
      throw new ExpressError(
        `Invalid 'minSalary' parameter. It must be a valid number.`,
        400
      );
    }
  }

  if (hasEquity === "true") {
    conditions.push(`equity IS NOT NULL AND equity > 0`);
  }

  if (title) {
    conditions.push(`LOWER(title) LIKE '%${title.toLowerCase()}%'`);
  }

  return conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
}

module.exports = {
  sqlForPartialUpdate,
  createSqlFilterForCompany,
  createSqlFilterForJob,
};
