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
("Jeanne", "Ruby", 2, NULL),
("Zoe", "Croak", 3, NULL),
("Cassie", "Jones", 4, NULL),
("Amy", "Blue", 1, 1),
("Sarah", "Connor", 1, 1),
("Jennifer", "Pierce", 2, 2),
("Karen", "Arroyo", 2, 2),
("Kacey", "Bates", 3, 3),
("Mya", "Violet", 3, 3),
("Dawn", "Cobbel", 4, 4),
("Liz", "Brack", 4, 4);


