// Branch directory — supplied verbatim by the church (67 branches).
// `address` is the supplied display text and must NOT be spell-corrected.
// `state` contains structured state data only; addresses remain display text.
// `country` is set only where the supplied text makes it explicit.

export type Branch = {
  name: string;
  address: string;
  state?: string;
  country?: string;
  international?: boolean;
  hq?: boolean;
};

const NG = "Nigeria";

export const BRANCHES: Branch[] = [
  { name: "Abule Egba", address: "Seed of Christ Golden Church, Abule-Egba, Sebioba Aderupoko Transformers, Abule-Egba, Lagos State.", state: "Lagos", country: NG },
  { name: "Abuja Branch 1", address: "Seed of Christ Golden Church, Dutse, Behind Garden Hotel, New Life Junction, Dutse, Abuja." },
  { name: "Abuja Branch 2", address: "Seed of Christ Golden Church, Maraba, Boundary Plaza Hotel, MOPOL Check Point, back of Dunamis Church, Mararaba Road, Abuja." },
  { name: "Ago-Are", address: "Seed of Christ Golden Church, Ago-Are, Viewing Centre, Tede Junction, Ago-Are, Oyo State.", state: "Oyo", country: NG },
  { name: "Agege", address: "Seed of Christ Golden Church, Agege, Lagos State.", state: "Lagos", country: NG },
  { name: "Agbado-Oja", address: "Seed of Christ Golden Church, Agbbado-Oja, Rafco Bus/Stop, Kolawole, Ile Pupa St., Agbado-Oja, Ogun State.", state: "Ogun", country: NG },
  { name: "Agric", address: "Seed of Christ Golden Church, Agric-Ikorodu, Ogun State.", state: "Ogun", country: NG },
  { name: "Agowa", address: "Seed of Christ Golden Church, Agbowa, Ogun State.", state: "Ogun", country: NG },
  { name: "Ajah", address: "Seed of Christ Golden Church, Ajah, Lezina Event Centre, beside Grocery Bazaar, Addo Road, Ajah, Lagos." },
  { name: "Ajegunle", address: "Seed of Christ Golden Church, Ajegunle, Lagos State.", state: "Lagos", country: NG },
  { name: "Akure", address: "Seed of Christ Golden Church, Akure, Ondo State.", state: "Ondo", country: NG },
  { name: "Akute", address: "Seed of Christ Golden Church, Akute, Ajuwon Road, Ile Ise Bus-Stop, Akute, Ogun State.", state: "Ogun", country: NG },
  { name: "Akwa-Ibom", address: "Seed of Christ Golden Church, Uyo, Ring Road 3, after Mighty and Brave Blocks Industry, before Hensek Company, Uyo, Akwa Ibom State.", state: "Akwa Ibom", country: NG },
  { name: "Apata", address: "Seed of Christ Golden Church, , Apata, Dogo bus stop, sawmill road, Omiyadun, Apata, Ibadan, Oyo state.", state: "Oyo", country: NG },
  { name: "Apete", address: "Seed of Christ Golden Church, Apete, Ola Adura Street, Apete Branch, Ibadan, Oyo State.", state: "Oyo", country: NG },
  { name: "Asese", address: "Seed of Christ Golden Church Asese Branch, Papa Jabutu Transformers, Ogun State.", state: "Ogun", country: NG },
  { name: "Badagry Branch 1", address: "Seed of Christ Golden Church, Badagry Mowo, opposite Idi, Badagry, Lagos State.", state: "Lagos", country: NG },
  { name: "Badagry Branch 2", address: "Seed of Christ Golden Church, Badagry, Lagos State.", state: "Lagos", country: NG },
  { name: "Bayelsa", address: "Seed of Christ Golden Church, Yenagoa, Bayelsa State.", state: "Bayelsa", country: NG },
  { name: "Eleweran, Abeokuta Branch 3", address: "Seed of Christ Golden Church, Eleweran, A & A Akingbala Road, in front of Baba Egbe's house, Ogun State.", state: "Ogun", country: NG },
  { name: "Elega, Abeokuta Branch 2", address: "Seed of Christ Golden Church, Elega, Behind Sembad Filling Station, adjacent Tipper Garage, Elega, Abeokuta, Ogun State.", state: "Ogun", country: NG },
  { name: "Fajol, Abeokuta Branch 1", address: "Seed of Christ Golden Church, Fajol, Gbàremu Fajol, Obantoko, Abeokuta, beside Adeline School, Abeokuuta, Ogun State.", state: "Ogun", country: NG },
  { name: "Headquarters", address: "Seed of Christ Golden Church, Headquarters, Land of Reality Worldwide, Gbàremu Idi Obi, Airport Area Alakia, Ibadan, Oyo State.", state: "Oyo", country: NG, hq: true, phone: "+234 806 029 1930" },
  { name: "Ibafo", address: "Seed of Christ Golden Church, Ibafo, Magada Onimole, Ibafo, Ogun State.", state: "Ogun", country: NG },
  { name: "Igbeti", address: "Seed of Christ Golden Church, Igbeti, Ogun State.", state: "Ogun", country: NG },
  { name: "Igbogbo", address: "Seed of Christ Golden Church, Igbogbo, Ikorodu, Lagos State.", state: "Lagos", country: NG },
  { name: "Igando", address: "Seed of Christ Golden Church, Igando, LASU–Igando Road by Hotel Bus Stop; Oko Oloyun Event Center, Lagos State.", state: "Lagos", country: NG },
  { name: "Iganna", address: "Seed of Christ Golden Church, Igana, Along Ilero Road, Sabo Hall, Iganna, Oyo State.", state: "Oyo", country: NG },
  { name: "Ifo Branch 1", address: "Seed of Christ Golden Church, Ifo 1, Omo Ago Bus Stop, Ayilara Estate, off Olu Ofo, Ifo Palace, Ogun State.", state: "Ogun", country: NG },
  { name: "Ifo Branch 2", address: "Seed of Christ Golden Church, Ifo Branch 2, Ogun State.", state: "Ogun", country: NG },
  { name: "Ijoko", address: "Seed of Christ Golden Church, Ijoko, Oyo Stae.", state: "Oyo", country: NG },
  { name: "Ilaro", address: "Seed of Christ Golden Church, Ilaro, Tetede Event Center, along Federal Polytechnic Road, Ilaro, Ogun State.", state: "Ogun", country: NG },
  { name: "Ilesa", address: "Seed of Christ Golden Church, Ilesa, Agric. Stadium, Irojo, Osun-Ankara, Ilesa, Osun State.", state: "Osun", country: NG },
  { name: "Ilorin", address: "Seed of Christ Golden Church, Illorin, Unity Hall, opposite Aroma Restaurant, beside Captain Cook, Unity Road, immediately after Unity Bridge, Illorin, Kwara state.", state: "Kwara", country: NG },
  { name: "Iseyin", address: "Seed of Christ Golden Church, Iseyin, Balogun Hall, opposite Afoa Filling Station, Esa-Oke, Oyo State.", state: "Oyo", country: NG },
  { name: "Ita-Oluwo", address: "Seed of Christ Golden Church, Ita-Oluwo, Ikorodu, Lagos State.", state: "Lagos", country: NG },
  { name: "Ikorodu", address: "Seed of Christ Golden Church, Ikorodu, 3rd Power Line, Garage Bus Stop, off Ijede Road, Ikorodu, Lagos." },
  { name: "Kaduna", address: "Seed of Christ Golden Church, Kaduna, Aguillo Multipurpose Center, Maxi Plus Filling Station, Romi Express Way, Kaduna." },
  { name: "Kogi Branch 1", address: "Seed of Christ Golden Church, Isanlu, Behind St. Kizito College, Tedo Makutu, Yagba East, Isanlu, Kogi State.", state: "Kogi", country: NG },
  { name: "Kogi Branch 2", address: "Seed of Christ Golden Church, Kogi, Itakete Ide Mopa Amuro, Kogi State.", state: "Kogi", country: NG },
  { name: "Kogi Branch 3", address: "Seed of Christ Golden Church, Egbe, K-D Primary School Hall 1, Behnd Central Palace, Egbe, Kogi State.", state: "Kogi", country: NG },
  { name: "Lufuwape", address: "Seed of Christ Golden Church, National Camp-ground, AP bus stop, LUFUWAPE, Ogun State.", state: "Ogun", country: NG },
  { name: "Lusada", address: "Seed of Christ Golden Church, Lusada, Loral B/Stop, Agbara–Atan Expressway, Lusada-Igbesa, Ogun State.", state: "Ogun", country: NG },
  { name: "Minna", address: "Seed of Christ Golden Church, Minna, Brighter School, Minna, Tunga by-pass." },
  { name: "Moniya", address: "Seed of Christ Golden Church, Moniya, Oyo State.", state: "Oyo", country: NG },
  { name: "Muslim", address: "Seed of Christ Golden Church, Olunloye, Ifenikoko Cooperative Hall 2, Ogbere Idi Osan, Ibadan, Oluyole, Ibadan, Oyo State.", state: "Oyo", country: NG },
  { name: "Ogbomoso", address: "Seed of Christ Golden Church, Ogbomoso, Oyo State.", state: "Oyo", country: NG },
  { name: "Okeho", address: "Seed of Christ Golden Church, Okeho, Oyo State.", state: "Oyo", country: NG },
  { name: "Ologuneru", address: "Seed of Christ Golden Church, Ologuneru, Carpenter bus-stop, inside Basola Petrol Filling Station, beside Vanguard Pharmacy, Ologuneru, Ibadan, Oyo State.", state: "Oyo", country: NG },
  { name: "Olodo", address: "Seed of Christ Golden Church, Olodo, Olodo Garage, Ibadan, Oyo State.", state: "Oyo", country: NG },
  { name: "Olunloyo", address: "Seed of Christ Golden Church, , Oluunloyo, Amuloko Road, Olunloyo area, behind Ladekol Filling Station, Ibadan, Oyo State.", state: "Oyo", country: NG },
  { name: "Omi", address: "Seed of Christ Golden Church, Omi=Adio, Aba Araba, Anigilaje, Omi Adio, Ido Local Government, Oyo State.", state: "Oyo", country: NG },
  { name: "Otta", address: "Seed of Christ Golden Church, Sango-Otta, Nice Estate, Ambassador Ota, Ogun State.", state: "Ogun", country: NG },
  { name: "Ore", address: "Seed of Christ Golden Church, Ore, Agbani Hotel, Ibo Camp, Ore, Ondo State.", state: "Ondo", country: NG },
  { name: "Osere", address: "Seed of Christ Golden Church, Osere, Matogun, Osere Titilayo, Ogun State.", state: "Ogun", country: NG },
  { name: "Osogbo", address: "Seed of Christ Golden Church, Osogbo, Adetoro Street, Dada Estate, behind Ejigbo Garage, beside Foursquare Gospel Church." },
  { name: "Owode Yewa", address: "Seed of Christ Golden Church, Owode-Yewa, Ado-Odo Road, Owode Yewa." },
  { name: "Portharcourt Branch 1", address: "Seed of Christ Golden Church, Eliozu, Unity Hall along East West Road, opposite Royal Ink Motel Park, before Eliozu, Port Harcourt, Rivers State.", state: "Rivers", country: NG },
  { name: "Portharcourt Branch 2", address: "Seed of Christ Golden Church, Rumuosi, New Branch, Behind Major Supermarket, Rumosi Junction, East West Road, Port Harcourt, Rivers State.", state: "Rivers", country: NG },
  { name: "Portharcourt Branch 3", address: "Seed of Christ Golden Church, Eneka, Civic Center beside Eneka Health Center, first market roundabout, Eneka, Port Harcourt." },
  { name: "Ring-road", address: "Seed of Christ Golden Church, Ring Road, Ibadan, Oyo State.", state: "Oyo", country: NG },
  { name: "Sagamu", address: "Seed of Christ Golden Church, Sagamu, Bright Fashion at Awa Bat Hall, Sagamu, Ogun State.", state: "Ogun", country: NG },
  { name: "Saki", address: "Seed of Christ Golden Church, Saki, Idi-Araba, behind INEC Office, opposite High Court, Oyo State.", state: "Oyo", country: NG },
  { name: "Soka", address: "Seed of Christ Golden Church, Soka, Bodmas Bus Stop, Sebioba Junction, Soka, Ibadan, Oyo State.", state: "Oyo", country: NG },
  { name: "UK", address: "Seed of Christ Golden Church, United Kiingdom, Heron Hall Academy, London, EN3 45A, opposite MFM. Bus: 349, 779 or 491; Train: Southbury Train Station.", country: "United Kingdom", international: true },
  { name: "Yemetu", address: "Seed of Christ Golden Church, Yemetu, Total Garden Mobile Petrol Station, Oke-Aremo, Ibadan, Oyo State.", state: "Oyo", country: NG },
  { name: "Oyo", address: "Seed of Christ Golden Church, Oyo Town, Oyo State.", state: "Oyo", country: NG },
];

