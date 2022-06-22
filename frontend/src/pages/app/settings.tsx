import { useEffect } from "react"

function Settings() {
    useEffect(() => {
        document.title = "Settings"
    },[])
    return (
        <div>
            Settings
        </div>
    )
}

export default Settings