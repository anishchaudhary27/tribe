import { Button, Stack } from "@chakra-ui/react";
import Avatar from "boring-avatars";
import { useEffect } from "react";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { getProfile, profileQueryid } from "../../queries/profile";

export default function profile() {
  const handle = window.location.pathname.split("/", 3)[2];
  const {
    isLoading: isLoadingProfile,
    data: profile,
    error: errorProfile,
  } = useQuery([profileQueryid, handle], () => getProfile(handle));
  useEffect(() => {
    document.title = handle;
  }, []);
  return (
    <div className="w-full flex flex-col items-center">
      {profile && Boolean(profile.body.AnimateAvatar) && (
        <div className="mt-4">
          <Avatar
            size={150}
            variant="beam"
            name={String(profile.body.Name)}
            colors={["#FFAD08", "#EDD75A", "#73B06F", "#0C8F8F", "#405059"]}
          />
        </div>
      )}
      {profile && Boolean(profile.body.AnimateAvatar) === false && (
        <img
          className="h-[150px] w-[150px] rounded-full bg-gray-500 mt-4"
          src={`${import.meta.env.VITE_API_ENDPOINT}/avatar/${
            profile.body.UID
          }`}
        />
      )}
      <p className=" text-4xl text-slate-800 mt-2 font-semibold">{String(profile?.body.Name)}</p>
      <div className="flex flex-row mt-1"> 
        <Link to={String(profile?.body.Youtube)} className="px-1">
          <FiYoutube size="20" color="red"/>
        </Link>
        <Link to={String(profile?.body.Facebook)} className="px-1">
          <FiFacebook size="20" color="blue"/>
        </Link>
        <Link to={String(profile?.body.Instagram)} className="px-1">
          <FiInstagram size="20" color="magenta"/>
        </Link>
        <Link to={String(profile?.body.Twitter)} className="px-1">
          <FiTwitter size="20" color="skyBlue"/>
        </Link>
      </div>
      <p className=" text-lg text-slate-600">@{String(profile?.body.Handle)}</p>
      <Button colorScheme={"teal"} marginTop="2">JOIN</Button>
      <div className="shadow rounded-sm px-8 py-4 my-4 w-11/12 md:w-8/12 lg:w-5/12 ">
        <p className="text-2xl font-semibold text-slate-800">about</p>
        <p className="text-lg text-slate-900">{String(profile?.body.About)}</p>
      </div>
      <div className="shadow rounded-sm px-8 py-4 mb-4 w-11/12 md:w-8/12 lg:w-5/12 flex  justify-between ">
        <div className="flex flex-col items-center flex-[0.8]" >
          <p  className="text-lg font-bold text-slate-800">Posts</p>
          <p className="text-2xl text-slate-700" >{Number(profile?.body.Posts)}</p>
        </div>
        <div className="flex flex-col items-center flex-[1.2]" >
          <p  className="text-lg font-bold text-slate-800">Supporters</p>
          <p className="text-2xl text-slate-700" >{Number(profile?.body.Supporters)}</p>
        </div>
        <div className="flex flex-col items-center flex-[1.1]" >
          <p  className="text-lg font-bold text-slate-800">Supported</p>
          <p className="text-2xl text-slate-700">{Number(profile?.body.Supported)}</p>
        </div>
      </div>
    </div>
  );
}
