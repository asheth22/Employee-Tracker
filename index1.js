const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require('console.table');
const utils = require('util');
const { type } = require("os");

let departments = [];
let dept = []; 
let roles = [];
let employees = []; 

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Ish@n001",
  database: "employee_trackerdb"
});

connection.connect(function (err) {
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

 
async function getAllDepartments() {
  return new Promise(function (resolve, reject) {
    
  connection.query("SELECT department.id, department.dept_name FROM department ORDER BY department.id;",
    function (err, res) {
      if (err) reject(err)       
      for (i = 0; i < res.length; i++) {
        departments.push(res[i]);
        dept.push(res[i].dept_name); 
      }      
      resolve(res);       
    })
  })  
 
}
async function getAllRoles() {
  return new Promise(function (resolve, reject) {
  connection.query("SELECT role.id, role.title, role.salary FROM role ORDER BY role.id;",
    function (err, res) {
      if (err) throw err      
      for (i = 0; i < res.length; i++) {
        roles.push(res[i]);
      }      
     resolve(res); 
    })
  }) 
  
}

function getAllEmployees() {
  return new Promise(function (resolve, reject) {
  connection.query("SELECT employee.id, employee.first_name, employee.last_name FROM employee ORDER BY employee.id;",
    function (err, res) {
      if (err) throw err
      for (i = 0; i < res.length; i++) {
        employees.push(res[i]);
      }   
      resolve(res);  
    })
  })    
}

async function addDepartment() { 
  inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the Department would you like to add?"
      }
  ]).then(function(res) {
      var query = connection.query(
          "INSERT INTO department SET ? ",
          {
            dept_name: res.name          
          },
          function(err) {
              if (err) throw err
            console.table(res);
            init(); 
          }
      )
  })
}

async function deleteDepartment(departments) { 
  
  let dept = [];
  for (i = 0; i < departments.length; i++) {
    dept.push(departments[i].dept_name);
  }
  inquirer.prompt([
      {
        name: "name",
        type: "list",
        message: "Select the deparment you would like to delete",
        choices: dept
      }
  ]).then(function (res) {
    console.log("selected department to delete: ", res)
    const query = connection.query(
      "DELETE FROM department WHERE ?",
      {
        dept_name: res.name
      },
      function(err, res) {
        console.log("Department deleted");
        init(); 
      }
    ); 
   
  })
}

async function addRole() { 
  inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title of the role you would like to add?"
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary of the role you would like to add?"
    },
    {
      name: "dept_id",
      type: "input",
      message: "What is the dept_id for the role?"
    },
  ]).then(function(res) {
      var query = connection.query(
          "INSERT INTO role SET ? ",
          {
            title: res.title,
            salary: res.salary,
            dept_id: res.dept_id
          },
          function(err) {
              if (err) throw err
            console.table(res);
            init(); 
          }
      )
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
      case "View All Departments":
        await getAllDepartments();
        console.table(departments); 
        let depts = Object.values(departments)
        // console.log(Object.keys(departments));
        // console.log(Object.values(departments)); 
        console.log(depts); 
        break;
      case "View All Roles":
        await getAllRoles();
        console.table(roles); 
        break;
      case "View All Employees":
        await getAllEmployees();
        console.table(employees); 
        break;
      case "Add Department":
        await addDepartment();
        break;
      case "Add Role":
        await getAllDepartments();           
        addRole(departments);
        break;
      case "Add Employee":
        addEmployee();
        break;      
      case "Delete a Department":
        await getAllDepartments();        
       await deleteDepartment(departments);
        
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
  } catch (err) {
    console.log(err);
  }

};
