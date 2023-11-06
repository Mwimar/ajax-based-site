const loadCommentsBtnElement = document.getElementById("load-comments-btn");
const commentsSectionElement = document.getElementById("comments");
const commentsFormElement = document.querySelector("#comments-section form");
const commentTitleElement = document.getElementById("title");
const commentTextElement = document.getElementById("text");

function createCommentList(comments) {
  const commentListElement = document.createElement("ol");
  for (const comment of comments) {
    const commentElement = document.createElement("li");
    commentElement.innerHTML = `
    <article class="comment-item">
      <h2>${comment.title}</h2>
      <p>${comment.text}</p>
    </article>

    `;
    commentListElement.appendChild(commentElement);
  }
  return commentListElement;
}

function saveComment(event) {
  event.preventDefault();

  const enteredTitle = commentTitleElement.value;
  const enteredText = commentTextElement.value;
  console.log(enteredTitle, enteredText);
}

async function fetchCommentsForPost() {
  console.log(loadCommentsBtnElement.dataset);
  const postId = loadCommentsBtnElement.dataset.postid;

  const response = await fetch(`/posts/${postId}/comments`);
  const responseData = await response.json();
  // console.log(responseData);
  const commentsListElement = createCommentList(responseData);
  commentsSectionElement.innerHTML = "";
  commentsSectionElement.appendChild(commentsListElement);
}

loadCommentsBtnElement.addEventListener("click", fetchCommentsForPost);
commentsFormElement.addEventListener("submit", saveComment);
