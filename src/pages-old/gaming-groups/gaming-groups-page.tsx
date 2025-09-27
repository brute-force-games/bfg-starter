import { DataPage } from "~/components/data-page/data-page"
import { PlayGroupDetailsComponent } from "~/components/play-groups/single-play-group-component"
import { addNewGamingGroup, deleteAllGamingGroups, useLiveGamingGroups } from "~/data/bfg-db-gaming-groups"
import { AddGamingGroupDialog } from "~/dialogs/add-gaming-group-dialog"
import { NewGamingGroup, DbGamingGroup } from "~/types/core/play-group/play-group-db"


export const GamingGroupsPage = () => {

  const playGroups = useLiveGamingGroups();

  const playGroupDetailsComponents = playGroups?.map((playGroup) => {
    return <PlayGroupDetailsComponent playGroup={playGroup} />
  })


  return (
    <>
      <DataPage<NewGamingGroup, DbGamingGroup>
        itemName="Gaming Groups"
        allDataItems={playGroups ?? []}
        allDataComponents={playGroupDetailsComponents}
        addNewDialogComponent={AddGamingGroupDialog}
        onNewDataItemCreated={addNewGamingGroup}
        onDeleteAllData={deleteAllGamingGroups}
      />
    </>
  )
}
