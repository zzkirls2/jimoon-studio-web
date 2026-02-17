import { getSerialPosts } from "@/lib/serial/data";
import AdminSerialList from "./AdminSerialList";

export default async function AdminSerialPage() {
  const posts = await getSerialPosts();

  return (
    <div className="min-h-screen pt-24 pb-24 max-w-4xl mx-auto px-6 md:px-12">
      <h1 className="text-xl font-light text-black mb-8">연재 관리</h1>
      <AdminSerialList posts={posts} />
    </div>
  );
}
