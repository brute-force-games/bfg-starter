import { TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell } from "@mui/material";
import { useState } from "react";
import { DataSorting, SortingColumnHeader } from "~/components/sorting-column-header/sorting-column-header";
import { useLiveGameTables } from "~/data/bfg-db-game-tables";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";
import { DataSortingColumn } from "../active-tables/active-tables-page";
import { isGameOver } from "~/models/game-table/table-phase";


export const FINISHED_GAMES_ROUTE = "/finished-games";


export const FinishedGamesPage = () => {
  const allMyTables = useLiveGameTables();
  const { defaultPlayerProfileId } = useBfgWhoAmIContext();

  const [sorting, setSorting] = useState<DataSorting>("none");
  const [activeSortingColumn, setActiveSortingColumn] = useState<DataSortingColumn>("lastModifiedTimestamp");


  if (!defaultPlayerProfileId) {
    return <div>No player profile id</div>;
  }

  const allMyFinishedTables = allMyTables?.filter((table) => 
    isGameOver(table.tablePhase));

  
  const handleRequestSortByName = () => {
    setActiveSortingColumn("name");
    setSorting(sorting === "asc" ? "desc" : "asc");
  }

  const handleRequestSortByCreatedAt = () => {
    setActiveSortingColumn("createdAt");
    setSorting(sorting === "asc" ? "desc" : "asc");
  }

  const handleRequestSortByStatus = () => {
    setActiveSortingColumn("tablePhase");
    setSorting(sorting === "asc" ? "desc" : "asc");
  }

  const handleRequestSortByGameHostPlayerProfileId = () => {
    setActiveSortingColumn("gameHostPlayerProfileId");
    setSorting(sorting === "asc" ? "desc" : "asc");
  }

  const getSortedData = () => {
    if (sorting === "none") {
      return allMyFinishedTables;
    }

    if (activeSortingColumn === "tablePhase") {
      return allMyFinishedTables?.sort((a, b) => {
        if (sorting === "asc") {
          return a.tablePhase.localeCompare(b.currentStatusDescription);
        } else {
          return b.tablePhase.localeCompare(a.currentStatusDescription);
        }
      });
    }
    if (activeSortingColumn === "name") {
      return allMyFinishedTables?.sort((a, b) => {
        if (sorting === "asc") {
          return a.gameTitle.localeCompare(b.gameTitle);
        } else {
          return b.gameTitle.localeCompare(a.gameTitle);
        }
      });
    }

    if (activeSortingColumn === "createdAt") {
      return allMyFinishedTables?.sort((a, b) => {
        if (sorting === "asc") {
          return a.createdAt.getTime() - b.createdAt.getTime();
        } else {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
      });
    }

    if (activeSortingColumn === "status") {
      return allMyFinishedTables?.sort((a, b) => {
        if (sorting === "asc") {
          return a.currentStatusDescription.localeCompare(b.currentStatusDescription);
        } else {
          return b.currentStatusDescription.localeCompare(a.currentStatusDescription);
        }
      });
    }

    if (activeSortingColumn === "gameHostPlayerProfileId") {
      return allMyFinishedTables?.sort((a, b) => {
        if (sorting === "asc") {
          return a.gameHostPlayerProfileId?.localeCompare(b.gameHostPlayerProfileId);
        } else {
          return b.gameHostPlayerProfileId?.localeCompare(a.gameHostPlayerProfileId);
        }
      });
    }
    
    return allMyFinishedTables;
  }

  const sortedData = getSortedData();


  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
    <Table stickyHeader aria-label="collapsible table">
      
      <TableHead>
        <TableRow>
          <SortingColumnHeader
            title="Name"
            sorting={sorting}
            thisSortingColumn={"name"}
            activeSortingColumn={activeSortingColumn}
            handleRequestSort={handleRequestSortByName}
            titleAlign="left"
          />
          <SortingColumnHeader
            title="Table Phase"
            sorting={sorting}
            thisSortingColumn={"tablePhase"}
            activeSortingColumn={activeSortingColumn}
            handleRequestSort={handleRequestSortByStatus}
            titleAlign="left"
          />
          <SortingColumnHeader
            title="Status"
            sorting={sorting}
            thisSortingColumn={"gameEngine"}
            activeSortingColumn={activeSortingColumn}
            handleRequestSort={handleRequestSortByStatus}
            titleAlign="left"
          />
          <SortingColumnHeader
            title="Created"
            sorting={sorting}
            thisSortingColumn={"createdAt"}
            activeSortingColumn={activeSortingColumn}
            handleRequestSort={handleRequestSortByCreatedAt}
            titleAlign="left"
          />
          <SortingColumnHeader
            title="Game Host"
            sorting={sorting}
            thisSortingColumn={"gameHostPlayerProfileId"}
            activeSortingColumn={activeSortingColumn}
            handleRequestSort={handleRequestSortByGameHostPlayerProfileId}
            titleAlign="left"
          />
        </TableRow>
      </TableHead>
      <TableBody>
        {
          sortedData?.map((table) => (
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
              <TableCell>
                {table.gameTitle}
              </TableCell>
              <TableCell>
                {table.tablePhase}
                {/* <GameTablePlayerOptionsComponent
                  myPlayerProfileId={defaultPlayerProfileId}
                  gameTable={table}
                /> */}
              </TableCell>
              <TableCell>
                {table.currentStatusDescription}
              </TableCell>
              <TableCell>
                {table.createdAt.toLocaleString()}
              </TableCell>
              <TableCell>
                {table.gameHostPlayerProfileId}
              </TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  </TableContainer>

      )
  return <div>Finished Games</div>;
};
