import { Button } from "@mui/material";
import { useState } from "react";


interface IDataPageProps<T = unknown> {
  dataName: string;
  allDetailsComponents: React.ReactNode;
  addNewDialogComponent: React.ComponentType<{ onNewDataItemCreated: (data: T) => void; onClose: () => void }>;
  onNewDataItemCreated: (data: T) => Promise<void>;
  onDeleteAllData: () => Promise<void>;
}

export const DataPage = <T = unknown>({ 
  dataName, 
  addNewDialogComponent: DialogComponent, 
  onNewDataItemCreated, 
  onDeleteAllData,
  allDetailsComponents
}: IDataPageProps<T>) => {

  const [showAddNewDialog, setShowAddNewDialog] = useState(false);

  const handleAddNewData = (data: T) => {
    onNewDataItemCreated(data);
  }

  const handleDeleteAllData = async () => {
    await onDeleteAllData();
  }

  return (
    <div>
      <h1>{dataName} Page</h1>
      <Button 
        variant="contained"
        onClick={() => setShowAddNewDialog(true)}
      >
        Add New
      </Button>
      <Button
        variant="contained"
        color="warning" 
        onClick={handleDeleteAllData}
      >
        Delete All
      </Button>

      {allDetailsComponents}

      {
        showAddNewDialog && 
          <DialogComponent
            onNewDataItemCreated={handleAddNewData}
            onClose={() => setShowAddNewDialog(false)}
          />
      }
    </div>
  )
}
