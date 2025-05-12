"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { Plus, Scale } from "lucide-react";
import { getGroupById } from "@/lib/queries/getGroupById";
import { useEffect, useState } from "react";

const GroupPage = () => {
  const params = useParams();
  const groupId = params.id as string;
  const [group, setGroup] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (groupId) {
      getGroupById(groupId as string).then(setGroup);
    }
  }, [groupId]);
  return (
    <section className="layout-container">
      <div className="layout-content">
        <div className="flex flex-row justify-between flex-wrap gap-y-2">
          <div className="flex flex-row items-center">
            {/* <Link href="/">
              <Button variant="link" size="icon">
                <ChevronLeft />
              </Button>
            </Link> */}

            <h1>{group?.name}</h1>
          </div>

          <div className="flex flex-wrap gap-3 justify-end">
            <Link href={`/groups/${groupId}/add-expense`}>
              <Button variant="outline">
                <Plus /> Add expense
              </Button>
            </Link>
            <Link href="">
              <Button variant="outline">
                <Scale />
                Settle expenses
              </Button>
            </Link>
          </div>
        </div>

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
              <div className="lg:mt-4">
                <Table>
                  <TableCaption>A list of recent group activity.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Paid By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        Ulitility Bill
                      </TableCell>
                      <TableCell>$169.42</TableCell>
                      <TableCell>Bob</TableCell>
                      <TableHead>April 17, 2025</TableHead>
                      <TableCell>Utilities</TableCell>
                      <TableCell>0/3</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Costco</TableCell>
                      <TableCell>$133.70</TableCell>
                      <TableCell>Rick</TableCell>
                      <TableHead>April 23, 2025</TableHead>
                      <TableCell>Groceries</TableCell>
                      <TableCell>0/2</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
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
      </div>
    </section>
  );
};

export default GroupPage;
