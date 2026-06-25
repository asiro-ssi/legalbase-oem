import LegiewSidebar from "./Sidebar";

export default function LegiewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen text-gray-800 bg-gray-100">
      <header className="flex-shrink-0 bg-white h-16 px-6 border-b border-gray-200 flex items-center z-50 relative">
        <img
          src="https://legal-base.vercel.app/img/legalbase-logo.svg"
          alt="LegalBase"
          className="h-8"
        />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <LegiewSidebar />
        {children}
      </div>
    </div>
  );
}
