import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

const server = jsonServer.create();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();
const port = 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const users = router.db.get("users").value();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const userForToken = {
      username: user.username,
      id: user.id,
    };
    const token = jwt.sign(userForToken, "your_secret_key");
    res.json({ id: user.id, username: user.username, name: user.name, token });
  } else {
    res.status(401).json({ error: "invalid username or password" });
  }
});

const verifyToken = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7);
    try {
      const decodedToken = jwt.verify(token, "your_secret_key");
      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
};

server.post("/api/blogs", verifyToken, (req, res) => {
  const blogs = router.db.get("blogs").value();
  const maxId = blogs.length > 0 ? Math.max(...blogs.map((b) => b.id)) : 0;

  const newBlog = { ...req.body, id: maxId + 1, userId: req.user.id };
  router.db.get("blogs").push(newBlog).write();

  const user = router.db.get("users").find({ id: req.user.id }).value();
  if (user) {
    user.blogs = user.blogs.concat(newBlog.id);
    router.db.get("users").find({ id: req.user.id }).assign(user).write();
  }

  res.status(201).json(newBlog);
});

server.put("/api/blogs/:id", verifyToken, (req, res) => {
  const blogId = parseInt(req.params.id);
  const blog = router.db.get("blogs").find({ id: blogId }).value();

  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }

  const updatedBlog = {
    ...blog,
    likes: req.body.likes !== undefined ? req.body.likes : blog.likes,
    title: req.body.title || blog.title,
    author: req.body.author || blog.author,
    url: req.body.url || blog.url,
  };

  router.db.get("blogs").find({ id: blogId }).assign(updatedBlog).write();
  res.json(updatedBlog);
});

server.delete("/api/blogs/:id", verifyToken, (req, res) => {
  const blogId = parseInt(req.params.id);
  const blog = router.db.get("blogs").find({ id: blogId }).value();

  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }

  const user = router.db.get("users").find({ id: blog.userId }).value();
  if (user) {
    user.blogs = user.blogs.filter(
      (blogId) => blogId !== parseInt(req.params.id)
    );
    router.db.get("users").find({ id: blog.userId }).assign(user).write();
  }

  router.db.get("blogs").remove({ id: blogId }).write();
  res.status(204).end();
});

server.get("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = router.db.get("users").find({ id: userId }).value();

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const blogs = router.db.get("blogs").filter({ userId: userId }).value();
  res.json({ ...user, blogs });
});

server.use("/api", router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
