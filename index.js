#!/usr/bin/env node

var ConsoleApp = require('./src/ConsoleApp')
var EventEmitter = require('events').EventEmitter

global.appName = 'vrsflix'
global.VERSION = '0.1.0'
global.events = new EventEmitter()

process.title = global.appName

var cli = process.stdout.isTTY && process.stdin.isTTY && !!process.stdin.setRawMode
var consoleApp

if (cli) {
  try {
    consoleApp = new ConsoleApp()
    consoleApp.init()
  } catch(e) {
    console.error('Error:', e.message)
  }
}
