#! /usr/bin/env node

import { Command } from "commander";
import chalk from 'chalk';
import figlet from 'figlet';
const program = new Command();


console.log(`
████    ███████ ██ ██████  ███    ███ ██████  ███████ ██████    ████
██      ██      ██ ██   ██ ████  ████ ██   ██ ██      ██   ██     ██
██      █████   ██ ██████  ██ ████ ██ ██████  █████   ██████      ██
██      ██      ██ ██   ██ ██  ██  ██ ██   ██ ██      ██   ██     ██
████    ██      ██ ██   ██ ██      ██ ██████  ███████ ██   ██   ████ 
`);

console.log(`
    Create FIRMBER.md files to configure your project.
    Add documentation to the .firmber/documents/ directory for better results.   
`);

program
    .name('firmber')
    .description('AI-powered CLI tool for firmware development')
    .version('1.0.0');

// Command init
// Initializes a new project configuration.
program
  .command('init')
  .description('Initialize a new project configuration (creates agent.json)')
  .requiredOption('--soc <soc_name>', 'Specify the target System-on-Chip (e.g., TDA4VM)')
  .option('--os <os_type>', 'Specify the target OS (e.g., freertos)', 'bare-metal')
  .option('--cores <core_list>', 'Define the processors involved (e.g., ARM:A72,DSP:C7x)', 'ARM:A72')
  .option('--standard <coding_standard>', 'Set the coding standard for compliance', 'misra-c:2012')
  .option('--template <project_template>','Use a predefined project structure (e.g., ipc-framework, single-core-driver-app)')
  .action((options) => {
    console.log(chalk.green('🚀 Initializing project...'));
    console.log(chalk.yellow('================================='));
    console.log(`  Target SoC:      ${chalk.cyan(options.soc)}`);
    console.log(`  Operating System: ${chalk.cyan(options.os)}`);
    console.log(`  Processor Cores: ${chalk.cyan(options.cores)}`);
    console.log(`  Coding Standard: ${chalk.cyan(options.standard)}`);
    console.log(chalk.yellow('================================='));
    console.log(chalk.green('\n✅ Project configuration file "agent.json" would be created here.'));
    // In a real app, you would write these options to a JSON file.
  });


//Command design
//Tools for architectural design and scaffolding.
const design = program.command('design')
  .description('System architecture and scaffolding tools')

design
.command("scaffold-module <module_name>")
  .description('Creates a standard directory structure and boilderplate files (.h, .c) for a new software module, promoting reusability.')
  .option('--api <type>', "API visibility (public|private)","public")
  .action((module, options) => {
    console.log(`[DESIGN] Scaffolding module :${module}, API: ${options.api}`)
  });

  design.command('define-interface <module_a> <module_b>')
  .description('Generates header files with function prototypes and data structures for the interaction betwen two modules, solving Interface Ambiguity.')
  .option("--spec <description>", "High-level description of interface")
  .action((module_a, module_b, options) => {
    console.log(`[Design] Defining interface between ${module_a} and ${module_b}`);
    if(options.spec) console.log(`Spec: ${options.spec}`) 
});  

design
.command("map-ipc")
.description("Define IPC communication between cores")
.requiredOption("--from <core_id>", "Source core (e.g., ARM:A72)")
.requiredOption("--to <core_id>","Destination core (e.g., DSP:C7x)")
.option("--channel-type <type>", "IPC channel type (messageq|ringio)","messageq")
.action((options) => {
    console.log(`[Design] Mapping IPC: ${options.from} -> ${options.to}`);
    console.log(`Channel: ${options["channel-type"]}`);
})

program.parseAsync(process.argv);