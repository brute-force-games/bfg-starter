import { Button } from "@mui/material";


export const DexieAdminPage = () => {

  const fetchToken = async () => {

    // const token = await bfgDb.cloud.currentUser.getToken();
    // console.log("DexieAdminPage: token", token);
  };

  // useEffect(() => {
  //   fetchToken();
  // }, []);

  return (
    <div>
      <h1>Dexie Admin</h1>
      <Button onClick={fetchToken}>Fetch Token</Button>
    </div>
  );
};
