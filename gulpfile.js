//Import modules
const gulp = require("gulp");
const fs = require("fs");

//Define constants
const nameContainerNginx = "nginx";
const nameContainerAppCluster = "app";
const numCluster = 2;
const portClusters = [3000, 3001];


//Define tasks.

//Create Dockerfile for the app (app cluster).
gulp.task("make-app-dockerfile", () => {
    return Promise.resolve()
    //Read template docker file.
    .then(() => {
        
    });
});

//Create a nginx server config for load balancing to the app cluster.
gulp.task("make-nginx-config", () => {

});

//Make nginx 
gulp.task("make-nginx-dockerfile", () => {

});

//Make docker compose file.
gulp.task("make-docker-compose-file", () => {

});

//Run docker compose build
gulp.task("build-docker-compose", () => {

});




//Define functions
function readTextFile(path) {
    return Promise((resolve, reject) => {
        fs.readFile(path, "utf8", (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

function writeTextFile(path, data) {
    return Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err);
            resolve();
        })
    });
}