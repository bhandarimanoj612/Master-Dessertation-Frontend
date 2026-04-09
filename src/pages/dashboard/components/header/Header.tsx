

interface HeaderProps {
  fullName?: string | null;
}

const Header = ({ fullName }: HeaderProps) => {
  return (
    <div className="rounded-3xl border border-white/20 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900 p-6 text-white shadow-2xl">
      <h1 className="text-2xl font-bold md:text-3xl">
        Welcome, <span className="text-blue-300">{fullName || "User"}</span>
      </h1>
      <p className="mt-2 text-sm text-slate-200 md:text-base">
        Your personal dashboard overview for repairs, revenue, inventory, customers, and invoices.
      </p>
    </div>
  );
};

export default Header;