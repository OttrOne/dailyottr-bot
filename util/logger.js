const time = () => {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

const log = (prefix, message) => {
    console.log(`${prefix} \x1b[36m${time()}\x1b[0m`, message)
}

module.exports.info = (message) => {
    log(`\x1b[32mINFO\x1b[0m`, message)
}

module.exports.error = (message) => {
    log(`\x1b[1;31mERROR\x1b[0m`, message)
}

module.exports.debug = (message) => {
    log(`\x1b[33mDEBUG\x1b[0m`, message)
}
