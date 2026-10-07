import Image from "next/image";
import Link from "next/link";

export default function SosLogo({ light = false }: { light?: boolean }) {
  return (
    <Link className={`sos-brand${light ? " sos-brand-light" : ""}`} href="/" aria-label="SOS Villages d’Enfants Sénégal — accueil">
      <Image className="sos-brand-image" src="/sos-villages-senegal.jpg" alt="SOS Villages d’Enfants Sénégal" width={2100} height={600} priority />
    </Link>
  );
}
