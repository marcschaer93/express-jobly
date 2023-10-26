const { BadRequestError } = require("../expressError");

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

module.exports = { sqlForPartialUpdate };
