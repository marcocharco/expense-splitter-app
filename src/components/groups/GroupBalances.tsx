import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const GroupBalances = () => {
  return (
      <Table>
        <TableCaption>Total owed and owing for each group member.</TableCaption>
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
  );
};

export default GroupBalances;
