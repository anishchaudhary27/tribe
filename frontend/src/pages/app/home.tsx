import { useEffect } from "react";
import { useQuery } from "react-query";
import { getToken, tokenQueryId } from "../../queries/token";
import { userQueryId, readUserQuery } from "../../queries/user";

export default function Home() {
  const {
    isLoading: isLoadingToken,
    error: tokenError,
    data: token,
  } = useQuery(tokenQueryId, getToken);
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: user,
  } = useQuery(userQueryId, readUserQuery(token!), {
    enabled: !!token?.authTime,
  });
  useEffect(() => {
    document.title = "home";
  }, []);
  return <div></div>;
}
