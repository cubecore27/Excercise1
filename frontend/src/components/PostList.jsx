// src/components/PostList.jsx
import { gql, useQuery } from "@apollo/client";

const GET_POSTS = gql`
  query {
    allPosts {
      id
      title
      content
      published
      createdAt
    }
  }
`;

function PostList() {
  const { loading, error, data } = useQuery(GET_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts.</p>;

  return (
    <ul>
      {data.allPosts.map((post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </li>
      ))}
    </ul>
  );
}

export default PostList;
