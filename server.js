// npm packes required 
const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require('console.table');
const utils = require('util');

// Global variable to hold data from the tables
let employeesByManager = [];
let departments = [];
let roles = [];
let employees = [];

// Connecting to employer tracker DB
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
// Prompt for user action 
const userAction = () =>
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Please select action from following list:',
      loop: false,
      choices: [
        "Add Department",
        "Add Role",
        "Add Employee",
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Delete a Department",
        "Delete a Role",
        "Delete an Employee",
        "View employees by manager",
        "Update employee's role",
        "Update employee's manager",
        "View the total utilized budget of a department",
      ]
    },
  ]);

// Function creates an array of single propperty from an object
function pluck(ArrayOb, prop) {

  const ArrayObVal = Object.values(ArrayOb);
  // const numProp = ArrayObVal[0].length    
  const newArray = [];
  ArrayObVal.forEach(element => newArray.push(element[prop]));

  return newArray
}
// Get all Departments from department table
async function getAllDepartments() {
  return new Promise(function (resolve, reject) {

    connection.query("SELECT department.id, department.dept_name FROM department ORDER BY department.id;",
      function (err, res) {
        if (err) reject(err)
        for (i = 0; i < res.length; i++) {
          departments.push(res[i]);
        }
        resolve(res);
      })
  })

}
// Get all Roles from role table
async function getAllRoles() {

  return new Promise(function (resolve, reject) {
    connection.query("SELECT role.id, role.title, role.salary, role.dept_id FROM role ORDER BY role.id;",
      function (err, res) {
        if (err) throw err

        for (i = 0; i < res.length; i++) {
          roles.push(res[i]);
        }
        resolve(res);
      })

  })

}
// Get all employees from employee table
async function getAllEmployees() {
  return new Promise(function (resolve, reject) {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dept_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.dept_id left join employee e on employee.manager_id = e.id ORDER BY employee.id",
      function (err, res) {
        if (err) throw err
        for (i = 0; i < res.length; i++) {
          employees.push(res[i]);
        }
        resolve(res);
      })
  })
}

