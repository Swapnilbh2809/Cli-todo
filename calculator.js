import fs from "fs"
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
//reading tasks.json
const data = fs.readFileSync("tasks.json", "utf8");
let tasks;
let id;

if (data.trim() === "") {
    tasks = [];
    id = 0;
} else {
    tasks = JSON.parse(data);
    let leng = tasks.length;
    id = tasks[leng - 1].taskid;
}
//addding task
function addtask(string) {

    let task = {
        taskid: id + 1,
        task: string,
        status: false
    }
    tasks.push(task);
    fs.writeFileSync("tasks.json", JSON.stringify(tasks));
    id = id + 1;
    console.log("task was added");
}
//display tasks
function listtasks() {

    if (tasks.length == 0) {
        console.log("no tasks to display");
    }

    else {
        tasks.forEach(element => {
            console.log(`${element.taskid}.${element.task.toUpperCase()} status : ${element.status}`);
        });
    }
}
//delete task
function deletetask(id) {
    let newarray = tasks.filter((taskwithid) => {
        return taskwithid.taskid != id;
    })
    fs.writeFileSync("tasks.json", JSON.stringify(newarray));
    console.log("task was deleted");
}

//update task
function updateTask(id) {
    tasks.forEach((tasktobeupdated) => {
        if (tasktobeupdated.taskid === id) {
            tasktobeupdated.status = completed;
            console.log("taskk was updated");
        }
    })
    fs.writeFileSync("tasks.json", JSON.stringify(tasks));
}


//main interface
rl.question("pllease select an operation to perform:- \n1.Add <new task>\n2.List\n3.Delete <give id number>\n4.update <give id number>\n> ", (answer) => {
    let array = answer.split(" ");
    let action = array[0].toLowerCase();
    let id = Number(array[1])
    const arr = array.splice(1).join(" ");
    if (action === "add") {
        addtask(arr);
    }
    else if (action == "list") {
        listtasks();
    }
    else if (action === "delete") {

        deletetask(id);
    }
    else if (action === "update") {
        updateTask(id);
    }
    else {
        console.log("please enter a valid operation.")
    }
    rl.close();
})

