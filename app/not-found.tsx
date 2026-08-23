import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container size="prose" className="pt-24 pb-8">
      <h1 className="text-2xl font-medium tracking-tight">Not found</h1>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        That page does not exist — it may have moved or never been written.
      </p>
      <Link
        href="/"
        className="decoration-muted-foreground/40 hover:decoration-foreground mt-6 inline-block text-sm underline underline-offset-[3px] transition-colors"
      >
        Back home
      </Link>
    </Container>
  );
}
