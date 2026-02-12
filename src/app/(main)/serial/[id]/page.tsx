import Link from "next/link";
import {
  getSerialPostById,
  getSeriesPosts,
  getAdjacentPosts,
} from "@/lib/serial/data";
import SerialDetailContent from "@/components/SerialDetailContent";

export default async function SerialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getSerialPostById(id);

  if (!post) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <p className="text-black mb-6">글을 찾을 수 없습니다.</p>
        <Link
          href="/serial"
          className="text-sm text-black underline underline-offset-4"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const [seriesPosts, adjacent] = await Promise.all([
    post.series_name ? getSeriesPosts(post.series_name) : Promise.resolve([]),
    getAdjacentPosts(post.published_at),
  ]);

  return (
    <SerialDetailContent
      post={post}
      seriesPosts={seriesPosts}
      prevPost={adjacent.prev}
      nextPost={adjacent.next}
    />
  );
}
