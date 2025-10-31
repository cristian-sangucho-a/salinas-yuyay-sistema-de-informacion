import Link from "next/link";
import { FaFolder } from "react-icons/fa";

const CulturalNavTabs = () => {
    return (
        <div className="bg-[#D9C3A3]/20 border-b border-[#D9C3A3]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                <div className="flex">
                    {/* Categorías */}
                    <Link
                        href="/admin/categorias"
                        className="flex items-center gap-2 px-5 py-3 bg-white text-[#5A1E02] font-medium border-r border-[#D9C3A3] hover:bg-[#D9C3A3]/20 transition"
                    >
                        <FaFolder className="w-4 h-4" />
                        Categorías
                    </Link>

                    {/* Activos */}
                    <Link
                        href="/admin/activos"
                        className="flex items-center gap-2 px-5 py-3 bg-white text-[#5A1E02] font-medium border-r border-[#D9C3A3] hover:bg-[#D9C3A3]/20 transition"
                    >
                        <FaFolder className="w-4 h-4" />
                        Activos
                    </Link>

                    {/* Solicitudes */}
                    <Link
                        href="/admin/solicitudes"
                        className="flex items-center gap-2 px-5 py-3 bg-white text-[#5A1E02] font-medium border-r border-[#D9C3A3] hover:bg-[#D9C3A3]/20 transition"
                    >
                        <FaFolder className="w-4 h-4" />
                        Solicitudes
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CulturalNavTabs;
