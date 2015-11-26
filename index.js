#!/usr/bin/env node

var ConsoleApp = require('./src/ConsoleApp');

global.appName = 'vrsflix';
global.VERSION = '0.1.0';

process.title = global.appName;

var cli = process.stdout.isTTY && process.stdin.isTTY && !!process.stdin.setRawMode;

if (cli)
{
  try
  {
    consoleApp = new ConsoleApp();
    consoleApp.init();
  }
  catch(e)
  {
    console.error('Error:', e.message)
  }

}