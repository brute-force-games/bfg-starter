import { DexieDataTableComponent } from "~/components/dexie-data/dexie-data-table-component";
import { bfgDb } from "~/data/bfg-db";


export const DEXIE_DATA_PAGE_ROUTE = "/dexie-data";


export const DexieDataPage = () => {

  const allTableNames = Object.keys(bfgDb.tables)
    .map((key, index) => ({ name: bfgDb.tables[index].schema.name, index }));

  console.log("ALL TABLE NAMES");
  console.log(allTableNames);

  const tableNamesToShow = allTableNames
    ?.filter((nameAndIndex) => !nameAndIndex.name.startsWith('$'))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <h1>Dexie Data</h1>

      {
        tableNamesToShow.map((nameAndIndex) => (
          <DexieDataTableComponent
            key={nameAndIndex.name}
            tableName={nameAndIndex.name}
            table={bfgDb.tables[nameAndIndex.index]}
          />
        ))
      }

    </div>
  );
};
