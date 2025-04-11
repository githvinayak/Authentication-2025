import UserDropdown from "./UserDropdown";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <h1 className="text-xl font-bold">MyApp</h1>
      <UserDropdown />
    </header>
  );
};

export default Header;
