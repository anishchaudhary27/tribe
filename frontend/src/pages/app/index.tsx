import { Avatar, IconButton, Stack } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";
import {BsSearch} from 'react-icons/bs'
import {AiOutlineMessage} from "react-icons/ai"
import {CgProfile} from 'react-icons/cg'
import Logo from '../../logo.png'

const profileImage = "https://www.freepik.com/premium-vector/cute-fox-sleeping-cartoon-icon-illustration-animal-icon-concept-isolated-premium-flat-cartoon-style_9431830.htm"

export default function Main() {
    return (
        <div>
            <div className="flex-1 h-16 border-b-[1px] border-gray-200 flex justify-between items-center p-4">
                <Link to={"/"}>
                    <img src={Logo}  className="h-8"/>
                </Link>
                <Stack isInline>
                    <IconButton variant={"ghost"} aria-label="search creators" size="lg" isRound icon={<BsSearch/>}/>
                    <IconButton variant={"ghost"} aria-label="messages" size="lg" isRound icon={<AiOutlineMessage/>}/>
                    <IconButton bgColor={"blue.200"} aria-label="profile" size="lg" isRound icon={<CgProfile/>}/>
                </Stack>
            </div>
            <Outlet/>
        </div>
    )
}