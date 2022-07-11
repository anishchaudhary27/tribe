import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Link as Ln,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import UserAvatar from "../../components/avatar";
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
  const [tabSelected, setTabSelected] = useState(0);
  useEffect(() => {
    document.title = "home";
  }, []);
  return (
    <div className="flex justify-center">
      <div className="m-2 mr-10 rounded shadow-md p-4 h-max-[600px] w-[250px]  hidden lg:flex flex-col items-center">
        <UserAvatar size={100} />
        <p className="text-slate-800 text-3xl">{String(user?.body.Name)}</p>
        <p className="text-slate-600 text-md">@{String(user?.body.Handle)}</p>
        <Ln as={Link} to="/settings" colorScheme={"blue"}>
          edit
        </Ln>
      </div>
      <div className="w-11/12 md:w-8/12 lg:w-5/12 mt-2 lg:border-l-2 lg:pl-4">
        <Tabs
          variant={"soft-rounded"}
          colorScheme="blue"
          tabIndex={tabSelected}
          onChange={(e) => setTabSelected(e)}
        >
          <div className="flex justify-between">
            <TabList>
              <Tab>feed</Tab>
              <Tab>my posts</Tab>
            </TabList>
            {tabSelected === 1 && (
              <Button
                variant={"solid"}
                rightIcon={<AddIcon />}
                colorScheme="blue"
              >
                new
              </Button>
            )}
          </div>
          <TabPanels>
            <TabPanel>
            </TabPanel>
            <TabPanel>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
}
