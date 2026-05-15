import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { consumeOAuthRedirect } from "@/utils/oauthRedirect";

const AuthReturnHandler = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading || !user) return;

    const redirectTo = consumeOAuthRedirect();
    if (!redirectTo) return;

    const currentPath = `${location.pathname}${location.search}${location.hash}`;
    if (currentPath !== redirectTo) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, user, navigate, location.pathname, location.search, location.hash]);

  return null;
};

export default AuthReturnHandler;
