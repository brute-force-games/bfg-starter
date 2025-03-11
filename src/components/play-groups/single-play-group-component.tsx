import { DbGamingGroup } from "~/types/core/play-group/play-group-db";


export const PlayGroupDetailsComponent = ({ playGroup }: { playGroup: DbGamingGroup }) => {
  return (
    <div>
      <h6>{playGroup.name}</h6>
      <p>
        <pre>
          {JSON.stringify(playGroup.memberIdentities, null, 2)}
        </pre>
      </p>
    </div>
  )
}