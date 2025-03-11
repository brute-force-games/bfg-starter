import { useState } from "react";
import { Table } from "dexie";
import { Button } from "@mui/material";


interface DexieDataTableComponentProps {
  tableName: string;
  table: Table;
}

export const DexieDataTableComponent = (props: DexieDataTableComponentProps) => {
  const { tableName, table } = props;
  const [isOpen, setIsOpen] = useState(false);

  const tableData = table?.toArray();


  // const tableNamesToShow = allTableNames?.filter((name) => !name.startsWith('$'));

  
  
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <h2 onClick={toggleAccordion} style={{ cursor: 'pointer' }}>
        {tableName}
      </h2>
      {isOpen && (
        <div>
          <Button onClick={() => {
            console.log(table.schema);
            const areYouSure = confirm("Are you sure you want to delete all rows?");
            if (areYouSure) {
              table.clear();
            }
          }}>
            Delete All Rows
          </Button>
          <pre>{JSON.stringify(table.schema, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
