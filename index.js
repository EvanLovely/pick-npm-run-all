#!/usr/bin/env node
'use strict';
const inquirer = require('inquirer');
const execa = require('execa');
const path = require('path');

const scriptPrefix = process.argv[2];
const pkg = require(path.join(process.cwd(), 'package.json'));
const scripts = Object.keys(pkg.scripts);

inquirer.prompt([
  {
    name: 'tasks',
    message: 'Which tasks to run?',
    type: 'checkbox',
    choices: scriptPrefix
      ? scripts.filter(s => s.startsWith(scriptPrefix))
      : scripts,
  },
  {
    name: 'runType',
    message: 'How to run tasks?',
    type: 'list',
    choices: [
      'sequential',
      'parallel',
    ],
  },
]).then(({
  tasks,
  runType,
}) => {
  console.log({ tasks, runType });

  const args = [
    `--${runType}`,
    runType === 'parallel' ? '--print-label' : '',
    ...tasks,
  ].filter(x => x); // removes falsy's

  execa('npm-run-all', args, {
    env: {
      // @todo get colors back
      FORCE_COLOR: true,
      // FORCE_COLOR: '1',
    },
  }).stdout.pipe(process.stdout);

});