export const sortBranches = (list: Branch[]) =>
  [...list].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" }) ||
    a.address.localeCompare(b.address),
  );

export const INTERNATIONAL = "International";

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Federal Capital Territory",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;

function stateKey(value: string) {
  return value.toLocaleLowerCase("en").replace(/[^a-z]/g, "").replace(/state$/, "");
}

const CANONICAL_STATES = new Map<string, string>(NIGERIAN_STATES.map((state) => [stateKey(state), state]));
CANONICAL_STATES.set("fct", "Federal Capital Territory");
CANONICAL_STATES.set("abuja", "Federal Capital Territory");
CANONICAL_STATES.set("oyostae", "Oyo");

/** Exact dictionary normalization; no substring or partial-name matches. */
export function normalizeState(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  return CANONICAL_STATES.get(stateKey(value)) ?? null;
}

/** Read an explicitly written terminal state/country clue without editing the address. */
export function branchState(branch: Branch): string | null {
  const fieldValue = normalizeState(branch.state);
  if (fieldValue) return fieldValue;
  if (branch.international) return null;
  const address = branch.address.trim();
  for (const state of [...NIGERIAN_STATES].sort((a, b) => b.length - a.length)) {
    const escaped = state.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(?:,|\\s)${escaped}(?:\\s+State)?[.\\s]*$`, "i").test(address)) return state;
  }
  if (/(?:,|\s)(?:FCT|Abuja)[.\s]*$/i.test(address)) return "Federal Capital Territory";
  return null;
}

export const branchStates = (list: Branch[]) =>
  [...new Set(list.map(branchState).filter((state): state is string => Boolean(state)))].sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" }),
  );

export const filterBranches = (list: Branch[], filter: string) =>
  filter === "all"
    ? list
    : filter === INTERNATIONAL
      ? list.filter((b) => b.international)
      : list.filter((branch) => branchState(branch) === normalizeState(filter));
