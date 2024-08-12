import { Navbar } from "@/components/navbar";
import { Share } from "@/components/share";

export default function Home() {
  return (
    <div className="bg-slate-800 flex flex-col items-center h-screen p-5">
      <Navbar />
      <Share />
    </div>
  );
}
