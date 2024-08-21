export const ListItem = ({ children, NavLink }: any) => {
    return (
      <>
        <li>
          <a
            href={NavLink}
            className="flex py-2 text-base font-medium text-dark hover:text-primary dark:text-white lg:ml-10 lg:inline-flex"
          >
            {children}
          </a>
        </li>
      </>
    );
  };