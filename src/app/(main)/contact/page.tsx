export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 max-w-7xl mx-auto px-6 md:px-12">
      <h1 className="text-4xl font-light mb-12">Contact</h1>
      <p className="text-neutral-500 font-light mb-6">
        문의사항이 있으시면 아래 이메일로 연락주세요.
      </p>
      <a
        href="mailto:zzkirls2@gmail.com"
        className="text-lg text-neutral-900 underline underline-offset-4 hover:text-accent transition-colors"
      >
        zzkirls2@gmail.com
      </a>
    </div>
  );
}
