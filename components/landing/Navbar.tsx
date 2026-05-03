import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Pre-load the target page in the background immediately
    router.prefetch("/login");
  }, [router]);

  const handleStart = () => {
    startTransition(() => {
      router.push("/login");
    });
  };

  return (
    <>
      <div id="scroll-progress"></div>
      <nav id="nav">
        <div id="nav-logo">RAVEN</div>
        <button 
          onClick={handleStart} 
          id="nav-cta" 
          disabled={isPending}
          style={{ opacity: isPending ? 0.6 : 1 }}
        >
          {isPending ? "LOADING..." : "START"}
        </button>
      </nav>
    </>
  );
}
