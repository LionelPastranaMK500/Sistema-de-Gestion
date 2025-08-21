export default function SidebarSkeleton() {
    return (
        <aside className="flex flex-col bg-blue-800 w-96 min-h-screen text-white p-6">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
                <div className="animate-pulse bg-blue-700 rounded-full h-32 w-32"></div>
            </div>

            {/* Datos empresa */}
            <div className="space-y-4 mb-6">
                <div className="animate-pulse bg-blue-700 rounded-md h-12 w-full"></div>
                <div className="animate-pulse bg-blue-700 rounded-md h-12 w-full"></div>
            </div>

            {/* Menú con grid */}
            <div
                className="gap-4 grid grid-cols-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300"
                style={{ maxHeight: "calc(100vh - 300px)" }}
            >
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse bg-blue-700 rounded-lg h-20"
                    ></div>
                ))}
            </div>
        </aside>
    );
}
