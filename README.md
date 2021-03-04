# CSYE-6225 Spring 2021

## Technology Stack

1. [Node.js](https://nodejs.org/en/docs/)
2. [Express.js](https://expressjs.com/en/starter/installing.html)
3. Database: [MySQL](https://www.npmjs.com/package/mysql)
4. ORM: [Sequelize](https://sequelize.org/)
5. Testing: [mocha](https://mochajs.org/), [chai](https://www.chaijs.com/), [supertest](https://github.com/visionmedia/supertest)
6. User Authorization: [Basic Auth](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)
7. Version Control: Git

## Prerequisites

For development, you will only need Node.js

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can run the following command:

    $ npm install npm -g

## Database Setup

- Open MySQL workbench or MySQL CLI and create a connection using your credentials

Run the following commands to create the required databases:

    CREATE DATABASE csye6225;
    CREATE DATABASE testDB;

## Instructions to install, run and test on local

1. Clone the following git repository: git@github.com:bhatiama/webapp.git
2. Navigate to webapp folder
3. Navigate to `config/congif.js` and set the value of USER and PASSWORD to your MySQL credentials
4. Run command `npm install` to install the required node modules
5. Run command `npm start` to run the application
6. Run command `npm test` to run unit tests

## REST APIs

- ### GET /v1/user/self

  - Request params: No parameters
  - Response: 200 (OK)
  ```
  {
    "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "first_name": "Jane",
    "last_name": "Doe",
    "username": "jane.doe@example.com",
    "account_created": "2016-08-29T09:12:33.001Z",
    "account_updated": "2016-08-29T09:12:33.001Z"
  }
  ```
- ### PUT /v1/user/self
  - Request body: 
  ```
  {
    "first_name": "Jane",
    "last_name": "Doe",
    "password": "skdjfhskdfjhg"
  }
  ```
  - Response: 204 (No Content)

- ### POST /v1/user
  - Request body: 
  ```
  {
    "first_name": "Jane",
    "last_name": "Doe",
    "password": "skdjfhskdfjhg",
    "username": "jane.doe@example.com"
  }
  ```
  - Response: 201 (Created)
  ```
  {
    "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "first_name": "Jane",
    "last_name": "Doe",
    "username": "jane.doe@example.com",
    "account_created": "2016-08-29T09:12:33.001Z",
    "account_updated": "2016-08-29T09:12:33.001Z"
  }
  ```

- ### POST /books
  - Request body: 
  ```
  {
    "title": "Computer Networks",
    "author": "Andrew S. Tanenbaum",
    "isbn": "978-0132126953",
    "published_date": "May, 2020"
  }
  ```
  - Response: 201 (Created)
  ```
  {
    "id": "d6193106-a192-46db-aae9-f151004ee453",
    "title": "Computer Networks",
    "author": "Andrew S. Tanenbaum",
    "isbn": "978-0132126953",
    "published_date": "May, 2020",
    "book_created": "2016-08-29T09:12:33.001Z",
    "user_id": "d290f1ee-6c54-4b01-90e6-d701748f0851"
  }
  ```
- ### DELETE /books/{id}
  - Request param: id 
  ```
    example: d6193106-a192-46db-aae9-f151004ee453
  ```
  - Response: 204 (No Content)


- ### GET /books/{id}
  - Request param: id 
  ```
    example: d6193106-a192-46db-aae9-f151004ee453
  ```
  - Response: 200 (OK)
  ```
  {
    "id": "d6193106-a192-46db-aae9-f151004ee453",
    "title": "Computer Networks",
    "author": "Andrew S. Tanenbaum",
    "isbn": "978-0132126953",
    "published_date": "May, 2020",
    "book_created": "2016-08-29T09:12:33.001Z",
    "user_id": "d290f1ee-6c54-4b01-90e6-d701748f0851"
  }
  ```

- ### GET /books/
  - Request param: No parameters

  - Response: 200 (OK)
  ```
  [
    {
      "id": "d6193106-a192-46db-aae9-f151004ee453",
      "title": "Computer Networks",
      "author": "Andrew S. Tanenbaum",
      "isbn": "978-0132126953",
      "published_date": "May, 2020",
      "book_created": "2016-08-29T09:12:33.001Z",
      "user_id": "d290f1ee-6c54-4b01-90e6-d701748f0851"
    }
  ]
  ```

- ### POST /books/{book_id}/image
  - Request param: book_id* [string($uuid)]

  - Request body: image [string($binary)]

  - Response: 201 (Created)
  ```
  [
    {
      "file_name": "image.jpg",
      "s3_object_name": "ad79de23-6820-482c-8d2b-d513885b0e17/9afdf82d-7e8e-4491-90d3-ff0499bf6afe/image.jpg",
      "file_id": "9afdf82d-7e8e-4491-90d3-ff0499bf6afe",
      "created_date": "2020-08-29T09:12:33.001Z",
      "user_id": "d290f1ee-6c54-4b01-90e6-d701748f0851"
    }
  ]
  ```

- ### DELETE /books/{book_id}/image/{image_id}
  - Request param: book_id* [string($uuid)], image_id* [string($uuid)]

  - Response: 204 (No Content)

