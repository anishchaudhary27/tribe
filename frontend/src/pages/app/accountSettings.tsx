import { CloseIcon, DeleteIcon, EditIcon, LinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Switch,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import UserAvatar from "../../components/avatar";
import AvatarPicker from "../../components/avatarPicker";
import { getToken, tokenQueryId } from "../../queries/token";
import {
  readUserQuery,
  updateUserQuery,
  userQueryId,
} from "../../queries/user";

export default function AccountSettings() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [changes, setChanges] = useState(false);
  const avatarPickerProps = useDisclosure()
  const [currUser, setCurrUser] = useState({
    name: "",
    about: "",
    youtube: "",
    twitter: "",
    instagram: "",
    facebook: "",
    animateAvatar: true,
  });
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
    if (!isLoadingUser && user && user.body) {
      setCurrUser({
        name: String(user.body.Name),
        about: String(user.body.About),
        twitter: String(user.body.Twitter),
        instagram: String(user.body.Instagram),
        facebook: String(user.body.Facebook),
        youtube: String(user.body.Youtube),
        animateAvatar: Boolean(user.body.AnimateAvatar),
      });
    }
  }, [user]);
  const updateUserMutation = useMutation(userQueryId, updateUserQuery, {
    onError: (error: AxiosError) => {
      console.log(error);
      toast({
        title: "error updating profile",
        duration: 5000,
        isClosable: true,
        status: "error",
      });
    },
    onSuccess: (data) => {
      queryClient.setQueriesData(userQueryId, data);
      toast({
        title: "profile updated",
        duration: 5000,
        isClosable: true,
        status: "success",
      });
    },
  });
  const handleDiscardChanges = () => {
    if (!isLoadingUser && user && user.body) {
      setCurrUser({
        name: String(user.body.Name),
        about: String(user.body.About),
        twitter: String(user.body.Twitter),
        instagram: String(user.body.Instagram),
        facebook: String(user.body.Facebook),
        youtube: String(user.body.Youtube),
        animateAvatar: Boolean(user.body.AnimateAvatar),
      });
    }
  };
  useEffect(() => {
    if(user && currUser.animateAvatar === false && user.body.AnimateAvatar === true) {
        avatarPickerProps.onOpen()
    }
    if (user?.body) {
      if (currUser.name !== user.body.Name || currUser.about !== user.body.About
        || currUser.twitter !== user.body.Twitter || currUser.instagram !== user.body.Instagram
        || currUser.facebook !== user.body.Facebook || currUser.youtube !== user.body.Youtube
        || currUser.animateAvatar !== user.body.AnimateAvatar) {
        setChanges(true);
        return;
      }
    }
    setChanges(false);
  }, [currUser]);
  useEffect(() => {
    document.title = "account settings"
  }, [])
  const handleUpdateUserProfile = () => {
    updateUserMutation.mutate({ ...currUser, token: token?.token });
  };
  return (
    <div className="flex justify-center py-8">
      <div className="px-4 md:px-12 lg:px-20 w-full">
        <div className="flex items-center justify-between mb-2">
          <Heading color="gray.800" as="h6" size="lg">
            Profile
          </Heading>
          {changes && (
            <Stack direction={"row"}>
              <Tooltip label="discard changes">
                <IconButton
                  color={"red"}
                  aria-label="discard changes"
                  icon={<CloseIcon />}
                  onClick={handleDiscardChanges}
                />
              </Tooltip>
              <Button colorScheme={"blue"} onClick={handleUpdateUserProfile}>
                update
              </Button>
            </Stack>
          )}
        </div>
        <Divider className="mb-4" />

        <FormControl>
          <FormLabel>avatar</FormLabel>
          <div className="flex items-end">
            <UserAvatar size={100} />
            <Tooltip label="edit avatar">
              <IconButton
                rounded={"3xl"}
                aria-label="edit avatar"
                icon={<EditIcon />}
              />
            </Tooltip>
          </div>
        </FormControl>

        <FormControl display="flex" alignItems="center" className="mt-2">
          <FormLabel colorScheme={"orange"}>use default avatar: </FormLabel>
          <Switch
            isChecked={currUser.animateAvatar}
            onChange={() =>
              setCurrUser({
                ...currUser,
                animateAvatar: !currUser.animateAvatar,
              })
            }
          />
        </FormControl>

        <FormControl className="mt-2">
          <FormLabel>name</FormLabel>
          <Input
            maxW={"md"}
            value={currUser.name}
            onChange={(e) => setCurrUser({ ...currUser, name: e.target.value })}
          />
        </FormControl>

        <FormControl className="mt-2">
          <FormLabel>about</FormLabel>
          <Textarea
            maxW={"md"}
            rounded="md"
            value={currUser.about}
            onChange={(e) =>
              setCurrUser({ ...currUser, about: e.target.value })
            }
          />
        </FormControl>

        <FormControl className="mt-2">
          <FormLabel>twitter profile</FormLabel>
          <InputGroup>
            <InputLeftElement children={<LinkIcon color={"gray.300"} />} />
            <Input
              maxW={"md"}
              value={currUser.twitter}
              onChange={(e) =>
                setCurrUser({ ...currUser, twitter: e.target.value })
              }
            />
          </InputGroup>
        </FormControl>

        <FormControl className="mt-2">
          <FormLabel>facebook profile</FormLabel>
          <InputGroup>
            <InputLeftElement children={<LinkIcon color={"gray.300"} />} />
            <Input
              maxW={"md"}
              value={currUser.facebook}
              onChange={(e) =>
                setCurrUser({ ...currUser, facebook: e.target.value })
              }
            />
          </InputGroup>
        </FormControl>

        <FormControl className="mt-2">
          <FormLabel>instagram profile</FormLabel>
          <InputGroup>
            <InputLeftElement children={<LinkIcon color={"gray.300"} />} />
            <Input
              maxW={"md"}
              value={currUser.instagram}
              onChange={(e) =>
                setCurrUser({ ...currUser, instagram: e.target.value })
              }
            />
          </InputGroup>
        </FormControl>

        <FormControl className="mb-8 mt-2">
          <FormLabel>youtube channel</FormLabel>
          <InputGroup>
            <InputLeftElement children={<LinkIcon color={"gray.300"} />} />
            <Input
              maxW={"md"}
              value={currUser.youtube}
              onChange={(e) =>
                setCurrUser({ ...currUser, youtube: e.target.value })
              }
            />
          </InputGroup>
        </FormControl>

        <div className="flex items-center justify-between mb-2">
          <Stack spacing={0}>
            <Heading color="gray.800" as="h6" size="lg">
              Stripe Account
            </Heading>
            <Text>
              Connect a stripe account to enable paid subscriptions for your
              account
            </Text>
          </Stack>
          <Stack direction={"row"}>
            <Button colorScheme={"blue"}>connect</Button>
          </Stack>
        </div>
        <Divider className="mb-4" />

        <div className="shadow rounded-sm p-4 max-w-md mb-8">
          <Text colorScheme={"gray"}>No account connected</Text>
        </div>

        <Button colorScheme={"red"} rightIcon={<DeleteIcon />}>
          Delete Account
        </Button>
      </div>
      <AvatarPicker onClose={avatarPickerProps.onClose} isOpen={avatarPickerProps.isOpen} 
      resetUseAnimateAVatar={() => setCurrUser({...currUser, animateAvatar: true})} />
    </div>
  );
}
