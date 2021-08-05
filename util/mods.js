const { prefix } = require('@root/settings.json');
const path = require('path');
const fs = require('fs');

module.exports.load = (client) => {
    console.log('\n==== Loading Mods ====')

    // recursively read directory for Mods
    const readMods = dir => {
      const files = fs.readdirSync(path.join(__dirname, dir))
      for(const file of files) {
          const stat = fs.lstatSync(path.join(__dirname, dir, file))
          if (stat.isDirectory()) {
              readMods(path.join(dir, file))
          } else {
              const mod = require(path.join(__dirname, dir, file))
              console.log(`Enabling mod ${file}`)
              mod(client)
              //this.register(client)
          }
      }
    }
    readMods('../mods')
    console.log('==== Mods loaded ====\n')
  }
