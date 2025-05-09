"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const AddExpense = () => {
  const params = useParams();
  const groupId = params.id;

  return (
    <div className="layout-container">
      <div className="layout-content">
        <div className="flex flex-row justify-between flex-wrap gap-y-2">
          <div className="flex flex-row items-center">
            <Link href={`/groups/${groupId}`}>
              <Button variant="link" size="icon">
                <ChevronLeft />
              </Button>
            </Link>

            <h1>Add Expense</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
