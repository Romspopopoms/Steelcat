import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-12 h-12">
        <Image
          src="/LogoSteelCat.jpg"
          alt="SteelCat Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <span className="text-2xl font-bold tracking-tight">SteelCat</span>
    </div>
  );
}
