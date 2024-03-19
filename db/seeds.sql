USE employees_db

INSERT INTO department_list
(dep_name)
VALUES 
("SALES"),
("MARKETING");

INSERT INTO role_list 
(title, salary, department_list_id) 
VALUES 
("SALES PERSON", 100000, 1),
("MARKETOR", 90000, 2);

INSERT INTO employee_list
(first_name, last_name, role_list_id, manager_id)
VALUES
("James", "Smith", 1, NULL),
("Amy", "Blue", 2, NULL);