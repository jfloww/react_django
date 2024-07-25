import { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import api from './api/api';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { GridApi } from '@ag-grid-community/core';

interface AppliedData {
  name: string;
  role: string;
  applied: string;
  location: string;
}

interface GroupedData {
  name: string;
  appliedCount: number;
  mostRecentDate: string;
}

function App() {
  const [appliedList, setAppliedList] = useState<AppliedData[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [totalCompany, setTotalCompany] = useState<number>(0);
  const [totalApplied, setTotalApplied] = useState<number>(0);
  const [targetCompany, setTargetCompany] = useState<string | null>(null);
  const [targetList, setTargetList] = useState<AppliedData[]>([]);
  const gridApiRef = useRef<GridApi | null>(null);

  const backendConnect = () => {
    const params = { connect: 'success' };
    api
      .get('hello/', { params })
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  const getData = () => {
    api.get('getData/').then((res) => {
      setTotalApplied(res.data.length);
      setAppliedList(res.data);
    });
  };

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    };
  }, []);

  useEffect(() => {
    if (appliedList.length > 0) {
      const grouped = appliedList.reduce(
        (acc, curr) => {
          const { name, applied } = curr;
          if (!acc[name]) {
            acc[name] = { name, appliedCount: 0, mostRecentDate: applied };
          }
          acc[name].appliedCount += 1;
          if (new Date(applied) > new Date(acc[name].mostRecentDate)) {
            acc[name].mostRecentDate = applied;
          }
          return acc;
        },
        {} as { [key: string]: GroupedData }
      );
      setTotalCompany(Object.keys(grouped).length);
      setGroupedData(Object.values(grouped));
    }
  }, [appliedList]);

  const columnDefs: any = useMemo(
    () => [
      {
        headerName: 'Company',
        field: 'name',
        flex: 2,
      },
      { headerName: 'Applied', field: 'appliedCount', flex: 1 },
      {
        headerName: 'Recent Applied',
        field: 'mostRecentDate',
        flex: 2,
      },
    ],
    []
  );

  const onSelectionChanged = () => {
    const selectedRows = gridApiRef.current!.getSelectedRows();
    if (selectedRows.length === 1) {
      const target = selectedRows[0];
      setTargetCompany(target.name);
      const targets = appliedList.filter((list) => list.name === target.name);
      setTargetList(targets);
      console.log(target.name);
    } else {
      setTargetCompany(null);
      setTargetList([]);
    }
  };

  const onGridReady: any = (params: { api: GridApi }) => {
    gridApiRef.current = params.api;
  };

  return (
    <>
      <div className="font-bold text-3xl mb-4">
        You Applied {totalApplied} times to {totalCompany} companies
      </div>
      <div className="flex">
        <div
          className="ag-theme-alpine-dark"
          style={{ height: 600, width: 800 }}
        >
          <AgGridReact
            rowData={groupedData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection="single"
            onSelectionChanged={onSelectionChanged}
            onGridReady={onGridReady}
          />
        </div>
        <div className="w-1/2 p-4 bg-gray-800 text-white">
          {targetCompany && (
            <>
              <div className="border-b-2 border-white pb-2 mb-4">
                <div className="font-bold text-2xl">
                  Company Info: {targetCompany}
                </div>
                <div>Summary: HQ, Employees, etc.. </div>
              </div>
              <div className="mt-4">
                {targetList.map((item, index) => (
                  <div className="flex space-x-4 py-2" key={index}>
                    <div className="text-center flex-1">{item.role}</div>
                    <div className="text-center flex-1">{item.applied}</div>
                    <div className="text-center flex-1">{item.location}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="card">
        <button onClick={() => backendConnect()}>Connect</button>
        <button onClick={() => getData()}>Get Data</button>
      </div>
    </>
  );
}

export default App;
