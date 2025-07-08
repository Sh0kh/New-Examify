import CONFIG from "../../../../utils/Config";

export default function Info({center}) {
    return (
        <div className="max-w-xl mt-[10px]">
            <div className="w-full h-64 rounded-lg overflow-hidden shadow mb-4">
                {center.logo ? (
                    <img
                        src={`${CONFIG.API_URL}${center.logo}`}
                        alt={center.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Logo mavjud emas</span>
                    </div>
                )}
            </div>
            <div className="bg-white rounded-md shadow-sm p-4 border border-gray-200 space-y-2 text-sm">
                <h1 className="text-lg font-semibold text-gray-800">{center.name}</h1>
                <p><strong className="text-gray-500">Telefon:</strong> {center.phone || "Mavjud emas"}</p>
                <p><strong className="text-gray-500">Email:</strong> {center.email || "Mavjud emas"}</p>
                <p><strong className="text-gray-500">Manzil:</strong> {center.address || "Mavjud emas"}</p>
                <p><strong className="text-gray-500">Veb-sayt:</strong> {center.website ? (
                    <a href={center.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                        {center.website}
                    </a>
                ) : "Mavjud emas"}</p>
                <p><strong className="text-gray-500">ID:</strong> #{center.id}</p>
                <p><strong className="text-gray-500">Yaratildi:</strong> {new Date(center.created_at).toLocaleDateString('uz-UZ')}</p>

                {center.description && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                        <p className="text-gray-600">
                            <strong>Tavsif:</strong> {center.description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}