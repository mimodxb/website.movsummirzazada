import React from 'react';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

const AdminTable = ({ columns, rows = [], onEdit, onDelete, isLoading, actions }) => {
  return (
    <div className="rounded-md border border-[#E0A995]/20 bg-[#0A1612]/40 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-[#13251E]">
          <TableRow className="border-b border-[#E0A995]/10 hover:bg-transparent">
            {columns.map((col) => (
              <TableHead key={col.key} className="text-[#E0A995] font-semibold">
                {col.label}
              </TableHead>
            ))}
            {(onEdit || onDelete || actions) && (
              <TableHead className="text-right text-[#E0A995] font-semibold">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                <div className="flex justify-center items-center gap-2 text-[#A8B3AF]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading data...
                </div>
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center text-[#A8B3AF]">
                No records found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} className="border-b border-[#E0A995]/5 hover:bg-[#E0A995]/5">
                {columns.map((col) => (
                  <TableCell key={`${row.id}-${col.key}`} className="text-[#EBE8E3]">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </TableCell>
                ))}
                {(onEdit || onDelete || actions) && (
                  <TableCell className="text-right space-x-2">
                    {actions && actions(row)}
                    {onEdit && (
                      <Button variant="ghost" size="icon" onClick={() => onEdit(row)} className="h-8 w-8 text-[#A8B3AF] hover:text-[#E0A995] hover:bg-transparent">
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="icon" onClick={() => onDelete(row)} className="h-8 w-8 text-[#A8B3AF] hover:text-red-400 hover:bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminTable;