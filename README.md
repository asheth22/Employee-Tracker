# Employee-Tracker

This is node.js command line application designed for managing a company's employees using node, inquirer, and MySQL.The application uses employee_trackerdb with three tables: department, role, and employee for storing data. 

## Application Features
```
Once the application is initialized through the command line. The application:
    > Prompts the user to select one of many actions to view, add, and delete a department, role or employee
    > In addition to the view, add, and delete basic functions, the applications also allows the user to update employee's role, 
    employee's maanger, view employees by manager and view the total budget for selected department
    > Once the user selects a particular action a specific function is called which executes a MYSQL query
    > The view functions execute a query that SELECT and displays data from the tables
    > The add functions exectute a query that INSERT the data into the tables
    > The update functions execute a query that UPDATE the data into the tables
    > The delete functions execute a query that DELETE the data from the tables. 
    > The application uses console.table to display data to the user
    > The application has a pluck function that accepts an object and property name as arguments a returns an array 
    with values corresponding to the property name

```
## Mock-up

Demo of the application [Employee_Tracker](]https://github.com/asheth22/Employee-Tracker/blob/main/demo/Employee_Tracker.gif)

