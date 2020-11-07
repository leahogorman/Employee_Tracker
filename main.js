const inquirer = require('inquirer');
const figlet = require('figlet')
const mysql = require('mysql');

class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args=[] ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
  }

const db = new Database({
    host: 'localhost',
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker",
    insecureAuth : true
});

module.exports = db

console.log(figlet.textSync('Employee Tracker', {
    font: 'isometric3',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 150,
    whitespaceBreak: true
}));


async function main() {
    promptAnswers = await inquirer.prompt({
        name: 'startPrompt',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Add Department', 'Add Role', 'Add Employee', 'View All Departments', 'View All Roles', 'View All Employees', 'Update Employee Information', 'Update Employee Manager', 'Delete Department', 'Delete Role', 'Delete Employee', 'Exit']
    });
    userChoice = promptAnswers.startPrompt

    if (userChoice === 'Add Department') {

        promptAddDepartment = await inquirer.prompt([
            { name: 'newDepartment', type: 'input', message: 'What is the name of the new DEPARTMENT?' },
        ]);

        await db.query("INSERT INTO `departments` (`name`) VALUES(?)", [promptAddDepartment.newDepartment]);

    } else if (userChoice === 'Add Role') {

        promptAddRole = await inquirer.prompt([
            { name: 'roleTitle', type: 'input', message: 'What is the TITLE of the new ROLE?' },
            { name: 'roleSalary', type: 'input', message: 'What is the SALARY of the new ROLE?' },
            { name: 'departmentID', type: 'input', message: 'What is the ID NUMBER of the DEPARTMENT of the ROLE?' }
        ]);

        await db.query("INSERT INTO `roles` (`title`, `salary`, `department_id`) VALUES(?)", [promptAddRole.roleTitle, promptAddRole.roleSalary, promptAddRole.deptartmentID]);

    } else if (userChoice === 'Add Employee') {

        promptAddEmployee = await inquirer.prompt([
            { name: 'employeeFirstName', type: 'input', message: 'What is the FIRST NAME of the new EMPLOYEE?' },
            { name: 'employeeLastName', type: 'input', message: 'What is the LAST NAME of the new EMPLOYEE?' },
            { name: 'roleID', type: 'input', message: 'What is the ID NUMBER of the ROLE of the EMPLOYEE?' },
            { name: 'managerID', type: 'input', message: 'What is the ID NUMBER of the MANAGER of the EMPLOYEE?' }
        ]);

        await db.query("INSERT INTO `employees` (`firt_name`, `last_name`, `roles_id`) VALUES(?)", [promptAddEmployee.employeeFirstName, promptAddEmployee.employeeLastName, promptAddEmployee.roleID, promptAddEmployee.managerID]);

    } else if (userChoice === 'View All Departments') {
        const departments = await db.query("Select * FROM departments")
        console.table(departments)

    } else if (userChoice === 'View All Roles') {
        const roles = await db.query("Select * FROM roles")
        console.table(roles)
    } else if (userChoice === 'View All Employees') {
        const employees = await db.query("Select * FROM employees")
        console.table(employees)

    } else if (userChoice === 'Update Employee Information') {
        promptEditEmployee = await inquirer.prompt([
            { name: 'employeeID', type: 'input', message: 'What is the ID of the EMPLOYEE you would like to EDIT?' },
            { name: 'employeeFirstName', type: 'input', message: 'What is the FIRST NAME of the EMPLOYEE?' },
            { name: 'employeeLastName', type: 'input', message: 'What is the LAST NAME of the EMPLOYEE?' },
            { name: 'roleID', type: 'input', message: 'What is the ID NUMBER of the ROLE of the EMPLOYEE?' },
            { name: 'managerID', type: 'input', message: 'What is the ID NUMBER of the MANAGER of the EMPLOYEE?' }
        ]);
        await db.query("UPDATE employees SET first_name=?, last_name=?, roles_id=?, manager_id=?", [promptEditEmployee.employeeFirstName, promptAddEmployee.employeeLastName, promptAddEmployee.roleID, promptAddEmployee.managerID]);
    } else if (userChoice === 'Update Employee Manager') {

    } else if (userChoice === 'Delete Department') {
        let deleteDepartment = await db.query("Selet name FROM employee_tracker.departments");
        let departmentToDelete = deleteDepartment.map(function (department) {
            return department.name
        })

        promptDeleteDepartment = await inquirer.prompt([
            {
                name: 'departmentName', type: 'list', message: 'Please CONFIRM that you would like to DELETE this DEPARTMENT?',
                choices: departmentToDelete
            }])
        await db.query("DELETE from departments where name=?", [promptDeleteDepartment.deptartmentName])
    } else if (userChoice === 'Delete Role') {
        let deleteRole = await db.query("Selet ID number FROM employee_tracker.roles");
        let roleToDelete = deleteRole.map(function (roles) {
            return roles.name
        })

        promptDeleteRole = await inquirer.prompt([
            {
                name: 'roleID', type: 'list', message: 'Please CONFIRM that you would like to DELETE this ROLE?',
                choices: roleToDelete
            }])
        await db.query("DELETE from roles where roles_id=?", [promptDeleteRole.roleID])
    } else if (userChoice === 'Delete Employee') {
        let deleteEmployee = await db.query("Selet ID number FROM employee_tracker.employees");
        let employeeToDelete = deleteEmployee.map(function (employee) {
            return employee.id
        })

        promptDeleteEmployee = await inquirer.prompt([
            {
                name: 'employeeID', type: 'list', message: 'Please CONFIRM that you would like to DELETE this EMPLOYEE?',
                choices: employeeToDelete
            }])
        await db.query("DELETE from employees where id=?", [promptDeleteEmployee.employeeID])
    } 
    main()
}
main()