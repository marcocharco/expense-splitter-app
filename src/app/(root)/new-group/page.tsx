import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import CreateGroupForm from "@/features/groups/components/forms/CreateGroupForm";

const CreateGroup = () => {
  return (
    <div className="layout-container">
      <div className="layout-content">
        <div className="flex flex-row justify-between flex-wrap gap-y-2">
          <div className="flex flex-row items-center">
            <Link href="/">
              <Button variant="link" size="icon">
                <ChevronLeft />
              </Button>
            </Link>
            <h1>Create New Group</h1>
          </div>
        </div>

        <div className="mt-6">
          <CreateGroupForm />
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;

