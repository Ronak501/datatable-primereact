import './App.css'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { useEffect, useState } from 'react';
import { Paginator } from "primereact/paginator"; 
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
        
export default function App() {

  const [checked, setChecked] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);

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
    let _selectedKey = [...selectedKey];

    if (e.checked) {
      _selectedKey.push(e.value);
    } else {
      _selectedKey = selectedKey.filter((key: { key: string }) => key.key !== e.value.key);
    }
    setSelectedKey(_selectedKey);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.artic.edu/api/v1/artworks?page=${page}`
        );
        setProducts(response.data.data);
      } catch (error: unknown) {
        console.error("Error fetching data:", error instanceof Error ? error.message : 'Data not found Error');
        setProducts([]);
      }
    };

    fetchData();
  }, [onPageChange, onKeyChange]);

  const [selectedKey, setSelectedKey] = useState(products[0]?.id);

  return (
    <>
      <DataTable value={products} tableStyle={{ minWidth: "50rem" }}>      
        <Column body={() => (
          <Checkbox checked={checked} onChange={(e: CheckboxChangeEvent) => setChecked(e.checked ?? false)} />
        )} exportable={false}/>
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
    </>
  );
}
