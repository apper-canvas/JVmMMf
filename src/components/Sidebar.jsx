import { NavLink } from 'react-router-dom';

function Sidebar() {
  const navigation = [
    { name: 'Dashboard', path: '/' },
    { name: 'Clothing Items', path: '/clothing-items' },
    { name: 'Outfits', path: '/outfits' },
  ];

  return (
    <div className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)] border-r border-gray-200">
      <div className="h-full flex flex-col">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
              end={item.path === '/'}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;