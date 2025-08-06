import { useEffect, useState } from "react";
import { SimpleGrid, Heading, Text } from "@chakra-ui/react";
import TrailCard from "./TrailCard";

// 🚧  placeholder rute
const demoTrails = [
  {
    id: 11,
    name: "Šetnica Oštrc",
    length_km: 6.4,
    height_km: 0.55,
    difficulty: "Umjereno",
  },
  {
    id: 12,
    name: "Samobor Japetić",
    length_km: 14.2,
    height_km: 0.92,
    difficulty: "Zahtjevno",
  },
];

export default function UserTrails({ userId }) {
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    // ovdje će ići axios GET `/api/users/{userId}/trails`
    //      .then(res => setTrails(res.data))
    setTrails(demoTrails);
  }, [userId]);

  if (trails.length === 0)
    return <Text>Nema spremljenih ruta.</Text>;

  return (
    <>
      <Heading size="md" mb={4}>
        Moje rute ({trails.length})
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {trails.map((t) => (
          <TrailCard key={t.id} trail={t} />
        ))}
      </SimpleGrid>
    </>
  );
}
