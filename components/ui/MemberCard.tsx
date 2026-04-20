import Image from "next/image";
import Link from "next/link";
import { MapPin, Briefcase, Calendar } from "lucide-react";
import type { Profile } from "@/lib/types";

interface MemberCardProps {
  member: Profile;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <Link
      href={`/members/${member.id}`}
      className="card-green-accent p-5 hover:shadow-md transition-shadow group block"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          {member.avatar_url ? (
            <Image
              src={member.avatar_url}
              alt={member.full_name}
              width={56}
              height={56}
              className="rounded-full object-cover w-14 h-14"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-green-pale flex items-center justify-center text-green-dark font-bold text-xl font-rubik">
              {member.full_name?.[0]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-rubik font-bold text-gray-900 text-base group-hover:text-green-dark transition-colors truncate">
            {member.full_name}
          </h3>
          {member.role_in_unit && (
            <p className="text-sm text-green-mid font-medium mt-0.5 truncate">{member.role_in_unit}</p>
          )}
          <div className="mt-2 space-y-1">
            {member.service_years && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar size={12} />
                <span>שירות: {member.service_years}</span>
              </div>
            )}
            {member.current_city && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin size={12} />
                <span>{member.current_city}</span>
              </div>
            )}
            {member.profession && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Briefcase size={12} />
                <span className="truncate">{member.profession}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
