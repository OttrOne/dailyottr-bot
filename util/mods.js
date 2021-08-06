const path = require('path');
const fs = require('fs');

/**
 *  Mod loader to autoload mods (extensions that rely on client instance)
 *
 * @author AlexOttr <alex@ottr.one>
 * @version 1.0
 *
 * @exports ModLoader
 */
class ModLoader {

    /**
     * Create a new ModLoader instance
     * @param {Client} client Discord client instance
     * @param {string} dir path to the mods directory
     */
    constructor(client, dir) {

        this.client = client;
        this.dir = dir;

        this.load()
    }

    /**
     * Recursive inner function to call the mods from the given directory
     * @param {string} dir
     * @returns {number} sum of loaded mods
     */
    _load(dir) {
        let count = 0
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                count += this._load(path.join(dir, file))
            } else {
                const mod = require(path.join(__dirname, dir, file))
                console.log('\x1b[2m%s\x1b[0m', ` -> enabling mod ${file}`)
                mod(this.client)
                ++count
            }
        }
        return count
    }

    /**
     * Outer function to load all mods in the given root directory
     */
    load() {
        console.log('\x1b[35m%s\x1b[0m', 'Starting up ModLoader')
        const count = this._load(this.dir)
        console.log('\x1b[35m%s\x1b[0m', `Done. ${count} Mods loaded\n`)
    }
}

module.exports.ModLoader = ModLoader
