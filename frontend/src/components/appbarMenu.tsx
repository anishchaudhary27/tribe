import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Avatar from "boring-avatars";
import { CgProfile } from "react-icons/cg";
import { FiGithub, FiHome, FiLogIn, FiLogOut } from "react-icons/fi";
import { MdManageAccounts, MdPayment } from "react-icons/md";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { Auth, IdTokenResult } from "firebase/auth";
import UserAvatar from "./avatar";
import { SettingsIcon } from "@chakra-ui/icons";

interface Props {
  token: IdTokenResult | undefined | null;
  isLoadingToken: boolean;
  signOut: (auth: Auth) => void;
}

export default function AppBarMenu(props: Props) {
  const { token, isLoadingToken, signOut } = props;
  return (
    <Menu>
      <MenuButton as={IconButton} rounded="3xl">
        <UserAvatar size={40}/>
      </MenuButton>
      <MenuList>
        <Link to="/home">
          <MenuItem>
            <FiHome className="mr-2" />
            <span>home</span>
          </MenuItem>
        </Link>
        {!isLoadingToken && token && (
          <Link to="/settings">
            <MenuItem>
              <SettingsIcon className="mr-2" />
              <span>account settings</span>
            </MenuItem>
          </Link>
        )}
        {!isLoadingToken && token && (
          <MenuItem onClick={() => signOut(auth)}>
            <FiLogOut className="mr-2" />
            <span>logout</span>
          </MenuItem>
        )}
        {!isLoadingToken && !token && (
          <Link to="/login">
            <MenuItem>
              <FiLogIn className="mr-2" />
              <span>login</span>
            </MenuItem>
          </Link>
        )}
        <MenuItem
          onClick={() =>
            window.open("https://github.com/anishchaudhary27/tribe")
          }
        >
          <FiGithub className="mr-2" />
          <span>source code</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
