//requiring all dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const logo = require("asciiart-logo");
require("console.table");

//creating a connection the the sql
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employees_db",
});

const logotext = logo({ name: "employee database" }).render();
console.log(logotext);

//function for starting the command line tools and provding the main menu for the user to navigate
function start() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "openingMessage",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Departments",
          "View All Roles",
          "Add A Department",
          "Add A Role",
          "Add A Employee",
          "Update Employee",
          "Quit",
        ],
      },
    ])
    .then((inquirerResponse) => {
      let choice = inquirerResponse.openingMessage;
      switch (choice) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "Add A Department":
          addADepartment();
          break;
        case "Add A Role":
          addARole();
          break;
        case "Add A Employee":
          addAEmployee();
          break;
        case "Update Employee":
          updateEmployee();
          break;
        case "Quit":
          quit();
          break;
        default:
          console.log("Something's Wrong");
          break;
      }
    });
}

//function to let the user view all employees
function viewAllEmployees() {
  db.query(
    "SELECT  e.id AS employee_id,  e.first_name,  e.last_name,  r.title AS job_title,  d.dep_name AS department,  r.salary,  CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM   employee_list e JOIN   role_list r ON e.role_list_id = r.id JOIN   department_list d ON r.department_list_id = d.id LEFT JOIN   employee_list m ON e.manager_id = m.id;",
    function (err, res) {
      err ? console.log(err) : console.table(res), start();
    }
  );
}

//function to let the user view all departments
function viewAllDepartments() {
  db.query(
    "SELECT id AS department_id, dep_name AS department_name FROM department_list;",
    function (err, res) {
      err ? console.log(err) : console.table(res), start();
    }
  );
}

//function to let the user view all roles
function viewAllRoles() {
  db.query(
    "SELECT r.id AS role_id,  r.title AS job_title,  r.salary,  d.dep_name AS department_name FROM   role_list r JOIN   department_list d ON r.department_list_id = d.id;",
    function (err, res) {
      err ? console.log(err) : console.table(res), start();
    }
  );
}

//function to let the user add a department to the database
function addADepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        message: "Enter department title.",
      },
    ])
    .then((departmentResponse) => {
      let departmentName = departmentResponse.addDepartment;
      db.query(
        "INSERT INTO department_list (dep_name) VALUES (?)",
        [departmentName],
        function (err, res) {
          err ? console.log(err) : viewAllDepartments();
        }
      );
    });
}

//function to let the user add a role to the data base
function addARole() {
  db.query("SELECT * FROM department_list", function (err, res) {
    if (err) {
      console.log(err);
      return start();
    }
    const departmentChoice = res.map((department) => ({
      value: department.id,
      name: department.dep_name,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "addRole",
          message: "Enter a role.",
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
        },
      ])
      .then((roleResponse) => {
        let roleTitle = roleResponse.addRole;
        let roleSalary = roleResponse.salary;
        let departmentId = roleResponse.departmentId;
        db.query(
          "INSERT INTO role_list (title, salary, department_list_id) VALUES (?, ?, ?)",
          [roleTitle, roleSalary, departmentId],
          function (err, res) {
            err ? console.log(err) : viewAllRoles();
          }
        );
      });
  });
}

//function to let a user add an employee to the database
function addAEmployee() {
  db.query(
    "SELECT employee_list.id, employee_list.first_name, employee_list.last_name, role_list.title FROM employee_list JOIN role_list ON employee_list.role_list_id = role_list.id",
    function (err, res) {
      if (err) {
        console.log(err);
        return start();
      }

      const roleChoice = res.map((employee) => ({
        value: employee.id,
        name: employee.title,
      }));

      const managerChoice = res.map((manager) => ({
        value: manager.id,
        name: `${manager.first_name} ${manager.last_name}`,
      }));

      inquirer
        .prompt([
          {
            type: "input",
            name: "addFirst",
            message: "Enter the new employee's first name.",
          },
          {
            type: "input",
            name: "addLast",
            message: "Enter the new employee's last name.",
          },
          {
            type: "list",
            name: "role",
            message: "Enter the role of this new employee.",
            choices: roleChoice,
          },
          {
            type: "list",
            name: "manager",
            message: "Enter the manager of the new employee.",
            choices: managerChoice,
          },
        ])
        .then((newEmployee) => {
          let firstName = newEmployee.addFirst;
          let lastName = newEmployee.addLast;
          let role = newEmployee.role;
          let manager = newEmployee.manager;

          db.query(
            "INSERT INTO employee_list (first_name, last_name, role_list_id, manager_id) VALUES (?, ?, ?, ?)",
            [firstName, lastName, role, manager],
            function (err, res) {
              if (err) {
                console.log(err);
              } else {
                viewAllEmployees();
              }
            }
          );
        });
    }
  );
}

//functio to let a user update an existing employee to the data base
function updateEmployee() {
  db.query("SELECT * FROM role_list", function (err, roles) {
    if (err) {
      console.log(err);
      return start();
    }

    const roleChoices = roles.map((role) => ({
      value: role.id,
      name: role.title,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "selectedRole",
          message: "Select a role to update employees:",
          choices: roleChoices,
        },
      ])
      .then((selectedRole) => {
        db.query(
          "SELECT * FROM employee_list WHERE role_list_id = ?",
          [selectedRole.selectedRole],
          function (err, employees) {
            if (err) {
              console.log(err);
              return start();
            }

            const employeeChoices = employees.map((employee) => ({
              value: employee.id,
              name: `${employee.first_name} ${employee.last_name}`,
            }));

            inquirer
              .prompt([
                {
                  type: "list",
                  name: "selectedEmployee",
                  message: "Select an employee to update:",
                  choices: employeeChoices,
                },
                {
                  type: "list",
                  name: "newRole",
                  message: "Select the new role for the selected employee:",
                  choices: roleChoices,
                },
              ])
              .then((updateInfo) => {
                db.query(
                  "UPDATE employee_list SET role_list_id = ? WHERE id = ?",
                  [updateInfo.newRole, updateInfo.selectedEmployee],
                  function (err, res) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("Employee role updated successfully.");
                      viewAllEmployees();
                    }
                  }
                );
              });
          }
        );
      });
  });
}

//function for quiting
function quit() {
  console.log("Bye!");
  process.exit();
}

start();
