import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, Trash } from "lucide-react";
import { useGetProfile } from "@/hooks/user/useGetProfile";
import { useLogout } from "@/hooks/auth/useLogout";

const UserDropdown = () => {
  const { data: user } = useGetProfile();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    // Open delete account confirmation modal
    console.log("Delete account clicked");
  };

  return (
    <DropdownMenu>
      {user ? (
        <>
          <DropdownMenuTrigger>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteAccount}>
              <Trash className="mr-2 h-4 w-4" /> Delete Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      ) : (
        <Link to="/login"> login</Link>
      )}
    </DropdownMenu>
  );
};

export default UserDropdown;
