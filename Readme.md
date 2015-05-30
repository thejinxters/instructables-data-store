Instructables API to SQL Script
===============================

Author: Brandon Mikulka


# Requirements
 * Node installed
 * Run `npm install` to download dependencies

# Setup
Copy the `config-sample.json` to a new file named `config.json`.
You will need two things:
 * Mashape Api Key
 * Database Credentials
Update the `config.json` file with the correct credentials and you should be on your way.


# Running the script
To Run the script, simply run the following:

```bash
node collect-data.js
```