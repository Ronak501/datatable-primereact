import "./App.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Paginator } from "primereact/paginator";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import "primeicons/primeicons.css";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export default function App() {
  const [checked, setChecked] = useState<(number | string)[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const op = useRef<OverlayPanel>(null);
  const [value, setValue] = useState(0);
  const [extra, setExtra] = useState(0);

  const onPageChange = (event: {
    first: number;
    rows: number;
    page: number;
  }) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.first / event.rows + 1);
  };

  const onKeyChange = (e: CheckboxChangeEvent) => {
    setChecked(e.value);
  };

  const selectRows = (e: React.MouseEvent) => {
    e.preventDefault();
    op.current?.hide();
  };

  const onChange = useEffect(() => {
    setFirst(first + 12);
    setRows(rows);
    setPage(first / rows + 1);
  }, [extra]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.artic.edu/api/v1/artworks?page=${page}`
        );
        setProducts(response.data.data);
      } catch (error: unknown) {
        console.error(
          "Error fetching data:",
          error instanceof Error ? error.message : "Data not found Error"
        );
        setProducts([]);
      }
    };
    fetchData();
  }, [onPageChange, onChange]);

  useEffect(() => {
    if (value > 12) {
      if (page === 1) {
        const newChecked = [...checked];
        console.log(newChecked);
        newChecked.splice(0, 0, ...products.slice(0, first));
        setChecked(newChecked);
      }
      if (page === 2) {
        const newChecked = [...checked];
        console.log(newChecked);
        newChecked.splice(0, 0, ...products.slice(12, value));
        setChecked(newChecked);
      }
    } else {
        const newChecked = [...checked];
        newChecked.splice(0, 0, ...products.slice(0, value));
        setChecked(newChecked);
    }
  }, [first, value]);

  return (
    <>
      <DataTable
        value={products}
        selectionMode="multiple"
        selection={checked}
        onSelectionChange={(e) => setChecked(e.value)}
        className="p-checkbox-hidden-icon"
      >
        <Column
          selectionMode="multiple"
          header={
            <i
              className="pi pi-angle-down"
              onClick={(e) => {
                e.preventDefault();
                op.current?.toggle(e);
              }}
            ></i>
          }
          body={(rowData) => (
            <Checkbox
              checked={checked.includes(rowData.id)}
              value={rowData.id}
              onChange={(e: CheckboxChangeEvent) => {
                const newChecked = [...checked];
                if (e.checked) {
                  newChecked.push(e.value);
                } else {
                  newChecked.splice(newChecked.indexOf(e.value), 1);
                }
                setChecked(newChecked);
              }}
            />
          )}
          exportable={false}
        />
        <Column field="title" header="Title"></Column>
        <Column field="place_of_origin" header="Place of Origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscription"></Column>
        <Column field="date_start" header="Start Date"></Column>
        <Column field="date_end" header="End Date"></Column>
      </DataTable>
      <br />
      <Paginator
        first={first}
        rows={rows}
        totalRecords={144}
        onPageChange={onPageChange}
      />
      <OverlayPanel ref={op}>
        <div className="card flex flex-column justify-content-center gap-3 mb-4">
            <InputText
              placeholder="Select Rows..."
              onChange={(e: any) => setValue(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          <div className="flex justify-content-end gap-2">
            <Button label="Submit" onClick={selectRows} />
          </div>
        </div>
      </OverlayPanel>
    </>
  );
}
