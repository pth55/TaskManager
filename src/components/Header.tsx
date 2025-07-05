import { LogOut, CheckSquare } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ui/theme-toggle"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export function Header() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleHomeClick = () => {
    navigate("/")
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div 
          className="flex items-center gap-2 text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleHomeClick}
        >
          <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          TaskMaster
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}