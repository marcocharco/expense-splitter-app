import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
// import ExpenseForm from "@/components/forms/newExpense/ExpenseForm";

const AddExpense = async ({ params }: { params: { slug: string } }) => {
  // const params = useParams();
  // const groupSlug = params.slug;
  const { slug } = await params;

  return (
    <div className="layout-container">
      <div className="layout-content">
        <div className="flex flex-row justify-between flex-wrap gap-y-2">
          <div className="flex flex-row items-center">
            <Link href={`/groups/${slug}`}>
              <Button variant="link" size="icon">
                <ChevronLeft />
              </Button>
            </Link>

            <h1>Add Expense</h1>
          </div>
        </div>

        {/* <ExpenseForm /> */}
      </div>
    </div>
  );
};

export default AddExpense;
