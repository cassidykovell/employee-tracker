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

function viewAllEmployees() {
    db.query("SELECT  e.id AS employee_id,  e.first_name,  e.last_name,  r.title AS job_title,  d.dep_name AS department,  r.salary,  CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM   employee_list e JOIN   role_list r ON e.role_list_id = r.id JOIN   department_list d ON r.department_list_id = d.id LEFT JOIN   employee_list m ON e.manager_id = m.id;", function(err, res){
        err? console.log(err): console.table(res), start()
    })
}

function viewAllDepartments() {
    db.query("SELECT id AS department_id, dep_name AS department_name FROM department_list;", function(err, res){
        err? console.log(err): console.table(res), start()
    })
}

function viewAllRoles() {
    db.query("SELECT r.id AS role_id,  r.title AS job_title,  r.salary,  d.dep_name AS department_name FROM   role_list r JOIN   department_list d ON r.department_list_id = d.id;", function(err, res){
        err? console.log(err): console.table(res), start()
    })
}

function addADepartment() {
    inquirer.prompt ([
        {
            type: "input",
            name: "addDepartment",
            message: "Enter department title"
        }
    ]) 
    .then ((departmentResponse) => {
        let departmentName = departmentResponse.addDepartment
        db.query (
            "INSERT INTO department_list (dep_name) VALUES (?)", [departmentName], function (err, res) {
                err? console.log(err): viewAllDepartments();
            }
        )
    })
}

function addARole() {
    db.query("SELECT * FROM department_list", function(err, res){
        if(err){
            console.log(err)
            return start()
        }
        const departmentChoice = res.map((department) => ({
            value: department.id, 
            name: department.dep_name,
        }))
        inquirer.prompt([
            {
                type: "input",
                name: "addRole",
                message: "Enter a role",
            },
            {
                type: "input",
                name: "salary",
                message: "How much do they make?",
            },
            {
                type: "list",
                name: "departmentId",
                message: "Which department does this role belong to?",
                choices: departmentChoice,
            }
        ]) 
        .then ((roleResponse) => {
            let roleTitle = roleResponse.addRole; 
            let roleSalary = roleResponse.salary;
            let departmentId = roleResponse.departmentId;
            db.query("INSERT INTO role_list (title, salary, department_list_id) VALUES (?, ?, ?)", [roleTitle, roleSalary, departmentId], function (err, res) {
                err?console.log(err): viewAllRoles()
            })
        })
    })
}

function addAEmployee() {

}

function updateEmployee() {

}

function quit() {
    console.log("Bye!")
    process.exit()
}

start();