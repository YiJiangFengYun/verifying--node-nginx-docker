//Import modules
const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");

/**
 * Define constants
 **/
const nameContainerNginx = "nginx";
const nameContainerAppCluster = "app";
const numCluster = 2;
const portClusters = [3000, 3001];
const pathServer = "server";
const pathNginx = "nginx";
const pathBuild = "build";
const nameDockerFile = "Dockerfile";



/**
 * Define sub tasks.
 **/

//Copy source files to build ouput directory.
gulp.task("copy-files", gulp.series([
    () => {
        //Remove the build directory.
        return fsExtra.remove(pathBuild);
    },
    () => {
        //Copy the files in the server directory.
        return gulp.src(path.join(process.cwd(), pathServer, "**/*"))
            .pipe(gulp.dest(path.join(pathBuild, pathServer)));
    },
    () => {
        //Copy the files in the nginx directory.
        return gulp.src(path.join(process.cwd(), pathNginx, "**/*"))
            .pipe(gulp.dest(path.join(pathBuild, pathNginx)));
    },
    () => {
        //Copy the docker-compose.yml.
        return gulp.src("docker-compose.yml")
            .pipe(gulp.dest(path.join(pathBuild)));
    }
]))

//Create Dockerfile for the app (app cluster).
gulp.task("make-app-dockerfile", () => {
    return Promise.resolve()
    //Read template docker file.
    .then(() => {
        return readTextFile(path.join(pathServer, nameDockerFile));
    })
    .then((content) => {
        return content;
    })
    .then((content) => {
        return writeTextFile(path.join(pathServer, nameDockerFile));
    });
});

//Create a nginx server config for load balancing to the app cluster.
gulp.task("make-nginx-config", () => {
    return Promise.resolve();
});

//Make nginx 
gulp.task("make-nginx-dockerfile", () => {
    return Promise.resolve();
});

//Make docker compose file.
gulp.task("make-docker-compose-file", () => {
    return Promise.resolve();
});

//Run docker compose build
gulp.task("build-docker-compose", () => {
    return Promise.resolve();
});


/**
 * Define final tasks
 **/

gulp.task("build", gulp.series([
    "copy-files",
    "make-app-dockerfile",
    "make-nginx-config",
    "make-nginx-dockerfile",
    "make-docker-compose-file",
    "build-docker-compose",
]));


/**
 * Define functions
 **/
function readTextFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf8", (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

function writeTextFile(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err);
            resolve();
        })
    });
}