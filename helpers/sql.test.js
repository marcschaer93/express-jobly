const { sqlForPartialUpdate } = require("./sql");

describe("PartialUpdateUsername", () => {
  test("Update firstName - Single Field", () => {
    // Define the data to update
    const dataToUpdate = {
      firstName: "Maarc",
    };

    // Define the mapping from object keys to database columns
    const objectMapping = {
      firstName: "first_name",
    };

    // Call the sqlForPartialUpdate function
    const result = sqlForPartialUpdate(dataToUpdate, objectMapping);

    // Define the expected result
    const expected = {
      setCols: '"first_name"=$1',
      values: ["Maarc"],
    };

    // Assert that the result matches the expected value
    expect(result).toEqual(expected);
  });
});

describe("PartialUpdateUsername", () => {
  test("Update firstName and lastName - Two Fields", () => {
    // Define the data to update
    const dataToUpdate = {
      firstName: "Paul",
      lastName: "Matrix",
    };

    // Define the mapping from object keys to database columns
    const objectMapping = {
      firstName: "first_name",
      lastName: "last_name",
    };

    // Call the sqlForPartialUpdate function
    const result = sqlForPartialUpdate(dataToUpdate, objectMapping);

    // Define the expected result
    const expected = {
      setCols: '"first_name"=$1, "last_name"=$2',
      values: ["Paul", "Matrix"],
    };

    // Assert that the result matches the expected value
    expect(result).toEqual(expected);
  });
});
