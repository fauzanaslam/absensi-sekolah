import { Link } from "react-router-dom";

type BreadCrumbProps = {
  items: { label: string; to: string }[];
};

const BreadCrumb = ({ items }: BreadCrumbProps) => {
  return (
    <nav className="breadcrumb">
      <ul className="flex">
        {items.map((item, index) => (
          <li key={index} className="text-gray-500">
            {index < items.length - 1 ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
            {index < items.length - 1 && <span className="mx-2">&#8594;</span>}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BreadCrumb;
