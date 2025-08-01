"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface NavBarType {
  variant?: "login";
}

export default function Navbar( { variant }: NavBarType ) {


  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  }

    return (
      <nav className="flex items-center justify-between py-3 px-20 border border-t-0 border-x-0 border-b border-white border-opacity-20">
        <div className="text-white font-bold text-2xl">LOGO</div>
        {variant === "login" ? (
                  <Button className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors" onClick={handleClick}
                  variant={"primary"}>
                    Log In
                  </Button>
        ) : (
          <></>
        )}
      </nav>
    )
  }
  
  