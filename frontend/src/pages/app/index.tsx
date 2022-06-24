import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  ModalBody,
  Input,
  FormHelperText,
  useToast
} from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";
import {
  AiOutlineMessage,
  FiSearch,
  FiLogOut,
  FiGithub,
  FiHome,
  MdManageAccounts,
  CgProfile,
  MdPayment,
  FiLogIn,
  GrRefresh
} from "react-icons/all";
import Logo from "../../logo.svg";
import Avatar from "boring-avatars";
import { auth } from "../../firebase";
import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { tokenQueryId, getToken } from "../../queries/token";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { readUserQuery, userQueryId, createUserQuery } from "../../queries/user";

export default function Main() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast()
  const [userSignUpInput, setUserSignUpInput] = useState({
    name: "",
    handle: "",
  });
  const userHandleInputRef = useRef(null);
  const userHandleInputError = !userSignUpInput.handle.match(/^[a-z1-9_]+$/);
  const userNameInputError = !userSignUpInput.name.match(/^[a-zA-Z ]+$/);
  const queryClient = useQueryClient()
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
  const createUserMutation = useMutation("user",createUserQuery,{
    onSuccess: (newUser) => {
      queryClient.setQueriesData(userQueryId, newUser)
    },
    onError: (error) => {
      console.error(error)
      toast({
        title: "error creating user",
        status: "error",
        duration: 5000,
        isClosable: true
      })
    },
    onSettled: () => {
      onClose()
    }
  })
  const handleCreateUser = () => {
    if(!userHandleInputError && !userHandleInputError && createUserMutation.isIdle) {
      createUserMutation.mutate({handle: userSignUpInput.handle, name: userSignUpInput.name, token: token?.token})
    }
    else {
      toast({
        title: "invalid input",
        status: "error",
        duration: 5000,
        isClosable: true
      })
    }
  }
  useEffect(()=>{
    if(user) {
      if(user.status==404) {
        onOpen()
      }
    }
  },[user])
  return (
    <div>
      <Outlet />
      <div
        className="fixed top-0 left-0 w-full bg-white flex-1 h-16 border-b-[1px] 
          border-gray-200 flex justify-between items-center p-4"
      >
        <Link to={"/home"}>
          <img src={Logo} className="h-12" />
        </Link>
        <Stack isInline>
          <Tooltip label="refresh" fontSize={"md"}>
            <IconButton
              variant={"ghost"}
              aria-label="messages"
              size="lg"
              isRound
              icon={<GrRefresh />}
            />
          </Tooltip>
          <Tooltip label="search" fontSize={"md"}>
            <Link to="/search">
              <IconButton
                variant={"ghost"}
                aria-label="search creators"
                size="lg"
                isRound
                icon={<FiSearch />}
              />
            </Link>
          </Tooltip>
          {!isLoadingToken && token && (
            <Tooltip label="messages" fontSize={"md"}>
              <Link to="/messages">
                <IconButton
                  variant={"ghost"}
                  aria-label="messages"
                  size="lg"
                  isRound
                  icon={<AiOutlineMessage />}
                />
              </Link>
            </Tooltip>
          )}
          <Menu>
            <MenuButton as={IconButton} rounded="3xl">
              <Avatar
                size={40}
                variant="beam"
                name={
                  token && token.claims["name"]
                    ? `john snow${token.claims.name?.toString()}`
                    : "Elizabeth Peratrovich"
                }
                colors={["#FFAD08", "#EDD75A", "#73B06F", "#0C8F8F", "#405059"]}
              />
            </MenuButton>
            <MenuList>
              <Link to="/home">
                <MenuItem>
                  <FiHome className="mr-2" />
                  <span>Home</span>
                </MenuItem>
              </Link>
              {!isLoadingToken && token && (
                <Link to="/profile">
                  <MenuItem>
                    <CgProfile className="mr-2" />
                    <span>My Profile</span>
                  </MenuItem>
                </Link>
              )}
              {!isLoadingToken && token && (
                <Link to="/settings">
                  <MenuItem>
                    <MdManageAccounts className="mr-2" />
                    <span>Account Settings</span>
                  </MenuItem>
                </Link>
              )}
              {!isLoadingToken && token && (
                <Link to="/subscriptions">
                  <MenuItem>
                    <MdPayment className="mr-2" />
                    <span>My Subscriptions</span>
                  </MenuItem>
                </Link>
              )}
              {!isLoadingToken && token && (
                <MenuItem onClick={() => signOut(auth)}>
                  <FiLogOut className="mr-2" />
                  <span>LogOut</span>
                </MenuItem>
              )}
              {!isLoadingToken && token && (
                <Link to="/login">
                  <MenuItem>
                    <FiLogIn className="mr-2" />
                    <span>Login</span>
                  </MenuItem>
                </Link>
              )}
              <MenuItem
                onClick={() =>
                  window.open("https://github.com/anishchaudhary27/tribe")
                }
              >
                <FiGithub className="mr-2" />
                <span>Source Code</span>
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => {}}
        initialFocusRef={userHandleInputRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome🥳!!</ModalHeader>
          <ModalBody pb={6}>
            <FormControl isInvalid={userHandleInputError}>
              <FormLabel htmlFor="userHandleInput">Your handle</FormLabel>
              <Input
                id="userHandleInput"
                ref={userHandleInputRef}
                placeholder="handle"
                value={userSignUpInput.handle}
                onChange={(e) =>
                  setUserSignUpInput({
                    ...userSignUpInput,
                    handle: e.target.value,
                  })
                }
              />
              <FormHelperText>
                handle can only contain lowercase alphabets, numbers and
                underscore( _ )
              </FormHelperText>
            </FormControl>
            <FormControl isInvalid={userNameInputError} className="mt-4">
              <FormLabel htmlFor="userNameInput">Name</FormLabel>
              <Input
                id="userNameInput"
                placeholder="name"
                value={userSignUpInput.name}
                onChange={(e) =>
                  setUserSignUpInput({
                    ...userSignUpInput,
                    name: e.target.value,
                  })
                }
              />
              <FormHelperText>
                Enter name you want for others to see.
              </FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button disabled={!createUserMutation.isIdle} colorScheme="blue" onClick={handleCreateUser}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
