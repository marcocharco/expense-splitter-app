import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useExpenses } from "@/context/ExpensesContext";
// import { getUser } from "@/lib/queries/getUser";

const GroupActivity = () => {
  const expenses = useExpenses();
  // const [userMap, setUserMap] = useState<Record<string, string>>({});

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     if (!expenses) return;

  //     const uniqueUserIds = Array.from(new Set(expenses.map((e) => e.paid_by)));

  //     const entries = await Promise.all(
  //       uniqueUserIds.map(async (id) => {
  //         const { name } = await getUser(id);
  //         return [id, name] as const;
  //       })
  //     );

  //     setUserMap(Object.fromEntries(entries));
  //   };

  //   fetchUsers();
  // }, [expenses]);

  return (
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
          {expenses?.map((expense) => {
            const formattedDate = new Date(expense.date).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            );
            // const paidByName = userMap[expense.paid_by] || "";

            return (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.title}</TableCell>
                <TableCell>${expense.amount}</TableCell>
                <TableCell>{expense.paid_by.name}</TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>{expense.category_id}</TableCell>
                <TableCell>{expense.status}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default GroupActivity;
