import { createFileRoute } from "@tanstack/react-router";
import { productDescription } from "@spaceobject/core";
import { Brand } from "@spaceobject/ui/components/brand";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main>
      <Brand />
      <p>{productDescription}</p>
    </main>
  );
}
