import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Polyline,
} from "react-leaflet";
import { Box, Input, VStack, Text, HStack, Spinner } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { AddressObject, Destination } from "@/types/types";

interface Position {
  lat: number;
  lng: number;
  city?: string;
}

interface TripMapProps {
  destinations?: Destination[];
  onLocationSelect: (addrObj: AddressObject, lat: number, lng: number) => void;
  startPos: Position;
  endPos: Position;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address: Record<string, string>;
}

const createIcon = (color: string) =>
  L.icon({
    iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const StartIcon = createIcon("green");
const EndIcon = createIcon("red");
const SavedIcon = createIcon("blue");

function MapController({
  routePoints,
  destinationsCount,
}: {
  routePoints: [number, number][];
  destinationsCount: number;
}) {
  const map = useMap();
  const lastCount = useRef(destinationsCount);

  useEffect(() => {
    if (!routePoints || routePoints.length === 0) return;

    const validPoints = routePoints.filter(
      (p) =>
        p &&
        p.length === 2 &&
        typeof p[0] === "number" &&
        typeof p[1] === "number",
    );

    if (validPoints.length > 0) {
      try {
        const bounds = L.latLngBounds(validPoints as L.LatLngExpression[]);
        if (
          destinationsCount !== lastCount.current ||
          lastCount.current === 0
        ) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
          lastCount.current = destinationsCount;
        }
      } catch (err) {
        console.error("The map could not calculate the boundaries:", err);
      }
    }
  }, [routePoints, destinationsCount, map]);

  return null;
}

export const TripMap = ({
  destinations = [],
  onLocationSelect,
  startPos,
  endPos,
}: TripMapProps) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRoute = async () => {
      if (
        !startPos?.lat ||
        !endPos?.lat ||
        startPos.lat === 0 ||
        endPos.lat === 0
      ) {
        setRoutePoints([]);
        return;
      }

      const waypoints = [
        `${startPos.lng},${startPos.lat}`,
        ...destinations.map((d: Destination) => `${d.longitude},${d.latitude}`),
        `${endPos.lng},${endPos.lat}`,
      ].join(";");

      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`,
          { signal: controller.signal },
        );
        const data = await res.json();
        if (data.code === "Ok") {
          const coords = data.routes[0].geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]],
          );
          setRoutePoints(coords);
        }
      } catch (e: any) {
        if (e.name !== "AbortError") {
          console.error("Error while plotting route:", e);
        }
      }
    };

    fetchRoute();
    return () => controller.abort();
  }, [startPos.lat, startPos.lng, endPos.lat, endPos.lng, destinations.length]);

  useEffect(() => {
    let isMounted = true;

    if (search.length < 1) {
      setResults([]);
      return;
    }

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&addressdetails=1&limit=6&accept-language=sr-Latn`,
        );
        const data = await res.json();

        if (isMounted) {
          setResults(data || []);
        }
      } catch (e) {
        console.error("Nominatim error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(t);
    };
  }, [search]);

  function ResizeMap() {
    const map = useMap();

    useEffect(() => {
      map.invalidateSize();

      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });

      const container = map.getContainer();
      if (container) {
        resizeObserver.observe(container);
      }

      const timer = setTimeout(() => map.invalidateSize(), 500);

      return () => {
        clearTimeout(timer);
        if (container) resizeObserver.unobserve(container);
      };
    }, [map]);

    return null;
  }

  return (
    <Box
      position="relative"
      w="full"
      h="100%"
      borderRadius="3xl"
      overflow="hidden"
      minH="300px"
    >
      <Box
        position="absolute"
        top={4}
        left="50px"
        right={4}
        zIndex={1000}
        maxW="350px"
      >
        <HStack
          bg={{ base: "white", _dark: "gray.800" }}
          p={2}
          borderRadius="2xl"
          shadow="dark-lg"
          border="2px solid"
          borderColor={{ base: "teal.500", _dark: "teal.400" }}
          backdropFilter="blur(10px)"
        >
          <Input
            placeholder="Find city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            border="none"
            color={{ base: "gray.800", _dark: "white" }}
            _focus={{ ring: 0 }}
            fontSize="sm"
          />
          {loading && <Spinner size="xs" color="teal.400" />}
        </HStack>

        {results.length > 0 && (
          <VStack
            bg={{ base: "white", _dark: "gray.900" }}
            mt={2}
            borderRadius="xl"
            shadow="dark-lg"
            align="stretch"
            maxH="200px"
            overflowY="auto"
            border="1px solid"
            borderColor={{ base: "gray.100", _dark: "whiteAlpha.100" }}
          >
            {results.map((r, i) => (
              <Box
                key={i}
                p={3}
                fontSize="xs"
                cursor="pointer"
                color={{ base: "gray.800", _dark: "white" }}
                _hover={{ bg: "teal.500/10" }}
                onClick={() => {
                  const cityName = r.display_name.split(",")[0];

                  const addressParts = r.display_name.split(",");
                  const countryName =
                    addressParts[addressParts.length - 1].trim();

                  onLocationSelect(
                    {
                      city: cityName,
                      country: countryName,
                    },
                    parseFloat(r.lat),
                    parseFloat(r.lon),
                  );
                  setResults([]);
                  setSearch("");
                }}
              >
                <Text fontWeight="bold">{r.display_name}</Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      <MapContainer
        center={[44.78, 20.44]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        key="main-trip-map"
      >
        <ResizeMap />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <MapController
          routePoints={routePoints}
          destinationsCount={
            destinations.length +
            (startPos.lat !== 0 ? 1 : 0) +
            (endPos.lat !== 0 ? 1 : 0)
          }
        />

        {startPos?.lat !== 0 && (
          <Marker position={[startPos.lat, startPos.lng]} icon={StartIcon} />
        )}
        {endPos?.lat !== 0 && (
          <Marker position={[endPos.lat, endPos.lng]} icon={EndIcon} />
        )}

        {destinations.map(
          (d: Destination, i: number) =>
            d.latitude && (
              <Marker
                key={i}
                position={[d.latitude, d.longitude]}
                icon={SavedIcon}
              />
            ),
        )}

        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: "#319795",
              weight: 5,
              opacity: 0.8,
            }}
          />
        )}
      </MapContainer>
    </Box>
  );
};
