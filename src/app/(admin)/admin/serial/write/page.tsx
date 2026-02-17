import WriteForm from "./WriteForm";

export default function WritePage() {
  return (
    <div className="min-h-screen pt-24 pb-24 max-w-3xl mx-auto px-6 md:px-12">
      <h1 className="text-xl font-light text-black mb-8">글쓰기</h1>
      <WriteForm />
    </div>
  );
}
