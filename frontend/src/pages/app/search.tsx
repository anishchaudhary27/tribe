import { Heading } from "@chakra-ui/react"
import { useEffect } from "react"
import Autocomplete from "../../components/autocomplete"

export default function Search() {
    useEffect(() => {
        document.title = "search"
    }, [])
    return (
        <div className="flex justify-center w-full" >
            <div className="mt-4 w-[350px] sm-[400px] md-[400px] md-[500px] lg:w-[600px]">
                <Heading size={"md"} marginBottom="2">search creators</Heading>
                <Autocomplete placeholder="search by name, handle or related topics" />
            </div>
        </div>
    )
}