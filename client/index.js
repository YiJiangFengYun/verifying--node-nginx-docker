const axios = require("axios").default;
const args = require("args");
const options = args.parse(process.argv);

if (args.sub.length) {
    let target = args.sub[0];
    Promise.resolve()
    .then(() => {
        console.log(`Make a GET request to ${target}`);
    })
    .then(() => {
        return axios.get(target);
    })
    .then((res) => {
        console.log(`Response is ${res.data}`);
        process.exit(0);
    })
    .catch((err) => {
        console.error(`Request error, ${err}`);
        process.exit(1);
    });
}