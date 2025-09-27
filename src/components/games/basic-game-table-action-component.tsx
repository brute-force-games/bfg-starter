import { DbGameTable } from "~/models/game-table/game-table";
import { DbGameTableAction } from "~/models/game-table/game-table-action";


interface IBasicGameTableActionComponentProps {
  gameTable: DbGameTable;
  action: DbGameTableAction;
}

export const BasicGameTableActionComponent = (props: IBasicGameTableActionComponentProps) => {

  const { action } = props;

  return (
    <div key={action.id}>
    {/* <div>Action ID: {action.id}</div>
    <div>Prior Action ID: {action.previousActionId}</div> */}
    <div>Action Type: {action.actionType}</div>
    <div>Action Source: {action.source}</div>
    <div>Action Outcome Game State JSON: {action.actionOutcomeGameStateJson}</div>
  </div>)
};
