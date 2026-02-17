import { getSerialPostById } from "@/lib/serial/data";
import { notFound } from "next/navigation";
import WriteForm from "../../write/WriteForm";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getSerialPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-24 pb-24 max-w-3xl mx-auto px-6 md:px-12">
      <h1 className="text-xl font-light text-black mb-8">글 수정</h1>
      <WriteForm initialData={post} />
    </div>
  );
}
