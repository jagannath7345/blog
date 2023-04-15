const Blog = require("../models/Blog");

const addBlog = async (req, res) => {
  const { title, body } = req.body;
  try {
    const blog = await Blog.create({
      title: title,
      body: body,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = addBlog;
