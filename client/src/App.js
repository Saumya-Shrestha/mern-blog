import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/blogs")
      .then((response) => setBlogs(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const addBlog = () => {
    if (editId) {
      axios
        .put(`http://localhost:5000/blogs/${editId}`, { title, content })
        .then((response) => {
          setBlogs(
            blogs.map((blog) => (blog._id === editId ? response.data : blog))
          );
          setEditId(null);
          setTitle("");
          setContent("");
        })
        .catch((error) => console.error("Error updating blog:", error));
    } else {
      axios
        .post("http://localhost:5000/blogs", { title, content })
        .then((response) => setBlogs([...blogs, response.data]))
        .catch((error) => console.error("Error adding blog:", error));
    }
  };

  const editBlog = (id, blogTitle, blogContent) => {
    setEditId(id);
    setTitle(blogTitle);
    setContent(blogContent);
  };

  const deleteBlog = (id) => {
    axios
      .delete(`http://localhost:5000/blogs/${id}`)
      .then(() => setBlogs(blogs.filter((blog) => blog._id !== id)))
      .catch((error) => console.error("Error deleting blog:", error));
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        CRUD Blog Application with MERN Stack
      </Typography>
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Content"
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={addBlog}
        style={{ marginTop: "20px" }}
      >
        {editId ? "Update Blog" : "Add Blog"}
      </Button>
      <List>
        {blogs.map((blog) => (
          <ListItem key={blog._id}>
            <ListItemText primary={blog.title} secondary={blog.content} />
            <Box>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => editBlog(blog._id, blog.title, blog.content)}
              >
                <Edit />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteBlog(blog._id)}
              >
                <Delete />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;
