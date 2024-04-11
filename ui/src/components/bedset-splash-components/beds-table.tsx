import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useBedCart } from '../../contexts/bedcart-context';
import { components } from '../../../bedbase-types';

type Bed = components['schemas']['BedSetBedFiles']['results'][number];

type Props = {
  beds: Bed[];
};

const columnHelper = createColumnHelper<Bed>();

export const BedsTable = (props: Props) => {
  const { beds } = props;

  const [addedToCart, setAddedToCart] = useState(false);
  const [justAddedToCart, setJustAddedToCart] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { addBedToCart, removeBedFromCart, cart } = useBedCart();

  const columns = [
    columnHelper.accessor('genome_alias', {
      cell: (info) => <span className="badge bg-primary">{info.getValue()}</span>,
      footer: (info) => info.column.id,
      header: 'Genome',
      id: 'genome',
    }),
    columnHelper.accessor('bed_type', {
      cell: (info) => <span className="badge bg-primary">{info.getValue()}</span>,
      footer: (info) => info.column.id,
      header: 'Type',
      id: 'bed-type',
    }),
    columnHelper.accessor('name', {
      cell: (info) => <span className="max-cell-width text-truncate d-inline-block">{info.getValue()}</span>,
      footer: (info) => info.column.id,
      header: 'Name',
      id: 'name',
    }),
    columnHelper.accessor('description', {
      cell: (info) => (
        <span className="max-cell-width text-truncate d-inline-block">
          {info.getValue() || <span className="fst-italic">No description</span>}
        </span>
      ),
      footer: (info) => info.column.id,
      header: 'Description',
      id: 'description',
    }),
    columnHelper.accessor('id', {
      cell: (info) => <a href={`/bed/${info.getValue()}`}>{info.getValue()}</a>,
      footer: (info) => info.column.id,
      header: 'Record Identifier',
      id: 'record-identifier',
    }),

    columnHelper.accessor('id', {
      cell: (info) => (
        <div className="d-flex flex-row w-100 gap-1 flex-end">
          {!cart.includes(info.getValue()) || (addedToCart && justAddedToCart === info.getValue()) ? (
            <button
              onClick={() => {
                addBedToCart(info.getValue());
                setAddedToCart(true);
                setJustAddedToCart(info.getValue());
                setTimeout(() => setAddedToCart(false), 500);
              }}
              disabled={addedToCart && justAddedToCart === info.getValue()}
              className="btn btn-sm btn-primary"
            >
              <i className="bi bi-cart me-1"></i>
              {addedToCart && justAddedToCart === info.getValue() ? 'Added to cart!' : 'Add to cart'}
            </button>
          ) : (
            <button onClick={() => removeBedFromCart(info.getValue())} className="btn btn-sm btn-outline-danger">
              <i className="bi bi-cart-x me-1"></i>
              Remove
            </button>
          )}
        </div>
      ),
      enableSorting: false,
      header: 'Actions',
      id: 'actions',
    }),
  ];

  const table = useReactTable({
    data: beds,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded border shadow-sm my-2">
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan} scope="col">
                  {header.isPlaceholder ? null : (
                    <div
                      className={header.column.getCanSort() ? 'cursor-pointer' : ''}
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === 'asc'
                            ? 'Sort ascending'
                            : header.column.getNextSortingOrder() === 'desc'
                            ? 'Sort descending'
                            : 'Clear sort'
                          : undefined
                      }
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
        {/* <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot> */}
      </table>
      <div className="h-4" />
    </div>
  );
};
