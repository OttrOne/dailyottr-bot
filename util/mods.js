const path = require('path');
const fs = require('fs');

/**
 *
 */
class ModLoader {

    /**
     *
     * @param Client client
     * @param string dir
     */
    constructor(client, dir) {

        this.client = client;
        this.dir = dir;

        this.load()
    }

    /**
     *
     * @param string dir
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
                console.log(`Enabling mod ${file}`)
                mod(this.client)
                ++count
            }
        }
        return count
    }

    /**
     *
     */
    load() {

        this._load(this.dir)
    }
}

module.exports.ModLoader = ModLoader
