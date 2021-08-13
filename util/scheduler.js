class Task {
    constructor(name, callback, timeout = undefined, duedate = undefined, ...params){
        this.name = name
        this.callback = callback;
        this.params = params;
        this.duedate = duedate
        this.timeout = timeout

        this.nextCall = Date.now()
    }

    setDuedate(duedate) {
        this.duedate = duedate;
        this.nextCall = duedate;
    }

    getDuedate() {
        return this.duedate;
    }

    setTimeout(timeout) {
        console.log(`Set timeout for task "${this.name} to ${timeout}ms`)
        this.timeout = timeout;
        this.nextCall = Date.now() + timeout;
    }
    getTimeout() {
        return this.timeout
    }

    run() {

        if (this.timeout && Date.now() >= this.nextCall) {

            console.log(`Executed task "${this.name}" and reset timeout to ${this.timeout}ms.`)
            this.callback(this.params);
            this.setTimeout(this.timeout);

        } else if (this.duedate && Date.now() >= this.nextCall) {

            console.log(`Executed task "${this.name}" and deleted Duedate.`)
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
            const index = tasks.indexOf(task);
            if (index !== -1) tasks.splice(index, 1);
        }

    }
}

module.exports = async () => {

    setInterval(checkForTasks, 1 * 1000);
}

module.exports.addTask = (task) => {
    tasks.set(task.name, task)
}

module.exports.getTaskByName = (name) => {

    // check if task with name is in task list
}

module.exports.Task = Task
