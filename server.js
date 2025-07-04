const express = require('express');
const connectDB = require('./config/db');
const userRoute = require("./routes/user_route");
const attendanceRoute = require("./routes/attendanceRoute")
const adminRouter = require('./routes/adminRoute')

const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(express.json());

app.use(cors())
app.use("/user", userRoute);
app.use("/attendance", attendanceRoute);
app.use('/admin', adminRouter)

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on http://localhost:${PORT}`);
});
