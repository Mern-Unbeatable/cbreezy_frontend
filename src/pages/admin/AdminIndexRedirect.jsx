import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext, ROLES } from "../../context/AuthContext";

const AdminIndexRedirect = () => {
  const { role } = useContext(AuthContext);

  if (role === ROLES.SUB_ADMIN) {
    return <Navigate to="/admin/listings" replace />;
  }

  return <Navigate to="/admin/dashboard" replace />;
};

export default AdminIndexRedirect;
