import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import GroupActivity from "./GroupActivity";

const GroupDashboardTabs = () => {
  return (
    <div className="flex justify-center">
      <Tabs defaultValue="activity" className="w-full max-w-[1000px]">
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
          {/* <div className="flex justify-center">
        <div className="w-full max-w-[800px]"> */}
          <GroupActivity />
          {/* </div>
        </div> */}
        </TabsContent>
        <TabsContent value="you">
          <div className="lg:mt-4">Items where you owe or are owed.</div>
        </TabsContent>
        <TabsContent value="balances">
          <div className="lg:mt-4">
            <Table>
              <TableCaption>
                Total owed and owing for each group member.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Total Owes</TableHead>
                  <TableHead>Total Owed</TableHead>
                  <TableHead>Net Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Bob</TableCell>
                  <TableCell>$42.78</TableCell>
                  <TableCell>$127.07</TableCell>
                  <TableCell className="text-green-700">$84.29</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rick</TableCell>
                  <TableCell>$42.36</TableCell>
                  <TableCell>$104.58</TableCell>
                  <TableCell className="text-green-700">$62.22</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jack</TableCell>
                  <TableCell>$42.36</TableCell>
                  <TableCell>$0</TableCell>
                  <TableCell className="text-red-700">$42.36</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dave</TableCell>
                  <TableCell>$104.16</TableCell>
                  <TableCell>$0</TableCell>
                  <TableCell className="text-red-700">$104.16</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
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

export default GroupDashboardTabs;
