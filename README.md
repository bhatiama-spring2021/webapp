# CSYE-6225 Spring 2021

## Technology Stack
***
1. [Node.js](https://nodejs.org/en/docs/)
2. [Express.js](https://expressjs.com/en/starter/installing.html)
3. Database: [MySQL](https://www.npmjs.com/package/mysql)
4. ORM: [Sequelize](https://sequelize.org/)
4. Version Control: Git

## Prerequisites
***
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

## Installing and Running Instructions
***
1. Clone the following git repository: git@github.com:bhatiama/webapp.git
2. Navigate to webapp folder
3. Run command `npm install` to install the required node modules
4. Run command `npm start` to run the application