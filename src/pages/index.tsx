import Image from "next/image";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const space_grotesk = Space_Grotesk({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`text-white bg-black ${inter.className}`}>
      <h1>Hello World</h1>
    </main>
  );
}
