// src/hooks/createColumnHeader.tsx
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';

export function createColumnHeader<T extends MRT_RowData>(columns: MRT_ColumnDef<T>[]) {
    return function TableHeaders() {
        return (
            <tr>
                {columns.map((col) => (
                    <th key={`${col.accessorKey ?? col.id}_header`}>{col.header}</th>
                ))}
            </tr>
        );
    };
}
