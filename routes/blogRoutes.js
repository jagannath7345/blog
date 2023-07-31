const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const addBlog = require("../controllers/blogController");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");

router.get("/add-blog", (req, res) => {
  return res.render("addblog", {
    user: req.user,
  });
});

const stroage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: stroage });

router.post("/", upload.single("coverImageURL"), addBlog);
router.get("/:id", async (req, res) => {
  const userBlog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  console.log(comments);
  return res.render("blog", {
    user: req.user,
    blog: userBlog,
    comments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});
router.get("/delete/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  return res.redirect("/");
});
module.exports = router;
