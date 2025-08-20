"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { LayoutGrid, List, LogOut } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import CurrentMission from "@/src/components/current-mission";
import Showcase from "@/src/components/showcase";
import CompanyFeed from "@/src/components/company-feed";

const Dashboard = () => {
  const [feedLayout, setFeedLayout] = useState<"grid" | "list">("grid");
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "current-mission";
  const [activeTab, setActiveTab] = useState(initialTab);
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ redirect: true, redirectTo: "/login" });
  };

  return (
    <ProtectedRoute>
      <div className="bg-[#1a1a1a] pb-16 min-h-screen w-full">
        <header className="bg-gradient-custom-primary bg-opacity-10 border-b border-purple-900">
          <div className="">
            <div className="items-center justify-between h-16 grid grid-flow-col px-10">
              <div className="text-white font-bold text-2xl">LOGO</div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                <TabsList className="p-1 w-[484px] h-[37px]">
                  <TabsTrigger value="current-mission" className="w-full">
                    Current Missions
                  </TabsTrigger>
                  <TabsTrigger value="showcase">Showcase</TabsTrigger>
                  <TabsTrigger value="company-feed">Company Feed</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex justify-end items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/profile")}
                  className="text-white  justify-end p-2 rounded-3xl bg-white bg-opacity-10 hover:bg-opacity-20 "
                >
                  <img
                    src={session?.user?.profilePic?.url}
                    alt={`Profile`}
                    className="w-8 h-8 object-cover rounded-full"
                  />
                  {session?.user.firstName} {session?.user.lastName}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-white p-2 rounded-3xl bg-red-600 bg-opacity-20 hover:bg-opacity-40"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full relative -mt-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8 "
          >
            <TabsContent value="current-mission">
              <CurrentMission />
            </TabsContent>
            <TabsContent value="showcase">
              <Showcase />
            </TabsContent>
            <TabsContent value="company-feed">
              <div className="">
                <CompanyFeed layout={feedLayout}>
                  <div className="grid gap-4 container mx-auto grid-cols-2 ">
                    <div className=" col-span-1 grid grid-cols-4 text-white">
                      <div className="col-span-3">
                        <h3 className="text-[24px] font-bold">Company Feed</h3>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Ut et massa mi. Aliquam in hendrerit urna.
                          Pellentesque sit amet sapien fringilla, mattis ligula
                          consectetur.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex justify-end gap-10"  gap-2 col-span-1  items-end p-2`}
                    >
                      <div
                        className={`grid grid-cols-4 gap-2
                      }`}
                      >
                        <div className="col-span-1"> </div>
                        <div className="w-[400px] col-span-3">
                          <Input
                            placeholder="Search for anyone and anything..."
                            className=" bg-white bg-opacity-30 rounded-[10px] w-full border-white border-opacity-40 text-white text-opacity-100 placeholder:text-white placeholder:text-opacity-75"
                          />
                        </div>
                      </div>
                      <Tabs className="rounded-[5px] h-[40px] w-[80px] justify-center items-center">
                        <TabsList className="grid grid-cols-2 h-full w-full rounded-[5px]">
                          <TabsTrigger
                            onClick={() => setFeedLayout("grid")}
                            value="grid"
                            className="h-full w-full rounded-[5px] "
                          >
                            <LayoutGrid className="h-4 w-4" />
                          </TabsTrigger>
                          <TabsTrigger
                            onClick={() => setFeedLayout("list")}
                            value="list"
                            className="h-full w-full rounded-[5px]"
                          >
                            <List className="h-4 w-4" />
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </CompanyFeed>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
