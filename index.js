const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const blog = require("./models/Blog");
const { checkAuthentication } = require("./middleware/authntication");
const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb://127.0.0.1:27017/blogfy").then(() => {
  console.log("database connected sucessfully");
});
app.set("view engine", "ejs");
app.use(express.static(path.resolve("./public")))
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthentication("token"));
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

app.get("/", async (req, res) => {
  const allBlog = await blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlog,
  });
});

app.listen(PORT, () => {
  console.log(`App is Runing at ${PORT}`);
});
