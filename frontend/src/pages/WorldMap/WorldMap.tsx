import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Box, Spinner, Center, Grid, Text, VStack } from "@chakra-ui/react";
import { Navigation, Car, Footprints, Compass, TentTree } from "lucide-react";
import api from "@/api/axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { StatCard } from "@/components/StatCard";
import { worldmapStyles as styles } from "./WorldMap.styles";
import { getDistance } from "@/utils/helpers";
import type { Trip } from "@/types/types";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export const WorldMap = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const tripCount = trips.length;
  let travelStyle = "";
  let travelInfo = "";
  let travelIcon = Footprints;

  useEffect(() => {
    const fetchAllTrips = async () => {
      try {
        const res = await api.get("/trips?limit=1000");
        setTrips(res.data.trips);
      } catch (err) {
        console.error("Error fetching trips for map:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTrips();
  }, []);

  const totalKm = trips.reduce(
    (sum, t: Trip) =>
      sum + getDistance(t.startLat, t.startLng, t.endLat, t.endLng),
    0,
  );

  if (tripCount <= 5) {
    travelStyle = "Weekender";
    travelInfo =
      "You're just getting started! Keep exploring to unlock new ranks.";
    travelIcon = Footprints;
  } else if (tripCount > 5 && tripCount <= 10) {
    travelStyle = "Globetrotter";
    travelInfo =
      "You've seen some things! Traveling is becoming your second nature.";
    travelIcon = Compass;
  } else {
    travelStyle = "Road Warrior";
    travelInfo = "Master of the road! Your passport must be crying for mercy.";
    travelIcon = TentTree;
  }

  if (loading) {
    return (
      <Center h="500px">
        <Spinner color="teal.500" size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <Grid {...styles.statsGrid}>
        <StatCard
          icon={Car}
          label="TOTAL TRIPS"
          value={trips.length}
          color="teal"
          info="Total number of trips planned and completed."
        />
        <StatCard
          icon={Navigation}
          label="Distance"
          value={`${Math.round(totalKm).toLocaleString()} km`}
          color="blue"
          info="Total straight-line distance covered."
        />
        <StatCard
          icon={travelIcon}
          label="Travel Style"
          value={travelStyle}
          color="orange"
          info={travelInfo}
        />
      </Grid>

      <Box {...styles.mapWrapper}>
        <MapContainer
          center={[44.7866, 20.4489]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {trips.map((trip: Trip) => (
            <Marker key={trip._id} position={[trip.endLat, trip.endLng]}>
              <Popup>
                <VStack align="start" gap={1} p={1}>
                  <Text {...styles.popupTitle}>{trip.title}</Text>
                  <Text {...styles.popupLocation}>📍 {trip.endCity}</Text>
                  <Text {...styles.popupBudget}>
                    Budget: {trip.totalBudget} €
                  </Text>
                </VStack>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
};
