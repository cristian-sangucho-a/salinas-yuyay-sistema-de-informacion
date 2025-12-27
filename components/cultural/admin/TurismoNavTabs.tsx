import Link from "next/link";
import { FaCalendarAlt, FaLandmark } from "react-icons/fa";

const TurismoNavTabs = () => {
  return (
    <div className="bg-[#D9C3A3]/20 border-b border-[#D9C3A3]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex">
          <Link
            href="/admin/eventos"
            className="flex items-center gap-2 px-5 py-3 bg-white text-[#5A1E02] font-medium border-r border-[#D9C3A3] hover:bg-[#D9C3A3]/20 transition"
          >
            <FaCalendarAlt className="w-4 h-4" />
            Eventos
          </Link>

          <Link
            href="/admin/salas_museo"
            className="flex items-center gap-2 px-5 py-3 bg-white text-[#5A1E02] font-medium border-r border-[#D9C3A3] hover:bg-[#D9C3A3]/20 transition"
          >
            <FaLandmark className="w-4 h-4" />
            Salas del Museo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TurismoNavTabs;
