import NavLink from "./NavLink";

type Props = {
  title?: string;
  children: React.ReactNode;
};

function NavMenu({ title, children }: Props) {
  return (
    <nav className="flex flex-col">
      {title && (
        <span className="mb-4 px-6 text-xs font-medium text-gray-500">
          {title}
        </span>
      )}
      <ul className="flex flex-col">{children}</ul>
    </nav>
  );
}

NavMenu.Link = NavLink;

export default NavMenu;
