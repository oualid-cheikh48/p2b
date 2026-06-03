require("dotenv").config();
const app = require("./src/app");
const { initBucket } = require("./src/config/minio");

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 ETNAir API running on port ${PORT}`);
 // await initBucket();
});
