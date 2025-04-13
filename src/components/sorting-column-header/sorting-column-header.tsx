import { Box } from "@mui/material";
import { TableSortLabel } from "@mui/material";
import { TableCell } from "@mui/material";
import { visuallyHidden } from '@mui/utils';


export type DataSorting = "none" | "asc" | "desc";
// export type DataSortingColumn = "lastModifiedTimestamp" | "createdAt" | "name";


interface ISortingColumnHeaderProps {
  title: string,
  titleAlign: "right" | "left",

  sorting: DataSorting,
  activeSortingColumn: string,
  thisSortingColumn: string,
  
  handleRequestSort: (property: string) => void,
}

export const SortingColumnHeader = (props: ISortingColumnHeaderProps) => {

  const { sorting, thisSortingColumn, activeSortingColumn, handleRequestSort, title, titleAlign } = props;
  

  return (
    <TableCell align={titleAlign}>
      <TableSortLabel
        active={thisSortingColumn === activeSortingColumn}
        direction={sorting === "asc" ? 'asc' : 'desc'}
        onClick={() => handleRequestSort(thisSortingColumn)}
      >
        {title}
        {thisSortingColumn === activeSortingColumn ? (
          <Box component="span" 
            sx={visuallyHidden}
          >
            {sorting === "desc" ? 'sorted descending' : 'sorted ascending'}
          </Box>
        ) : null}
      </TableSortLabel>
    </TableCell>
  )
}


// const getSortedProjects = () => {

//   console.log("sorting", sorting);
//   console.log("activeSortingColumn", activeSortingColumn);

//   if (activeSortingColumn === "lastModifiedTimestamp") {
//     return myProjects.sort((a, b) => {
//       return sorting === "asc" 
//         ? compareAsc(a.lastModifiedTimestamp, b.lastModifiedTimestamp)
//         : compareDesc(a.lastModifiedTimestamp, b.lastModifiedTimestamp);
//     });
//   }
//   if (activeSortingColumn === "createdAt") {
//     return myProjects.sort((a, b) => {
//       return sorting === "asc"
//         ? compareAsc(a.createdAt, b.createdAt)
//         : compareDesc(a.createdAt, b.createdAt);
//     });
//   }
//   if (activeSortingColumn === "name") {
//     return myProjects.sort((a, b) => {
//       return sorting === "asc"
//         ? a.title.localeCompare(b.title)
//         : b.title.localeCompare(a.title);
//     });
//   }

//   return myProjects;
// }

// const rows = getSortedProjects();