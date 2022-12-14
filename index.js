const inquirer = require("inquirer");
const fs = require("fs");

//Class files for the different types of employee, located in the library directory
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");

//const teamArray starts empty. We will fill it with instances of employees generated by the user.
const teamArray = [];

//The index.HTML is built around makeTeamHtml, wich contains the employee cards. makeTopHTml includes the header, etc.
const {
	makeTeamHtml,
	makeTopHtml,
	makeBottomHtml,
} = require("./src/templateHelper");

//This is where index.HTML is built in three parts. Concat stitches together the text produced by the three parts.
const writeHtmlFile = () => {
	const file = makeTopHtml()
		.concat(makeTeamHtml(teamArray))
		.concat(makeBottomHtml());
	fs.writeFileSync("./src/index.html", file, "utf-8");
};

//managerMaker makes the manager object for the team based on user input, pushes the new manager object onto the teamArray, and takes the user to a menu where they can elect to enter more team member information.
const managerMaker = () => {
	inquirer
		.prompt([
			{
				type: "input",
				message: "Enter the team manager's name",
				name: "managerName",
			},
			{
				type: "input",
				message: "Enter the team manager's employee ID number",
				name: "managerID",
			},
			{
				type: "input",
				message: "Enter the team manager's email address",
				name: "managerEmail",
			},

			{
				type: "input",
				message: "Enter the team manager's office number",
				name: "officeNumber",
			},
		])
		//constructing a manager object from the collected user information
		//the response object is full of user generated info about the manager, and we use it to make the manager object.
		.then((response) => {
			const manager = new Manager(
				response.managerName,
				response.managerID,
				response.managerEmail,
				response.officeNumber
			);
			teamArray.push(manager); //sends the new manager object to team array (which was previously empty)
		})
		.then((response) => {
			membersMenu();
		});
};

const membersMenu = () => {
	inquirer
		.prompt([
			{
				type: "list",
				name: "another",
				message: "Would you like to add an Engineer or Intern to the team?",
				choices: ["Engineer", "Intern", "Nope, I'm all done!"],
			},
		])
		.then((response) => {
			if (response.another == "Engineer") {
				engineerMaker();
			} else if (response.another == "Intern") {
				internMaker();
			} else {
				//if the user doesn't pick creating another employee, it's time to write index.html!
				writeHtmlFile();
			}
		});
};
const engineerMaker = async () => {
	//I added async and await here to delay membersMenu from being called
	await inquirer
		.prompt([
			{
				type: "input",
				message: "Enter the team engineer's name",
				name: "engineerName",
			},
			{
				type: "input",
				message: "Enter the team engineer's employee ID number",
				name: "engineerID",
			},
			{
				type: "input",
				message: "Enter the team engineer's email address",
				name: "engineerEmail",
			},

			{
				type: "input",
				message: "Enter the team engineer's github username",
				name: "github",
			},
		])
		.then((response) => {
			//creating a new Engineer object from the response object
			const engineer = new Engineer(
				response.engineerName,
				response.engineerID,
				response.engineerEmail,
				response.github
			);
			teamArray.push(engineer); //adding the new engineer to the team roster
		});

	membersMenu();
};

const internMaker = async () => {
	await inquirer
		.prompt([
			{
				type: "input",
				message: "Enter the team intern's name",
				name: "internName",
			},
			{
				type: "input",
				message: "Enter the team intern's employee ID number",
				name: "internID",
			},
			{
				type: "input",
				message: "Enter the team intern's email address",
				name: "internEmail",
			},

			{
				type: "input",
				message: "Enter the team intern's school",
				name: "school",
			},
		])
		.then((response) => {
			//creating the new Intern object from the response object
			const intern = new Intern(
				response.internName,
				response.internID,
				response.internEmail,
				response.school
			);
			teamArray.push(intern); //adding the intern to the team roster
		});
	membersMenu(); //takes the user back to the menu to either choose another employee or not.
};

managerMaker(); //calling managerMaker starts off the app by asking the user for manager information.
