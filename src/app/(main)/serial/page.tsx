import { getSerialPosts } from "@/lib/serial/data";
import SerialListContent from "@/components/SerialListContent";

export default async function SerialPage() {
  const posts = await getSerialPosts();

  return <SerialListContent posts={posts} />;
}
