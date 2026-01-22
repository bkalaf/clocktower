// src/hooks/createColumnData.tsx
import { MRT_RowData, MRT_ColumnDef } from 'material-react-table';

export function createColumnData<T extends MRT_RowData>(columns: MRT_ColumnDef<T>[]) {
    return function TableData({ data }: { data: T }) {
        return (
            <tr>
                {columns.map((col) => {
                    const value = col.accessorFn ? col.accessorFn(data) : data[(col.accessorKey ?? col.id) as keyof T];
                    return <td key={col.accessorKey ?? col.id}>{value?.toString()}</td>;
                })}
            </tr>
        );
    };
}
