import { Container, Stack, Typography } from "@bfg-engine";
import { IBfgGameRoomForObserver } from "@bfg-engine/hooks/p2p/game/p2p-game-types";
import { ContentLoading } from "@bfg-engine/ui/bfg-ui/components/ContentLoading/ContentLoading";



// TODO: Delete this component; convert to context somehow... see HostObserverP2pGameComponent
// interface IObserverP2pGameDetailsComponentProps {
//   gameTableId: BfgGameTableId
//   // activeTabId: PlayerGameTabId
// }

// export const ObserverP2pGameDetailsComponent = ({ BfgGameTableId }: IObserverP2pGameDetailsComponentProps) => {
export const ObserverGameDetailsPage = (props: IBfgGameRoomForObserver) => {

  
  const { publicGameDetails } = props;
  if (!publicGameDetails) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Observer Game Details...</Typography>
          <Typography variant="body1" color="secondary">Waiting for public game details...</Typography>
        </Stack>
      </Container>
    );
  }

  const { gameMetadata, gameTable, gameActions } = publicGameDetails;
  if (!gameMetadata || !gameTable || !gameActions) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Observer Game Details...</Typography>
          { !gameMetadata && <Typography variant="body1" color="secondary">Waiting for game metadata...</Typography> }
          { !gameTable && <Typography variant="body1" color="secondary">Waiting for game table...</Typography> }
          { !gameActions && <Typography variant="body1" color="secondary">Waiting for game actions...</Typography> }
        </Stack>
      </Container>
    );
  }

  // const { allPlayerProfiles } = p2pDetails;
  // const [viewPerspective, setViewPerspective] = useState<GameTableSeat | null>(null);

  // if (!p2pGame) {
  //   return (
  //     <ContentLoading
  //       message="Loading P2P Game Observer View..."
  //     />
  //   )
  // }

  // const p2p = p2pGame.p2p;
  // if (!p2p) {
  //   return (
  //     <ContentLoading
  //       message="Loading P2P Observer Data..."
  //     />
  //   )
  // }
  // const { gameTable, gameActions } = p2p;

  if (!gameTable || !gameActions) {
    return (
      <ContentLoading
        message="Loading Game xDetails..."
      />
    )
  }

  // if (gameTable.id !== BfgGameTableId) {
  //   throw new Error('Game Table ID does not match: ' + gameTable.id + ' !== ' + BfgGameTableId);
  // }
  
  const latestAction = gameActions[gameActions.length - 1];
  if (!latestAction) {
    return (
      <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
        <Typography variant="body1">No game actions yet...</Typography>
      </Container>
    );
  }

  // const gameSpecificStateEncoder = gameMetadata.gameSpecificStateEncoder;
  // if (gameSpecificStateEncoder.format !== 'json-zod-object-string') {
  //   throw new Error('Game specific state encoder format is not json-zod-object-string');
  // }

  // const zodGameSpecificStateEncoder = gameSpecificStateEncoder as IBfgJsonZodObjectDataEncoder<any>;
  // const zodGameSpecificStateSchema = zodGameSpecificStateEncoder.schema as z.ZodTypeAny;

  // const nextGameStateStr: BfgEncodedString = latestAction.nextGameStateStr as unknown as BfgEncodedString;
  // const gameSpecificState = gameSpecificStateEncoder.decode(nextGameStateStr) as z.infer<typeof zodGameSpecificStateSchema> | null;

  // const gameRepresentation = gameMetadata.components.ObserverComponent({
  //   gameState: gameSpecificState,
  //   gameTable: gameTable,
  //   allPlayerProfiles: p2pGame.allPlayerProfiles,
  //   latestGameAction: latestAction,
  //   hostPlayerProfileId: gameTable.gameHostPlayerProfileId,
  //   observedPlayerProfileId: null,
  //   observedPlayerSeat: viewPerspective,
  // });

  
  return (
    <Container maxWidth={false} style={{ padding: '24px 16px', width: '100%' }}>
      <div style={{ padding: '20px' }}>
        <h2>Game Details</h2>
        <div style={{ marginBottom: '16px' }}>
          <strong>Game Table ID:</strong> {gameTable.id}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <strong>Game State:</strong>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '12px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(gameTable, null, 2)}
          </pre>
        </div>
        <div>
          <strong>Game Actions ({gameActions.length}):</strong>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '12px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(gameActions, null, 2)}
          </pre>
        </div>
      </div>
    </Container>
  )
}
