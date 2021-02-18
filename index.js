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

async function init() {
    console.log("Employee Tracker Management");
    console.log("******************************************************")
  // calling functions to get user respomses and github info
    try {
        const action = await userAction();   
        console.log("user chose: ", action.action);         
        connection.end; 
  }catch(err) {
      console.log(err);    
  }
  
  };
