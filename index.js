#!/urs/bin/env node

// fix __dirname and __filename
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Packages
import fs from 'fs';
import fetch from 'node-fetch';
import download from 'download-git-repo';

// CLI packages
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import { createSpinner } from 'nanospinner';
import figlet from 'figlet';

let playerName;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
    figlet("ServerSMP - BOT CLI", (err, data) => {
        console.log(gradient.pastel.multiline(data));
    });

    await sleep();
}

async function setup() {
	if (fs.existsSync(`${__dirname}/ServerSMP - BOT`)) return await options();

	const downloadBOT = createSpinner("Download ServerSMP - BOT").start();
	
	await sleep();
	
	download("github:Prince527Github/ServerSMP-BOT", `${__dirname}/ServerSMP - BOT`, async function(err) {
		if (err) return downloadBOT.error({ text: "An error has accourd while download the BOT" });
		downloadBOT.success({ text: "Finiched downloading" });

		await sleep();

		await options();
	});
}

async function options() {
    const answers = await inquirer.prompt({
        name: 'options',
        type: 'list',
        message: 'What function do you want to do?',
        choices: [
            "Setup settings",
            "Create CMD"
        ],
    });

    if (answers.options == "Setup settings") {
		console.log("Sorry but this function is not created yet");
		process.exit(1);

    } else if (answers.options == "Create CMD") {
		console.log(chalk.red("If you dont want to do most options enter false.\n"));

		await sleep();

		// <---------- Name ---------->
        let name;
        const question_1 = await inquirer.prompt({
            name: 'name',
            type: 'input',
            message: 'What is the name?',
        });

        if (!question_1.name) {
            console.log('Please enter a name.');
            process.exit(1);
        } else name = question_1.name;

		// <---------- Aliases ---------->
        let aliases = [];
        const question_2 = await inquirer.prompt({
            name: 'aliases',
            type: 'input',
            message: 'What are the aliases?',
        });

        if (!question_2.aliases) {
            console.log('Please enter a aliases or false.');
            process.exit(1);
        } else {
			if (question_2.aliases !== "false") question_2.aliases.split(',').forEach(element => {
				aliases.push(`'${element}'`);
			});
		}

		// <---------- Description ---------->
        let description;
        const question_3 = await inquirer.prompt({
            name: 'description',
            type: 'input',
            message: 'What is the description?',
        });

        if (!question_3.description) {
            console.log('Please enter a description or false.');
            process.exit(1);
        } else {
			if (!question_3.description !== "false") description = question_3.description;
		}
		
		// <---------- Usage ---------->
        let usage;
        const question_4 = await inquirer.prompt({
            name: 'usage',
            type: 'input',
            message: 'What is the usage?',
        });

        if (!question_4.usage) {
            console.log('Please enter a usage or false.');
            process.exit(1);
        } else {
			if (!question_4.usage !== "false") usage = question_4.usage;
		}

		// <---------- Owner ---------->
        let owner = false;
        const question_5 = await inquirer.prompt({
            name: 'owner',
            type: 'list',
            message: 'Is it an owner command?',
			choices: ["true", "false"]
        });

		if (!question_5.owner !== "false") owner = true;
		
		// <---------- User Premium ---------->
		let userPremium = false;
        const question_6 = await inquirer.prompt({
            name: 'userpremium',
            type: 'list',
            message: 'Is it an user premium command?',
			choices: ["true", "false"]
        });

		if (!question_6.userpremium !== "false") userPremium = true;
		
		// <---------- Guild Premium ---------->
        let guildPremium = false;
        const question_7 = await inquirer.prompt({
            name: 'guildpremium',
            type: 'list',
            message: 'Is it an guild premium command?',
			choices: ["true", "false"]
        });

		if (!question_7.guildpremium !== "false") guildPremium = true;
		
		// <---------- Cooldown ---------->
        let cooldown;
        const question_8 = await inquirer.prompt({
            name: 'cooldown',
            type: 'input',
            message: 'Does this command need a cooldown?',
        });

        if (!question_8.cooldown) {
            console.log('Please enter a number or false.');
            process.exit(1);
        } else {
			if (question_8.cooldown !== "false") {
				if (!Number(question_8.cooldown)) {
					console.log('Please enter a valid number.');
					process.exit(1);
				}
				const num = parseInt(Number(question_8.cooldown));
				cooldown = num;
			}
		}
		
		// <---------- Catagory ---------->
        let catagory;
        const question_9 = await inquirer.prompt({
            name: 'catagory',
            type: 'input',
            message: 'What is the catagory / folder?',
        });

        if (!question_9.catagory) {
            console.log('Please enter a catagory.');
            process.exit(1);
        } else {
			catagory = question_9.catagory;
		}

		// <---------- File contents ---------->
        const content = [
            `const { Message, Client, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require("discord.js");\n`,
            `module.exports = {`,
            `    name: '${name}',`
        ];
        
        if (aliases.length > 0) content.push(`    aliases: [${aliases}],`);
        if (usage.length > 0) content.push(`    usage: '${usage}',`);
        if (description.length > 0) content.push(`    description: '${description}',`);
        if (owner === "true") content.push(`    owner: ${owner},`);
        if (userPremium === "true") content.push(`    userPremium: ${userPremium},`);
        if (guildPremium === "true") content.push(`    guildPremium: ${guildPremium},`);
        if (cooldown) content.push(`    cooldown: ${cooldown},`);

        content.push(`    /**`);
        content.push(`     *`);
        content.push(`     * @param {Client} client`);
        content.push(`     * @param {Message} message`);
        content.push(`     * @param {String[]} args`);
        content.push(`     */`);
        content.push(`    run: async (client, message, args) => {\n`);
        content.push(`    },`);
        content.push(`};`);

		const makeCMD = createSpinner('Creating command').start();
		await sleep();

		// <---------- Create dir ---------->
		if (!fs.existsSync(`${__dirname}/ServerSMP - BOT/commands/${catagory}/`, { recursive: true })) fs.mkdirSync(`${__dirname}/ServerSMP - BOT/commands/${catagory}/`, { recursive: true });

		// <---------- Create file ---------->
        fs.appendFile(`${__dirname}/ServerSMP - BOT/commands/${catagory}/${name}.js`, content.join('\n'), async(err) => {
            if (err) return makeCMD.error({ text: "An error has accourd while create command" });
			makeCMD.success({ text: "Finiched creating command" });
        })

    }
}

await welcome();
await setup();