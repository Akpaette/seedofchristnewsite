import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import type { Branch } from "@/lib/branches-data";
import { BRANCH_COORDINATES } from "@/lib/branch-coordinates";
import "leaflet/dist/leaflet.css";

function MapFocus({ branch }: { branch: Branch | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (!branch) return;
    const coordinates = BRANCH_COORDINATES[branch.name];
    if (coordinates) map.flyTo([...coordinates], branch.international ? 12 : 11, { duration: 0.8 });
  }, [branch, map]);
  return null;
}

export default function BranchMapClient({ branches, selectedName, onSelect }: {
  branches: Branch[];
  selectedName: string | undefined;
  onSelect: (name: string) => void;
}) {
  const mapped = branches.filter((branch) => BRANCH_COORDINATES[branch.name]);
  const selected = branches.find((branch) => branch.name === selectedName);
  const internationalOnly = mapped.length > 0 && mapped.every((branch) => branch.international);

  return (
    <div className="branch-map h-[24rem] w-full overflow-hidden border border-line/35 md:h-[32rem]">
      <MapContainer
        center={internationalOnly ? [51.645943, -0.050302] : [8.3, 6.6]}
        zoom={internationalOnly ? 11 : 6}
        minZoom={3}
        scrollWheelZoom={false}
        className="h-full w-full"
        aria-label="Interactive map of verified Seed of Christ Golden Church branch locations"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFocus branch={selected} />
        {mapped.map((branch) => {
          const coordinates = BRANCH_COORDINATES[branch.name];
          if (!coordinates) return null;
          const active = selectedName === branch.name;
          return (
            <CircleMarker
              key={branch.name}
              center={[...coordinates]}
              radius={active ? 10 : 7}
              pathOptions={{
                color: active ? "#F5F3EE" : "#0D0D0D",
                fillColor: active ? "#C9A84C" : "#C9A84C",
                fillOpacity: active ? 1 : 0.82,
                weight: active ? 3 : 2,
              }}
              eventHandlers={{ click: () => onSelect(branch.name) }}
            >
              <Popup>
                <strong>{branch.name}</strong>
                <br />
                {branch.address}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
