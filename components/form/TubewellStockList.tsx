
import { db } from '@/lib/db'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function TubewellStockList() {
  const tubewellStocks = await db.tubewellStock.findMany()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          
          <TableHead>Tubewell Type</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tubewellStocks.map((stock) => (
          <TableRow key={stock.id}>
            
            <TableCell>{stock.tubewellType}</TableCell>
            <TableCell>{stock.quantity}</TableCell>
            <TableCell>{new Date(stock.lastUpdated).toLocaleString()}</TableCell>
            <TableCell>
              
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
