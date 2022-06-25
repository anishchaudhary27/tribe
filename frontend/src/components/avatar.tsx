import Avatar from "boring-avatars";
import { useQuery } from "react-query";
import { getToken, tokenQueryId } from "../queries/token";
import { readUserQuery, userQueryId } from "../queries/user";

interface Props {
  size: number;
}

export default function UserAvatar(props: Props) {
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
  return (
    <div>
      {!user && (
        <Avatar
          size={props.size}
          variant="beam"
          name={"Elizabeth Peratro"}
          colors={["#FFAD08", "#EDD75A", "#73B06F", "#0C8F8F", "#405059"]}
        />
      )}
      {user && user.body.AnimateAvatar === false && (
        <ImageAvatar size={props.size} uid={user.body?.UID} />
      )}
      {user && user.body.AnimateAvatar === true && (
        <Avatar
          size={props.size}
          variant="beam"
          name={user.body.Name}
          colors={["#FFAD08", "#EDD75A", "#73B06F", "#0C8F8F", "#405059"]}
        />
      )}
    </div>
  );
}

interface Props2 {
  size: number;
  uid: string;
}

function ImageAvatar(props: Props2) {
  if (props.size === 40) {
    return (
      <div className="h-[40px] w-[40px] rounded-full bg-gray-500">
        <img
          className="h-[40px] w-[40px] rounded-full bg-gray-500"
          src={`${import.meta.env.VITE_API_ENDPOINT}/avatar/${props.uid}`}
        />
      </div>
    );
  } else if (props.size === 100) {
    return (
      <div className="h-[100px] w-[100px] rounded-full bg-gray-500">
        <img
          className="h-[100px] w-[100px] rounded-full bg-gray-500"
          src={`${import.meta.env.VITE_API_ENDPOINT}/avatar/${props.uid}`}
        />
      </div>
    );
  }
  return <img />;
}
