import app from "./app/app.js";
import config from "./config/config.js";
import connectToDB from "./config/db.js";

await connectToDB();

const port = config.PORT || 4000;

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
