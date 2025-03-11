import '../../App.css'


export const LandingPage = () => {

  return (
    <>
      <h1>Welcome to Brute Force Games</h1>
      <h3>
        Brute Force Games - an open source, browser-based board game engine
      </h3>

      <p>
        No "server" required. Game state is stored locally in player browsers and shared via sync engines.
      </p>
      <p>
        State based programming - use Redux-like actions to change your game state
      </p>
      <p>
        <a href="https://github.com/brute-force-games/bfg-starter">
          Brute Force Games Starter on GitHub
        </a>
      </p>
    </>
  )
}
