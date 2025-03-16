import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/mern-blog")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Blog = mongoose.model("Blog", blogSchema);

app.get("/blogs", async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

app.post("/blogs", async (req, res) => {
  const newBlog = new Blog(req.body);
  await newBlog.save();
  res.json(newBlog);
});

app.put("/blogs/:id", async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(blog);
});

app.delete("/blogs/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.send("Blog deleted");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
