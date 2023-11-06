const loadCommentsBtnElement = document.getElementById("load-comments-btn");

async function fetchCommentsForPost() {
  console.log("helooooo");
  console.log(loadCommentsBtnElement.dataset);
  const postId = loadCommentsBtnElement.dataset.postid;

  // console.log("Post ID is " + postId.toString());

  const response = await fetch(`/posts/${postId}/comments`);
  const responseData = await response.json();
  console.log(responseData);
}

loadCommentsBtnElement.addEventListener("click", fetchCommentsForPost);
