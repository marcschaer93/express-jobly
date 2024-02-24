# Jobly API

## Back End Development with Node.js, Express, and PostgreSQL

The Jobly API is a backend service designed to mimic job searching platforms, providing endpoints for managing companies, jobs, users, and applications. This project serves as a practical exercise to deepen your understanding of Node.js, Express, and PostgreSQL, focusing on their integration and the management of relational data.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Technologies

This project is built with:

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **PostgreSQL**: A powerful, open-source object-relational database system.

### Dependencies

Ensure you have Node.js and PostgreSQL installed on your system. You can download them from their official websites:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)

### Installing

1. **Clone the repository**:

   ```sh
   git clone https://github.com/yourusername/jobly.git
   ```

2. **Navigate to the project directory**:

   ```sh
   cd express-jobly/jobly
   ```

3. **Install dependencies:**:

   ```sh
   npm install
   ```

### Configuring the Database

Create a PostgreSQL database and user for this project and note down the credentials. You'll need to configure your database connection settings accordingly.

1. **Create Database**:

   ```sh
   createdb jobly
   ```

### Executing Program

1. **Set up the database**:

   ```sh
   psql -U [psql username] -d jobly -f data.sql
   ```

2. **Start the server**:

   ```sh
   npm start
   ```

The API server will start running on http://localhost:3001.

### Using the API

Refer to the provided Postman collection for examples of requests you can make to the API.

### Authors

Marc Schaer

Feel free to contact me with any questions or feedback you might have.
