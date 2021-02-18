DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NOT NULL,  
  PRIMARY KEY (id)
);
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,  
  salary DECIMAL(10,2), 
  dept_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY(dept_id) REFERENCES department(id)
);
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,  
  manager_id INT,
  role_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY(manager_id) REFERENCES employee(id), 
  FOREIGN KEY(role_id) REFERENCES role(id)
);

