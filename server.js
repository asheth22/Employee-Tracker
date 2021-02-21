const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require('console.table');
const _ = require('underscore-node');
const utils = require('util');
const { type } = require("os");
const { Console } = require("console");
const employeesByManager = []; 
let departments = [];
let dept = []; 
let deptOb = []; 
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
        // dept.push(res[i].dept_name); 
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

async function getAllEmployees() {
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

async function vewEmployeesByManager() {
  return new Promise(function (resolve, reject) {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dept_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.dept_id left join employee e on employee.manager_id = e.id;",   
    function (err, res) {
      if (err) throw err
      for (i = 0; i < res.length; i++) {
        employeesByManager.push(res[i]);
      }   
      resolve(res);  
    })
  })    
}
async function addRole(deparment) { 
  const dept_id = []; 
  for (i = 0; i < departments.length; i++) {
    dept_id.push(deparment[i].dept_id); 
  }
  inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the role you like to add?"
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

async function addRole(dept, deptOb) { 
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
      type: "list",
      message: "Select the Department ID for the role?",
      choices: Object.keys(deptOb), 
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
async function deleteRole(roles) { 
  console.log(roles.title); 
  inquirer.prompt([
      {
        name: "name",
        type: "list",
        message: "Select the role you would like to delete",
      choices: Object.entries(roles),
      }
  ]).then(function (res) {
    console.log("selected role to delete: ", res)
    // const query = connection.query(
    //   "DELETE FROM role WHERE ?",
    //   {
    //     dept_name: res.name
    //   },
    //   function(err, res) {
    //     console.log("Department deleted");
    //     init(); 
    //   }
    // ); 
   
  })
}

// async function vewEmployeeByManager() {
//   connection.query("SELECT employee.id, employee.first_name, employee.last_name, department.dept_name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.dept_id = department.id ORDER BY employee.id;", 
//     function (err, res) {
//       if (err) reject(err)       
//       console.table(res);    
//       // resolve(res);       
//     })
//   }


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
        console.log(_.pluck(departments, 'id')); 
        console.log(deptOb); 

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
        deptOb = Object.values(departments);
        addRole(dept, deptOb);
        break;
      case "Add Employee":
        addEmployee();
        break;      
      case "Delete a Department":
        await getAllDepartments();        
       await deleteDepartment(departments);
        
        break;
      case "Delete a Role":
        await getAllRoles();
        deleteRole(roles);
        break;
      case "Delete an Employe":
        deleteEmployee();
        break;
      case "Update employee's manager":
        updateEmployeeManager();
        break;
      case "View employees by manager":
        await vewEmployeesByManager();
        console.table(employeesByManager);
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
