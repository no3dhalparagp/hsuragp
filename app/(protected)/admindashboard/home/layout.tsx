interface adminhomelayoutprops {
  children: React.ReactNode;
  tenderstatus: React.ReactNode;
  visitor: React.ReactNode;
  techev: React.ReactNode;
  nitCount: React.ReactNode;
  aocwork: React.ReactNode;
  cancelwork: React.ReactNode;
  publishwork: React.ReactNode;
  retender: React.ReactNode;
  warishapp: React.ReactNode;
  worksummery: React.ReactNode;
}

export default function Adminhomelayoutprops({
  warishapp,
  children,
  visitor,
  nitCount,
  aocwork,
  worksummery,
  tenderstatus,
  techev,
  cancelwork,
  publishwork,
  retender,
}: adminhomelayoutprops) {
  return (
    <div className="flex flex-col p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-800 pb-3 border-b-2 border-blue-200">
          Dashboard Overview
          <span className="block mt-1 text-sm font-normal text-blue-600">
            Comprehensive project insights and metrics
          </span>
        </h1>
      </div>

      {/* Main Content */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-7 hover:shadow-2xl transition-shadow duration-300">
        {children}
      </div>
    </div>
  );
}
