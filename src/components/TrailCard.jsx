// src/components/TrailCard.jsx
import {
  Card,            // namespace     → Card.Root, Card.Header, …
  Heading,
  Text,
  Badge,
  Stack,
} from "@chakra-ui/react";

export default function TrailCard({ trail }) {
  const { name, length_km, height_km, difficulty } = trail;

  return (
    <Card.Root shadow="sm" borderRadius="2xl">
      <Card.Header pb={0}>
        <Heading size="md">{name}</Heading>
      </Card.Header>

      <Card.Body pt={2}>
        <Stack fontSize="sm" spacing={1}>
          <Text>Duljina: {length_km} km</Text>
          <Text>Uk. uspon: {Math.round(height_km * 1000)} m</Text>
          <Badge w="fit-content" colorScheme="blue">
            {difficulty}
          </Badge>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
