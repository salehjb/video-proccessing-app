import { useState } from "react";
// Chakra Ui
import {
  Container,
  Button,
  Input,
  Stack,
  ListItem,
  Text,
  UnorderedList,
  Link,
} from "@chakra-ui/react";
// Hooks
import { useAuth } from "../hooks";

function ProtectedPage({ children }) {
  const { token, setToken } = useAuth("");
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");

  const isLoggedIn = token;

  async function loginToSymbl() {
    const response = await fetch("https://api.symbl.ai/oauth2/token:generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        type: "application",
        appId,
        appSecret,
      }),
    });
    const json = await response.json();
    setToken(json.accessToken);
    console.log(json);
  }

  return (
    <div>
      {!isLoggedIn ? (
        <Container>
          <Stack spacing={3} marginBottom="1rem">
            <Input
              placeholder="appId"
              size="md"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
            />
            <Input
              placeholder="appSecret"
              size="md"
              value={appSecret}
              onChange={(e) => setAppSecret(e.target.value)}
            />
          </Stack>
          <Button onClick={loginToSymbl}>Login</Button>
          <UnorderedList marginTop="1rem">
            <ListItem>
              Please Signup in{" "}
              <a
                href="https://symbl.ai"
                target="_blank"
                rel="noreferrer"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                Symbl.ai
              </a> {" "}
              (Use VPN)
            </ListItem>
            <ListItem>
              After Signup, you will get your appId and appSecret
            </ListItem>
          </UnorderedList>
        </Container>
      ) : (
        children
      )}
    </div>
  );
}

export default ProtectedPage;
