USE employees_db

INSERT INTO department_list
(dep_name)
VALUES 
("SALES"),
("MARKETING"),
("FINANCE"),
("IT");

INSERT INTO role_list 
(title, salary, department_list_id) 
VALUES 
("SALES PERSON", 100000, 1),
("MARKETOR", 90000, 2),
("ACCOUNTANT", 95000, 3),
("SOFTWARE ENGINGEER", 105000, 4);

INSERT INTO employee_list
(first_name, last_name, role_list_id, manager_id)
VALUES
("Jamie", "Smith", 1, NULL),
("Amy", "Blue", 1, NULL),
("Sarah", "Connor", 1, NULL),
("Jennifer", "Pierce", 2, NULL),
("Karen", "Arroyo", 2, NULL),
("Jeanne", "Ruby", 2, NULL),
("Kacey", "Bates", 3, NULL),
("Zoe", "Croak", 3, NULL),
("Mya", "Violet", 3, NULL),
("Cassie", "Jones", 4, NULL),
("Dawn", "Cobbel", 4, NULL),
("Liz", "Brack", 4, NULL);


