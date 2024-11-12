const { client } = require("./db");

const init = async () => {
  console.log("connecting to server");
  await client.connect();
  console.log("connected to server");
};

init();
