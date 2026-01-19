import Link from "next/link";

export default function PracticePage() {
  return (
    <main>
      <h1>练习区</h1>
      <p>请选择你要练习的内容：</p>

      <ul>
        <li>
          <Link href="/practice/basic">
            基础练习
          </Link>
        </li>
        <li>
          <Link href="/practice/advanced">
            进阶练习
          </Link>
        </li>
      </ul>
    </main>
  );
}