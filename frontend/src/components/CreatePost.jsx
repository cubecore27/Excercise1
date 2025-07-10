// src/components/CreatePost.jsx
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const CREATE_POST = gql`
  mutation CreatePost(
  $title: String!, 
  $content: String!, 
  $published: Boolean!
  ) {
    createPost(title: $title, content: $content, published: $published) {
      post {
        id
        title
        content
      }
    }
  }
`;

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createPost, { data, loading, error }] = useMutation(CREATE_POST);

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ variables: { title, content, published: true } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <button type="submit">Create Post</button>

      {loading && <p>Submitting...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Post created: {data.createPost.post.title}</p>}
    </form>
  );
}

export default CreatePost;
