import express from  "express"
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.js";

const router = express.Router();

router.get("/post", getPosts)
router.get("/single/:id", getPost)
router.post("/upload", addPost)
router.delete("/single/:id", deletePost)
router.put("/:id", updatePost)

export default router  