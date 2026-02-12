export const CATEGORIES = [
  { id: "all", name: "모두", slug: "all" },
  { id: "literary-fiction", name: "소설", slug: "literary-fiction" },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}
