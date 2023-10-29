const { BadRequestError, ExpressError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

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
 *
 * @param {*} queryParams
 * @returns
 */

function createSqlFilterFromQuery(queryParams) {
  const { nameLike, minEmployees, maxEmployees } = queryParams;
  // console.log("queryParams$$", queryParams);

  if (minEmployees !== undefined && isNaN(minEmployees)) {
    throw new ExpressError(
      "Query Parameter 'minEmployees' must be a number!",
      400
    );
  }

  if (maxEmployees !== undefined && isNaN(maxEmployees)) {
    throw new ExpressError(
      "Query Parameter 'maxEmployees' must be a number!",
      400
    );
  }

  // Convert the name to lowercase for case-insensitive search
  const lowerCaseNameLike = nameLike ? nameLike.toLowerCase() : null;

  // Empty Array to store conditions
  let conditions = [];

  if (nameLike) {
    conditions.push(`handle LIKE '%${lowerCaseNameLike}%'`);
  }
  // if (minEmployees !== undefined && minEmployees !== "") {
  //   if (typeof minEmployees === "number") {
  //     conditions.push(`num_employees >= ${minEmployees}`);
  //   } else {
  //     throw new ExpressError(
  //       "Query Parameter 'minEmployees' must be a number!",
  //       404
  //     );
  //   }
  // }

  // if (maxEmployees !== undefined && maxEmployees !== "") {
  //   if (typeof maxEmployees === "number") {
  //     conditions.push(`num_employees <= ${maxEmployees}`);
  //   } else {
  //     throw new ExpressError(
  //       "Query Parameter 'maxEmployees' must be a number!",
  //       404
  //     );
  //   }
  // }

  if (minEmployees !== undefined && minEmployees !== "") {
    conditions.push(`num_employees >= ${minEmployees}`);
  }

  if (maxEmployees !== undefined && maxEmployees !== "") {
    conditions.push(`num_employees <= ${maxEmployees}`);
  }

  // console.log("Conditions - helper", conditions);
  const sqlFilter =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : null;

  return sqlFilter;
}

module.exports = { sqlForPartialUpdate, createSqlFilterFromQuery };
