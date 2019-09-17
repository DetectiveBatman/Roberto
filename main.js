#!/usr/bin/env node

const express = require('express');
const chalk = require('chalk');
const app = express();
const args = process.argv.splice(2);
const port = args[0] || 8546;
