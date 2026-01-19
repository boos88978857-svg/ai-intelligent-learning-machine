import Link from "next/link";

export default function PracticePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>练习区</h1>
      <p>如果你看到这页，代表 /practice 路由成功 ✅</p>
      <Link href="/">回首页</Link>
    </main>
  );
}
