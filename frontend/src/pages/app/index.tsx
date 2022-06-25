import {
  IconButton,
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
  FiSearch,
  GrNotification,
} from "react-icons/all";
import Logo from "../../logo.svg";
import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { tokenQueryId, getToken } from "../../queries/token";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { readUserQuery, userQueryId, createUserQuery } from "../../queries/user";
import { AxiosError } from "axios";
import AppBarMenu from "../../components/appbarMenu";

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
      onClose()
    },
    onError: (error:AxiosError) => {
      console.error(error)
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true
      })
    }
  })
  const handleCreateUser = () => {
    if(!userHandleInputError && !userHandleInputError && !createUserMutation.isLoading) {
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
          {/* {!isLoadingToken && token && (
            <Tooltip label="notifications" fontSize={"md"}>
                <IconButton
                  variant={"ghost"}
                  aria-label="notifications"
                  size="lg"
                  isRound
                  icon={<GrNotification />}
                />
            </Tooltip>
          )} */}
          <AppBarMenu token={token} isLoadingToken={isLoadingToken} signOut={signOut}/>
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
                underscore( _ ). <br/>
                You can't change handle once choosen.
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
            <Button disabled={createUserMutation.isLoading} colorScheme="blue" onClick={handleCreateUser}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
