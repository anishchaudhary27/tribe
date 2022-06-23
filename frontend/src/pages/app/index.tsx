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
  ModalCloseButton,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  ModalBody,
  Input,
  FormHelperText,
} from "@chakra-ui/react";
import { Link, Outlet, useNavigate } from "react-router-dom";
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
} from "react-icons/all";
import Logo from "../../logo.png";
import Avatar from "boring-avatars";
import { auth } from "../../firebase";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function Main() {
  const [user, setUser] = useState<null | User>();
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userHandleInput, setUserHandleInput] = useState("");
  const userHandleInputRef = useRef(null);
  const userHandleInputError = !userHandleInput.match(/^[a-z1-9_]+$/);
  const navigate = useNavigate();
  useEffect(() => {
    const unSubAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (!user)
        navigate(
          "/login?redirect=" +
            (window.location.pathname.slice(0, 6) !== "/login")
            ? window.location.pathname
            : ""
        );
    });
    return unSubAuth;
  }, []);
  useEffect(() => {}, [user]);
  return (
    <div>
      <Outlet />
      <div
        className="fixed top-0 left-0 w-full bg-white flex-1 h-16 border-b-[1px] 
          border-gray-200 flex justify-between items-center p-4"
      >
        <Link to={"/home"}>
          <img src={Logo} className="h-8" />
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
          {!loading && user && (
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
                name={user ? user.uid : "Elizabeth Peratrovich"}
                colors={["#07F9A2", "#09C184", "#0A8967", "#0C5149", "#0D192B"]}
              />
            </MenuButton>
            <MenuList>
              <Link to="/home">
                <MenuItem>
                  <FiHome className="mr-2" />
                  <span>Home</span>
                </MenuItem>
              </Link>
              {!loading && user && (
                <Link to="/profile">
                  <MenuItem>
                    <CgProfile className="mr-2" />
                    <span>My Profile</span>
                  </MenuItem>
                </Link>
              )}
              {!loading && user && (
                <Link to="/settings">
                  <MenuItem>
                    <MdManageAccounts className="mr-2" />
                    <span>Account Settings</span>
                  </MenuItem>
                </Link>
              )}
              {!loading && user && (
                <Link to="/subscriptions">
                  <MenuItem>
                    <MdPayment className="mr-2" />
                    <span>My Subscriptions</span>
                  </MenuItem>
                </Link>
              )}
              {!loading && user && (
                <MenuItem onClick={() => signOut(auth)}>
                  <FiLogOut className="mr-2" />
                  <span>LogOut</span>
                </MenuItem>
              )}
              {!loading && !user && (
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
        onClose={onClose}
        initialFocusRef={userHandleInputRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select user handle</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={userHandleInputError}>
              <FormLabel htmlFor="userHandleInput">Your handle</FormLabel>
              <Input
                id="userHandleInput"
                ref={userHandleInputRef}
                placeholder="handle"
                value={userHandleInput}
                onChange={(e) => setUserHandleInput(e.target.value)}
              />
              <FormHelperText>
                handle can only contain lowercase alphabets, numbers and
                underscore( _ )
              </FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue">Register</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}