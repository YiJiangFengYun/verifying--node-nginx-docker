//Import modules
const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
const log = require("fancy-log");

/**
 * Define constants
 **/
const nameContainerNginx = "nginx";
const nameContainerApp = "app";
const portApp = 8000;
const numApp = 2;
const prefixAppService = "app_";
const pathServer = "server";
const pathNginx = "nginx";
const pathBuild = "build";
const pathDockerComposeFile = "docker-compose.yml";
const nameDockerFile = "Dockerfile";
const nameNginxConfig = "default.conf";

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
    // () => {
    //     //Copy the docker-compose.yml.
    //     return gulp.src(pathDockerComposeFile)
    //         .pipe(gulp.dest(path.join(pathBuild)));
    // }
]))

//Create Dockerfile for the app (app cluster).
gulp.task("make-app-dockerfile", () => {
    return Promise.resolve()
    .then(() => {
        return lineText("FROM node")
            + lineText(`CMD npm install && npm start -- --port ${portApp}`);
    })
    .then((content) => {
        return writeTextFile(path.join(pathBuild, pathServer, nameDockerFile), content);
    });
});

//Create a nginx server config for load balancing to the app cluster.
gulp.task("make-nginx-config", () => {
    return Promise.resolve()
    //Read nginx server template file.
    .then(() => {
        return readTextFile(path.join(pathBuild, pathNginx, nameNginxConfig));
    })
    //Modify file content.
    .then((content) => {
        let index = content.indexOf("%node-servers%");
        let indexLastNewLine = content.lastIndexOf("\n", index);
        let countIndent = index - indexLastNewLine - 1;
        let indent = " ".repeat(countIndent);
        let contentNodeServer = "";
        for (let i = 0; i < numApp; ++i) {
            let no = i + 1;
            if (i) contentNodeServer += indent;
            contentNodeServer += lineText(`app_${no} ${prefixAppService}${no}:${portApp} fail_timeout=0;`);
        }
        log.info(`The node servers:`);
        log.info(`${indent}${contentNodeServer}`);
        
        content = content.replace(
            "%node-servers%", 
            contentNodeServer,
        );
        return content;
    })
    //Write new content to nginx server template file.
    .then((content) => {
        return writeTextFile(path.join(pathBuild, pathNginx, nameNginxConfig), content);
    });
});

//Make nginx 
gulp.task("make-nginx-dockerfile", () => {
    return Promise.resolve()
    .then(() => {
        //From nginx
        return lineText("FROM nginx")
            //Copy nginx config.
            + lineText("COPY ./default.conf /etc/nginx/conf.d/default.conf")
            //Copy nginx proxy config.
            // + lineText("COPY ./includes/ /etc/nginx/includes/")
            ;
    })
    .then((content) => {
        return writeTextFile(path.join(pathBuild, pathNginx, nameDockerFile), content);
    });
});

//Make docker compose file.
gulp.task("make-docker-compose-file", () => {
    return Promise.resolve();
});

//Run docker compose build
gulp.task("build-docker-compose", () => {
    return Promise.resolve()
    .then(() => {
        return "";
    })
    .then((content) => {
        return writeTextFile(path.join(pathBuild, pathDockerComposeFile), content);
    });
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
/**
 * Read content from a file.
 * @param {string} path File path.
 * @returns {Promise<string>}
 */
function readTextFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf8", (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

/**
 * Write text to a file.
 * @param {string} path File path.
 * @param {string} data File content.
 * @returns {Promise<void>}
 */
function writeTextFile(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err);
            resolve();
        })
    });
}

/**
 * Create a new line text from a text.
 * @param {string} text a origin text.
 * @returns {string}
 */
function lineText(text) {
    return text ? text + "\n" : "";
}