// Function to add department
async function addDepartment() {
  return new Promise(function (resolve, reject) {
    inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the Department would you like to add?"
      }
    ]).then(function (res) {
      var query = connection.query(
        "INSERT INTO department SET ? ",
        {
          dept_name: res.name
        },
        function (err) {
          if (err) throw err
          console.table(res);
          init();
        }
      )
    })
  })
}
// Function to delete department
async function deleteDepartment(departments) {
  return new Promise(function (resolve, reject) {
    let dept = pluck(departments, 'dept_name')
    inquirer.prompt([
      {
        name: "name",
        type: "list",
        message: "Select the deparment you would like to delete",
        loop: false,
        choices: dept
      }
    ]).then(function (res) {
      const query = connection.query(
        "DELETE FROM department WHERE ?",
        {
          dept_name: res.name
        },
        function (err, res) {
          console.log(res.name, " - Department deleted");
          init();
        }
      );
    })
  })
}
// Function to add role
async function addRole(departments) {
  return new Promise(function (resolve, reject) {
    const dept = pluck(departments, "dept_name");
    const deptID = pluck(departments, "id");
    const depts = []
    for (i = 0; i < deptID.length; i++) {
      depts.push(deptID[i] + "," + dept[i]);
    }
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
        name: "dept",
        type: "list",
        message: "Select the Department ID for the role?",
        loop: false,
        choices: depts,
      },
    ]).then(function (res) {
      console.log(typeof (String(res.dept)));
      console.log(res.dept);
      const resArray = String(res.dept).split(',');
      console.log(resArray);
      var query = connection.query(
        "INSERT INTO role SET ? ",
        {
          title: res.title,
          salary: res.salary,
          dept_id: parseInt(resArray[0])
        },
        function (err) {
          if (err) throw err
          console.table(res);
          init();
        }
      )
    })
  })
}
// Function to delete role
async function deleteRole(roles) {
  return new Promise(function (resolve, reject) {
    const role_title = pluck(roles, 'title')
    inquirer.prompt([
      {
        name: "role",
        type: "list",
        message: "Select the role you would like to delete",
        loop: false,
        choices: role_title,
      }
    ]).then(function (res) {
      console.log("selected role to delete: ", res)
      const query = connection.query(
        "DELETE FROM role WHERE ?",
        {
          title: res.role
        },
        function (err, res) {
          console.log("rolet deleted");
          init();
        }
      );
    })
  })
}
// Function to add an employee
async function addEmployee(roles, employees) {
  return new Promise(function (resolve, reject) {
    roleID = pluck(roles, "id")
    roleTitle = pluck(roles, "title")
    roleArr = [];
    roles.forEach(e => roleArr.push(e.id + "," + e.title))
    EmpId = pluck(employees, "id")
    EmpFN = pluck(employees, "first_name")
    EmpLN = pluck(employees, "last_name")
    EmpArr = []
    employees.forEach(e => EmpArr.push(e.id + "," + e.first_name + "" + e.last_name))
    inquirer.prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the tfirst name of the employee you wouldlike to add?"
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the last name of the employee you wouldlike to add?"
      },
      {
        name: "manager",
        type: "list",
        message: "Select the manager",
        loop: false,
        choices: EmpArr,
      },
      {
        name: "role",
        type: "list",
        message: "What is role of the employeer",
        loop: false,
        choices: roleArr,
      },
    ]).then(function (res) {
      const manArray = String(res.manager).split(',');
      const rolArray = String(res.role).split(',');
      var query = connection.query(
        "INSERT INTO employee SET ? ",
        {
          first_name: res.first_name,
          last_name: res.last_name,
          manager_id: manArray[0],
          role_id: rolArray[0],
        },
        function (err) {
          if (err) throw err
          console.table(res);
          init();
        }
      )
    })
  })
}
// Function to delete an employee
async function deleteEmployee(employees) {
  return new Promise(function (resolve, reject) {
    employeeArr = [];
    employees.forEach(e => employeeArr.push(e.id + "," + e.first_name + "," + e.last_name))
    inquirer.prompt([
      {
        name: "id",
        type: "list",
        message: "Select the employee to like to delete",
        loop: false,
        choices: employeeArr,
      }
    ]).then(function (res) {
      const empArray = String(res.id).split(',');
      console.log("selected ID to delete: ", empArray[0])
      const query = connection.query(
        "DELETE FROM employee WHERE ?",
        {
          id: parseInt(empArray[0])
        },
        function (err, res) {
          console.log("employee deleted");
          init();
        }
      );
    })
  })
}
// Function to view employees by Manager
async function vewEmployeesByManager() {
  return new Promise(function (resolve, reject) {

    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dept_name, employee.manager_id, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.dept_id left join employee e on employee.manager_id = e.id ORDER BY employee.manager_id;",
      function (err, res) {
        if (err) throw err
        for (i = 0; i < res.length; i++) {
          employeesByManager.push(res[i]);
        }
        resolve(res);
      })
  })
}
// Function to update employee's role
async function updateEmployeeRole(employeesByManager, roles) {
  return new Promise(function (resolve, reject) {
    employeeArr = [];
    employeesByManager.forEach(e => employeeArr.push(e.id + "," + e.first_name + "," + e.last_name + "," + e.title))
    roleArr = [];
    roles.forEach(r => roleArr.push(r.id + "," + r.title))
    inquirer.prompt([
      {
        name: "emp",
        type: "list",
        message: "Select employee to update the role",
        loop: false,
        choices: employeeArr
      },
      {
        name: "role",
        type: "list",
        message: "Select new role for the employee",
        loop: false,
        choices: roleArr
      },
    ]).then(function (res) {
      const empArray = String(res.emp).split(',');
      const roleArray = String(res.role).split(',');

      connection.query(
        "UPDATE employee SET ? WHERE ?",
        [{
          role_id: roleArray[0],

        },
        {
          id: empArray[0],
        }],
        function (err) {
          if (err) throw err
          console.table(res);
          init();
        }
      )
    })
  })
}
// Function to update employee's manager
async function updateEmployeeManager(employeesByManager) {
  return new Promise(function (resolve, reject) {
    employeeArr = [];
    employeeArr.forEach(e => totalSalary += e.salary)
    employeesByManager.forEach(e => employeeArr.push(e.id + "," + e.first_name + "," + e.last_name))
    inquirer.prompt([
      {
        name: "emp",
        type: "list",
        message: "Select employee to update the manager",
        loop: false,
        choices: employeeArr
      },
      {
        name: "mgr",
        type: "list",
        message: "Select name of new manager",
        loop: false,
        choices: employeeArr
      },
    ]).then(function (res) {
      const mgrArray = String(res.mgr).split(',');
      const empArray = String(res.emp).split(',');

      console.log(empArray[0])
      connection.query(
        "UPDATE employee SET ? WHERE ?",
        [{
          manager_id: mgrArray[0],

        },
        {
          id: empArray[0],
        }],
        function (err) {
          if (err) throw err
          console.table(res);
          init();
        }
      )
    })
  })
}
// Function to view budget by department
async function viewBudget(departments, employeesByManager) {
  return new Promise(function (resolve, reject) {
    const dept = pluck(departments, 'dept_name')
    inquirer.prompt([
      {
        name: "dept",
        type: "list",
        message: "Which department would you like to see the budget for?",
        choices: dept
      }
    ]).then(function (res) {
      console.log("Calculating budget for: ", res.dept)
      let totalSalary = 0;
      const arr = employeesByManager.filter(em => em.dept_name == res.dept)
      arr.forEach(e => totalSalary += e.salary)
      console.log("Total Budget for ", res.dept, " is ", "$", totalSalary)
    })
  })
}
// App Initialization
async function init() {
  console.log("Employee Management System");
  console.log("******************************************************")
  //Calling functions based on selected user action 

  try {
    const action = await userAction();
    console.log("User Chose: ", action.action);
    switch (action.action) {
      case "View All Departments":
        await getAllDepartments();
        console.table(departments);
        await init();
        break;
      case "View All Roles":
        await getAllRoles();
        console.table(roles);
        await init();
        break;
      case "View All Employees":
        await getAllEmployees();
        console.table(employees);
        await init();
        break;
      case "Add Department":
        await addDepartment();
        await init();
        break;
      case "Add Role":
        await getAllDepartments();
        await addRole(departments);
        init();
        break;
      case "Add Employee":
        await getAllDepartments();
        await getAllRoles();
        await getAllEmployees();
        await addEmployee(roles, employees);
        break;
      case "Delete a Department":
        await getAllDepartments();
        await deleteDepartment(departments);
        await init();
        break;
      case "Delete a Role":
        await getAllRoles();
        deleteRole(roles);
        break;
      case "Delete an Employee":
        await getAllEmployees();

        await deleteEmployee(employees);
        break;
      case "View employees by manager":
        await vewEmployeesByManager();
        console.table(employeesByManager);
        await init();
        break;
      case "Update employee's role":
        await vewEmployeesByManager();
        await getAllRoles();
        await updateEmployeeRole(employeesByManager, roles);
        break;
      case "Update employee's manager":
        await vewEmployeesByManager();
        await updateEmployeeManager(employeesByManager);
        break;
      case "View the total utilized budget of a department":
        await vewEmployeesByManager();
        await getAllDepartments();
        await viewBudget(departments, employeesByManager);
        break;
    }

    connection.end;
  } catch (err) {
    console.log(err);
  }

};
