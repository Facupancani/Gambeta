import Image from "next/image";

/**
 * Shared banner image for the institutional pages (Nosotros/FAQ/Contacto/
 * Envíos) — a wide `next/image` crop with rounded corners, consistent
 * with the rest of the site's photo treatment (product cards, PDP
 * gallery). Source photos are portrait/landscape depending on the page;
 * `objectPosition` lets each page keep the relevant part of the frame
 * in view under the fixed 21:9 crop instead of defaulting to dead-center.
 */
export function InstitutionalBanner({
  src,
  alt,
  objectPosition = "center",
}: {
  src: string;
  alt: string;
  objectPosition?: string;
}) {
  return (
    <div className="relative mt-8 aspect-[21/9] w-full overflow-hidden rounded-xl bg-secondary">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 640px) 42rem, 100vw"
        className="object-cover"
        style={{ objectPosition }}
      />
    </div>
  );
}
