import { Button } from "@mui/material";
import { useState } from "react";


interface IDataPageProps<NewT, DbT> {
  itemName: string;
  allDataItems: DbT[];
  
  allDataComponents: React.ReactNode;

  addNewDialogComponent: React.ComponentType<{ 
    allDataItems: DbT[];
    onNewDataItemCreated: (data: NewT) => void; 
    onClose: () => void 
  }>;
  
  onNewDataItemCreated: (data: NewT) => Promise<void>;
  onDeleteAllData: () => Promise<void>;
}

export const DataPage = <NewT, DbT>({ 
  itemName: dataName, 

  allDataItems,
  addNewDialogComponent: DialogComponent, 
  
  onNewDataItemCreated, 
  onDeleteAllData,
  allDataComponents,
  
}: IDataPageProps<NewT, DbT>) => {

  const [showAddNewDialog, setShowAddNewDialog] = useState(false);

  const handleAddNewData = (data: NewT) => {
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

      {allDataComponents}

      {
        showAddNewDialog && 
          <DialogComponent
            allDataItems={allDataItems}
            onNewDataItemCreated={handleAddNewData}
            onClose={() => setShowAddNewDialog(false)}
          />
      }
    </div>
  )
}
