// import fs from "fs"
// import readline from "readline";

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })
// //reading tasks.json
// const data = fs.readFileSync("tasks.json", "utf8");
// let tasks;
// let id;

// if (data.trim() === "") {
//     tasks = [];
//     id = 0;
// } else {
//     tasks = JSON.parse(data);
//     let leng = tasks.length;
//     id = tasks[leng - 1].taskid;
// }
// //addding task
// function addtask(string) {

//     let task = {
//         taskid: id + 1,
//         task: string,
//         status: false
//     }
//     tasks.push(task);
//     fs.writeFileSync("tasks.json", JSON.stringify(tasks));
//     id = id + 1;
//     console.log("task was added");
// }
// //display tasks
// function listtasks() {

//     if (tasks.length == 0) {
//         console.log("no tasks to display");
//     }

//     else {
//         tasks.forEach(element => {
//             console.log(`${element.taskid}.${element.task.toUpperCase()} status : ${element.status}`);
//         });
//     }
// }
// //delete task
// function deletetask(id) {
//     let newarray = tasks.filter((taskwithid) => {
//         return taskwithid.taskid != id;
//     })
//     fs.writeFileSync("tasks.json", JSON.stringify(newarray));
//     console.log("task was deleted");
// }

// //update task
// function updateTask(id) {
//     tasks.forEach((tasktobeupdated) => {
//         if (tasktobeupdated.taskid === id) {
//             tasktobeupdated.status = completed;
//             console.log("taskk was updated");
//         }
//     })
//     fs.writeFileSync("tasks.json", JSON.stringify(tasks));
// }


// //main interface
// rl.question("pllease select an operation to perform:- \n1.Add <new task>\n2.List\n3.Delete <give id number>\n4.update <give id number>\n> ", (answer) => {
//     let array = answer.split(" ");
//     let action = array[0].toLowerCase();
//     let id = Number(array[1])
//     const arr = array.splice(1).join(" ");
//     if (action === "add") {
//         addtask(arr);
//     }
//     else if (action == "list") {
//         listtasks();
//     }
//     else if (action === "delete") {

//         deletetask(id);
//     }
//     else if (action === "update") {
//         updateTask(id);
//     }
//     else {
//         console.log("please enter a valid operation.")
//     }
//     rl.close();
// })

import fs from "fs";
import readline from "readline";

const FILE = "tasks.json";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ---- load ----
let tasks = [];

function loadTasks() {
    if (!fs.existsSync(FILE)) {
        return [];
    }
    const raw = fs.readFileSync(FILE, "utf8");
    if (raw.trim() === "") {
        return [];
    }
    try {
        return JSON.parse(raw);
    } catch (err) {
        console.log("tasks.json is corrupted, starting fresh. (backing up old file to tasks.json.bak)");
        fs.writeFileSync(FILE + ".bak", raw);
        return [];
    }
}

function saveTasks() {
    fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

function nextId() {
    if (tasks.length === 0) return 1;
    return Math.max(...tasks.map(t => t.taskid)) + 1;
}

tasks = loadTasks();

// ---- operations ----
function addTask(text) {
    if (!text || text.trim() === "") {
        console.log("can't add an empty task. usage: add <task text>");
        return;
    }
    const task = {
        taskid: nextId(),
        task: text.trim(),
        status: false
    };
    tasks.push(task);
    saveTasks();
    console.log(`task added (id ${task.taskid})`);
}

function listTasks() {
    if (tasks.length === 0) {
        console.log("no tasks to display");
        return;
    }
    tasks.forEach(t => {
        const status = t.status ? "done" : "pending";
        console.log(`${t.taskid}. ${t.task.toUpperCase()}  [${status}]`);
    });
}

function deleteTask(id) {
    if (Number.isNaN(id)) {
        console.log("usage: delete <id>");
        return;
    }
    const exists = tasks.some(t => t.taskid === id);
    if (!exists) {
        console.log(`no task with id ${id}`);
        return;
    }
    tasks = tasks.filter(t => t.taskid !== id);
    saveTasks();
    console.log(`task ${id} deleted`);
}

function updateTask(id) {
    if (Number.isNaN(id)) {
        console.log("usage: update <id>");
        return;
    }
    const task = tasks.find(t => t.taskid === id);
    if (!task) {
        console.log(`no task with id ${id}`);
        return;
    }
    task.status = !task.status;
    saveTasks();
    console.log(`task ${id} marked as ${task.status ? "done" : "pending"}`);
}

// ---- REPL loop ----
const PROMPT = "\nselect an operation:\n" +
    "  add <task text>\n" +
    "  list\n" +
    "  delete <id>\n" +
    "  update <id>\n" +
    "  exit\n" +
    "> ";

function ask() {
    rl.question(PROMPT, (answer) => {
        const parts = answer.trim().split(" ");
        const action = (parts[0] || "").toLowerCase();
        const rest = parts.slice(1).join(" ");
        const id = Number(parts[1]);

        switch (action) {
            case "add":
                addTask(rest);
                break;
            case "list":
                listTasks();
                break;
            case "delete":
                deleteTask(id);
                break;
            case "update":
                updateTask(id);
                break;
            case "exit":
            case "quit":
                rl.close();
                return;
            default:
                console.log("please enter a valid operation.");
        }
        ask(); // loop back instead of closing
    });
}

ask();