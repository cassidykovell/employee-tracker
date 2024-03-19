const inquirer = require("inquirer");
const mysql = require("mysql2");
const logo = require("asciiart-logo");
require("console.table");

const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "",
      database: "employees_db",
    },
    console.log(`Connected to employees_db database.`)
  );

function start() {
    const logotext = logo({name: "employee database"}).render()
    console.log(logotext)
    inquirer
    .prompt([
      {
        type: "list",
        name: "openingMessage",
        message: "What would you like to do?",
        choices: [
          "viewAllEmployees",
          "viewAllDepartments",
          "viewAllRoles",
          "addADepartment",
          "addARole",
          "addAEmployee",
          "updateEmployee",          
          "quit",
        ],
      },
    ])
    .then ((inquirerResponse) => {
        let choice = inquirerResponse.openingMessage
        switch(choice) {
            case "viewAllEmployees":
                viewAllEmployees();
                break;
              case "viewAllDepartments":
                viewAllDepartments();
                break;
              case "viewAllRoles":
                viewAllRoles();
                break;
              case "addADepartment":
                addADepartment();
                break;
              case "addARole":
                addARole();
                break;
              case "addAEmployee":
                addAEmployee();
                break;
              case "updateEmployee":
                updateEmployee();
                break;       
              case "quit":
                quit();
                break;
              default:
                console.log("somethings wrong with you");
                break;
        }
    })
}

start();