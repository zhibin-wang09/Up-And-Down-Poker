import { useEffect } from "react";
import socket from "../../connection/socket";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Center,
  FormControl,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

interface joinGameInput {
  roomID: number;
  playerName: string;
}

function CreateGameForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<joinGameInput>();
  const watchPlayerName = watch("playerName");
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("sendRoomID", (roomID) => {
      navigate(`/waiting/${roomID}`);
    });

    return () => {
      socket.off("sendRoomID");
    };
  }, [watchPlayerName, navigate]);

  const createGame: SubmitHandler<joinGameInput> = (data: joinGameInput) => {
    socket.emit("joinGameRoom", data.roomID);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <Center height="100vh">
        <Box>
          <Stack direction={["column"]} spacing={10}>
            <Text fontSize="4xl" as="b">
              Up And Down
            </Text>
            <form onSubmit={handleSubmit(createGame)}>
              <FormControl>
                <Stack direction={["column"]} spacing={10}>
                  <Input
                    {...register("roomID", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    placeholder="Game Code"
                    size="md"
                  ></Input>
                  <Input
                    {...register("playerName", {
                      required: true,
                    })}
                    placeholder="Player Name"
                    size="md"
                  ></Input>
                  <Button type="submit">Start Game</Button>
                </Stack>
              </FormControl>
            </form>
          </Stack>
        </Box>
      </Center>
    </motion.div>
  );
}

export default CreateGameForm;
