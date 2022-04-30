import { useState, useRef, useEffect } from "react";
// Components
import Header from "../components/Header";
import ProtectedPage from "../components/ProtectedPage";
// Chakra Ui
import {
  InputGroup,
  Container,
  Box,
  AspectRatio,
  SimpleGrid,
  Divider,
  Input,
  Button,
  Heading,
  List,
  ListItem,
  Text,
  Badge,
  Spinner,
} from "@chakra-ui/react";
// Hooks
import { useAuth, useInterval } from "../hooks";

function Home() {
  const [file, setFile] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("not started");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [proccessButtonOpacity, setProccessButtonOpacity] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    const src = URL.createObjectURL(new Blob([file], { type: "video/mp4" }));
    setVideoSrc(src);
  }, [file]);

  const { token } = useAuth();
  function submitFileForProccessing(file) {
    fetch("https://api.symbl.ai/v1/process/video", {
      method: "POST",
      headers: {
        "x-api-key": token,
        "Content-Type": "video/mp4",
      },
      body: file,
      json: true,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setConversationId(data.conversationId);
        setJobId(data.jobId);
      });

    setIsLoading(true);
    setProccessButtonOpacity(true);
  }

  useInterval(
    () => {
      fetch(`https://api.symbl.ai/v1/job/${jobId}`, {
        method: "GET",
        headers: {
          "x-api-key": token,
        },
      })
        .then((res) => res.json())
        .then((data) => setStatus(data.status));
    },
    1000,
    status === "completed" || !jobId
  );

  function getTranscripts() {
    fetch(`https://api.symbl.ai/v1/conversations/${conversationId}/messages`, {
      method: "GET",
      headers: {
        "x-api-key": token,
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => setMessages(data.messages));
  }

  useEffect(() => {
    if (status === "completed") {
      getTranscripts();
    }
  }, [status]);

  useEffect(() => {
    setIsLoading(false);
  }, [messages.length > 0]);

  return (
    <>
      <Header />
      <ProtectedPage>
        <Container maxWidth="1200px">
          <Box marginBottom="1rem">
            <InputGroup marginBottom="1rem">
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files[0])}
                ref={videoRef}
                padding="0.25rem 0.5rem"
              />
            </InputGroup>
            <Box bg="lightgrey" marginBottom="1rem">
              <AspectRatio maxH="400px" ratio={16 / 9}>
                <video src={videoSrc} id="video-summary" controls />
              </AspectRatio>
            </Box>
            <Button
              colorScheme="teal"
              size="md"
              onClick={() => submitFileForProccessing(file)}
              opacity={proccessButtonOpacity && "0.5"}
              pointerEvents={proccessButtonOpacity && "none"}
            >
              Send for proccessing
            </Button>
          </Box>
          <Divider orientation="horizontal" />
          <Heading>Proccessing Data</Heading>
          <SimpleGrid
            columns={2}
            spacingX="40px"
            spacingY="20px"
            marginTop="1rem"
          >
            <Box bg="lightgrey">
              <Container margin="1rem">
                <Heading as="h4" size="md">
                  Transcripts pulled from Conversation API
                </Heading>
                <List spacing={3} margin="2rem">
                  {messages.map((message) => (
                    <ListItem key={message.id}>
                      <Container>
                        <Text fontSize="lg">{message.text}</Text>
                        <Badge colorScheme="green">
                          {`${new Date(
                            message.startTime
                          ).toDateString()} ${new Date(
                            message.startTime
                          ).toTimeString()}`}
                        </Badge>
                      </Container>
                    </ListItem>
                  ))}
                </List>
              </Container>
            </Box>
          </SimpleGrid>
        </Container>
        {isLoading && (
          <Container
            width="500px"
            height="500px"
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            boxShadow="0 0 500px rgba(0, 0, 0, 0.8)"
            borderRadius="10px"
          >
            <Container
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              height="100%"
            >
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
                marginBottom="0.5rem"
              />
              <Text>Please wait, it may take a while...</Text>
            </Container>
          </Container>
        )}
      </ProtectedPage>
    </>
  );
}

export default Home;
