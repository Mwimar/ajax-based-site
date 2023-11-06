const express = require("express");

const mongodb = require("mongodb");

const db = require("../data/database");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  const posts = await db
    .getDb()
    .collection("posts")
    .find({}, { title: 1, summary: 1, "author.name": 1 })
    .toArray();
  res.render("posts-list", { posts: posts });
});

router.get("/new-posts", async function (req, res) {
  const authors = await db.getDb().collection("authors").find().toArray();
  // console.log(authors);
  res.render("create-posts", { authors: authors });
});
router.post("/posts", async function (req, res) {
  const authorId = new ObjectId(req.body.author);
  const author = await db
    .getDb()
    .collection("authors")
    .findOne({ _id: authorId });
  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(),
    author: {
      id: authorId,
      name: author.name,
      email: author.email,
    },
  };
  const result = await db.getDb().collection("posts").insertOne(newPost);
  // console.log(result);
  res.redirect("/posts");
});

router.get("/posts/:id", async function (req, res, next) {
  let postId = req.params.id;
  // console.log("Testing");
  try {
    postId = new ObjectId(postId);
  } catch (error) {
    return next(error);
  }
  const post = await db
    .getDb()
    .collection("posts")
    .findOne({ _id: postId }, { summary: 0 });
  // console.log(post);

  console.log(postId);
  if (!post) {
    return res.status(404).render("404");
  }
  post.humanReadableDate = post.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const comments = await db
    .getDb()
    .collection("comments")
    .find({ postId: postId })
    .toArray();
  // console.log(comments);

  post.date = post.date.toISOString();
  // console.log(post);
  res.render("post-detail", { post: post, comments: comments });
});

router.get("/posts/:id/edit", async function (req, res) {
  const postId = req.params.id;
  const post = await db
    .getDb()
    .collection("posts")
    .findOne({ _id: new ObjectId(postId) }, { title: 1, summary: 1, body: 1 });

  if (!post) {
    return res.status(404).render("404");
  }
  res.render("update-post", { post: post });
});

router.post("/posts/:id/edit", async function (req, res) {
  const postId = new ObjectId(req.params.id);

  const result = await db
    .getDb()
    .collection("posts")
    .updateOne(
      { _id: postId },
      {
        $set: {
          title: req.body.title,
          summary: req.body.summary,
          body: req.body.content,
          date: new Date(),
        },
      }
    );
  res.redirect("/posts");
});

router.post("/posts/:id/delete", async function (req, res) {
  const postId = new ObjectId(req.params.id);
  const result = await db
    .getDb()
    .collection("posts")
    .deleteOne({ _id: postId });
  res.redirect("/posts");
});

router.get("/posts/:id/comments", async function (req, res) {
  const postId = new ObjectId(req.params.id);
  // console.log(postId);
  console.log("Kitu hapo");
  const comments = await db
    .getDb()
    .collection("comments")
    .find({ postId: postId })
    .toArray();
  console.log(comments);

  res.json(comments);
});

router.post("/posts/:id/comments", async function (req, res) {
  const postId = new ObjectId(req.params.id);
  const newComment = {
    postId: postId,
    title: req.body.title,
    text: req.body.text,
  };
  // console.log(newComment);

  await db.getDb().collection("comments").insertOne(newComment);

  res.json({ message: "Comment Added!" });
});

module.exports = router;
