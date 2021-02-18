const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Ish@n001",
    database: "employee_trackerdb"
  });

connection.connect(function(err) {
    if (err) throw err
    console.log("Connected as Id" + connection.threadId)
    init();
});

const userAction = () =>
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Please select action from following list:',
          choices: [
            "Add Department",
            "Add Role",
            "Add Employee?",
            "View All Departments",
            "View All Roles",
            "View All Employees",          
            "Delete a Department",
            "Delete a Role",
            "Delete an Employe",
            "Update employee's manager",
            "View employees by manager", 
            "View the total utilized budget of a department",        
            
      ]
    },
  ]);
  function viewAllDepartments() {
    connection.query("SELECT department.id, department.dept_name FROM department ORDER BY department.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      
    })
  }
  function viewAllRoles() {
    connection.query("SELECT role.id, role.title, role.salary FROM role ORDER BY role.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      
    })
}
  
function viewAllEmployees() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name FROM employee ORDER BY employee.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      
    })
  }
async function init() {
    console.log("Employee Tracker Management");
    console.log("******************************************************")
  // calling functions to get user respomses and github info
    try {
        const action = await userAction();   
        console.log("user chose: ", action.action);   
        switch (action.action) {
          case "Add Department":
              addDepartment();
            break;    
          case "Add Role":
              addRole();
            break;
          case "Add Employee":
              addEmployee();
            break;
            case "View All Departments":
                viewAllDepartments();
              break;    
            case "View All Roles":
                viewAllRoles();
              break;
            case "View All Employees":
                viewAllEmployees();
              break;  
            case "Delete a Department":
              deleteDepartment();
            break;    
           case "Delete a Role":
              deleteRole();
            break;
           case "Delete an Employe":
              deleteEmployee();
            break; 
            case "Update employee's manager":
              updateEmployeeManager();
            break;    
           case "View employees by manager":
              viewEmployeeByManager();
            break;
           case "View the total utilized budget of a department":
              viewBudget();
            break; 
            }
        connection.end; 
  }catch(err) {
      console.log(err);    
  }
  
  };
