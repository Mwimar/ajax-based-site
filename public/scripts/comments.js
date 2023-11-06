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

async function saveComment(event) {
  event.preventDefault();
  const postId = commentsFormElement.dataset.postid;

  const enteredTitle = commentTitleElement.value;
  const enteredText = commentTextElement.value;
  const comment = { title: enteredTitle, text: enteredText };
  const response = await fetch(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(comment),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    fetchCommentsForPost();
  } else {
    alert("Could Not Send Comment!");
  }
}

async function fetchCommentsForPost() {
  console.log(loadCommentsBtnElement.dataset);
  const postId = loadCommentsBtnElement.dataset.postid;

  const response = await fetch(`/posts/${postId}/comments`);
  const responseData = await response.json();
  if (responseData && responseData.length > 0) {
    const commentsListElement = createCommentList(responseData);
    commentsSectionElement.innerHTML = "";
    commentsSectionElement.appendChild(commentsListElement);
  } else {
    commentsSectionElement.firstElementChild.textContent =
      "We could not Find any comments, Try adding";
  }
}

loadCommentsBtnElement.addEventListener("click", fetchCommentsForPost);
commentsFormElement.addEventListener("submit", saveComment);
