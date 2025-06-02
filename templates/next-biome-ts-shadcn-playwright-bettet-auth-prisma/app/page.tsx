import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h1>Welcome</h1>
      <Link href="/about">About</Link>
    </div>
  );
}
