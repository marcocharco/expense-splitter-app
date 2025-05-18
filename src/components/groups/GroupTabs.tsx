import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import GroupActivity from "./GroupActivity";
import GroupBalances from "./GroupBalances";

const GroupTabs = () => {
  return (
    <div className="flex justify-center">
      <Tabs defaultValue="activity" className="w-full max-w-[1000px] !gap-4">
        <TabsList className="flex gap-4">
          <TabsTrigger value="activity" className="px-2">
            All activity
          </TabsTrigger>
          <TabsTrigger value="you" className="px-2">
            Your expenses
          </TabsTrigger>
          <TabsTrigger value="balances" className="px-2">
            Group balances
          </TabsTrigger>
          <TabsTrigger value="members" className="px-2">
            Members
          </TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="justify-center">
          <GroupActivity />
        </TabsContent>
        <TabsContent value="you">
          <p>Items where you owe or are owed.</p>
        </TabsContent>
        <TabsContent value="balances">
          <GroupBalances />
        </TabsContent>
        <TabsContent value="members">
          <div className="flex flex-col space-y-4 lg:mt-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupTabs;
