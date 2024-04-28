import useSWR, { mutate } from "swr";

interface Post {
  id: number;
  title: string;
  liked: boolean;
}

const LikeButton = ({ postId }: { postId: number }) => {
  const { data: post, mutate: mutatePost } = useSWR<Post>(
    `/api/posts/${postId}`
  );

  const handleLikeClick = async () => {
    mutatePost({ ...post, liked: !post?.liked }, false);

    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ liked: !post?.liked }),
      });

      mutatePost();
    } catch (error) {
      console.error("Failed to update like status:", error);
      mutatePost(post, false);
    }
  };

  return (
    <button onClick={handleLikeClick}>{post?.liked ? "Unlike" : "Like"}</button>
  );
};
