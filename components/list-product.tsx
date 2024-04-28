import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  description: string;
  created_at: Date;
  photo: string;
  id: number;
}

export default function ListProduct({
  title,
  description,
  created_at,
  photo,
  id,
}: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image fill={true} src={photo} alt={title} className="object-cover" />
      </div>
      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-2xl font-semibold">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg">{description}</span>
      </div>
    </Link>
  );
}
