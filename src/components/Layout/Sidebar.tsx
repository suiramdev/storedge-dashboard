import {
  HiChartSquareBar,
  HiCog,
  HiReceiptTax,
  HiShoppingCart,
  HiSupport,
  HiTag,
  HiTemplate,
  HiTicket,
  HiUserGroup,
} from "react-icons/hi";
import NavMenu from "./NavMenu";

function Sidebar() {
  return (
    <aside className="fixed left-0 top-20 flex h-[calc(100%-5rem)] w-64 flex-col justify-between border-r border-r-gray-200 py-6">
      <div className="flex flex-col gap-12">
        <NavMenu title="Management">
          <NavMenu.Link to="/" label="Dashboard" icon={HiTemplate} />
          <NavMenu.Link to="/products" label="Products" icon={HiShoppingCart} />
          <NavMenu.Link to="/orders" label="Orders" icon={HiTag} />
          <NavMenu.Link to="/customers" label="Customers" icon={HiUserGroup} />
          <NavMenu.Link to="/settings" label="Settings" icon={HiCog} />
        </NavMenu>
        <NavMenu title="Marketing">
          <NavMenu.Link to="/coupons" label="Coupons" icon={HiTicket} />
          <NavMenu.Link to="/discounts" label="Discounts" icon={HiReceiptTax} />
          <NavMenu.Link
            to="/campaigns"
            label="Campaigns"
            icon={HiChartSquareBar}
          />
        </NavMenu>
      </div>
      <NavMenu>
        <NavMenu.Link to="/support" label="Support" icon={HiSupport} />
      </NavMenu>
    </aside>
  );
}

export default Sidebar;
