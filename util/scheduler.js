const logger = require('@util/logger')

class Task {
    constructor(name, callback, timeout = undefined, duedate = undefined, ...params){
        this.name = name
        this.callback = callback;
        this.params = params;
        this.duedate = duedate
        this.timeout = timeout
        this.nextCall = Date.now()
        if(duedate) {
            this.setDuedate(duedate)
        } else if (timeout) {
            this.setTimeout(timeout)
        }
    }

    setDuedate(duedate) {
        if(duedate)
            logger.info(`[Scheduler] Set duedate for task "${this.name} to ${duedate - Date.now()}ms in the future.`)
        this.duedate = duedate;
        this.nextCall = duedate;
    }

    getDuedate() {
        return this.duedate;
    }

    setTimeout(timeout) {
        if (timeout)
            logger.info(`[Scheduler] Set timeout for task "${this.name} to ${timeout}ms`)
        this.timeout = timeout;
        this.nextCall = Date.now() + timeout;
    }
    getTimeout() {
        return this.timeout
    }

    run() {

        if (this.timeout && Date.now() >= this.nextCall) {

            logger.info(`[Scheduler] Executed task "${this.name}" and reset timeout to ${this.timeout}ms.`)
            this.callback(this.params);
            this.setTimeout(this.timeout);

        } else if (this.duedate && Date.now() >= this.nextCall) {

            logger.info(`[Scheduler] Executed task "${this.name}" and deleted Duedate.`)
            this.callback(this.params);
            this.setDuedate(undefined);
        }
    }
}

const tasks = new Map()

const checkForTasks = () => {

    for ([name, task] of tasks) {
        task.run()
        if (task.getDuedate() === undefined && task.getTimeout() === undefined) {
            // remove if only onced
            tasks.delete(name)
        }

    }
}

module.exports = async () => {

    setInterval(checkForTasks, 1 * 1000);
}

module.exports.addTask = (task) => {
    tasks.set(task.name, task)
    logger.debug(`[Scheduler] Add Task: ${task.name} with timestamp: ${task.getDuedate()} and cycle: ${task.getTimeout()}`)
}

module.exports.Task = Task
