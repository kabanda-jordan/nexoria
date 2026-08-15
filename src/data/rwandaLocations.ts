export interface DistrictData {
  name: string;
  sectors: Record<string, string[]>;
}

export const RWANDA_LOCATIONS: Record<string, DistrictData> = {
  "Gasabo": {
    name: "Gasabo (Kigali)",
    sectors: {
      "Kimironko": ["Bibare", "Kibagabaga", "Nyagatovu"],
      "Remera": ["Rukiri I", "Rukiri II", "Nyarutarama"],
      "Kacyiru": ["Kamatamu", "Kibaza", "Kamutwa"],
      "Gisozi": ["Musezero", "Ruhango"],
      "Jabana": ["Akamatamu", "Bweramvura", "Kabuye"],
      "Ndera": ["Cyaruzinge", "Kibenga", "Mukuyu"],
      "Gikomero": ["Gicaca", "Gasogi"],
    }
  },
  "Nyarugenge": {
    name: "Nyarugenge (Kigali)",
    sectors: {
      "Nyarugenge": ["Biryogo", "Kiyovu", "Rwampara"],
      "Nyamirambo": ["Gikondo", "Rwezamenyo", "Tetero"],
      "Kizi": ["Kanyinya", "Mageragere"],
      "Kimisagara": ["Kigali", "Muhanika"],
    }
  },
  "Kicukiro": {
    name: "Kicukiro (Kigali)",
    sectors: {
      "Niboye": ["Gatare", "Niboye"],
      "Kanombe": ["Kabeza", "Rubirizi"],
      "Gikondo": ["Kanserege", "Kinunga"],
      "Kigarama": ["Kigarama", "Rweru"],
      "Masaka": ["Ayabaraya", "Mbabe"],
    }
  },
  "Musanze": {
    name: "Musanze (Northern)",
    sectors: {
      "Muhoza": ["Cyivugiza", "Kigombe", "Mpenge"],
      "Kinigi": ["Kampanga", "Nyonirima"],
      "Cyuve": ["Buramira", "Rwebeya"],
      "Busogo": ["Gisesero", "Sahara"],
    }
  },
  "Rubavu": {
    name: "Rubavu (Western)",
    sectors: {
      "Gisenyi": ["Bugiande", "Kivumu", "Nyamirambo"],
      "Rubavu": ["Byahi", "Rugerero"],
      "Kanama": ["Karisimbi", "Mahoko"],
    }
  },
  "Huye": {
    name: "Huye (Southern)",
    sectors: {
      "Ngoma": ["Matyazo", "Ngoma"],
      "Mukura": ["Buhiba", "Sahera"],
      "Tumba": ["Cyarwa", "Gitwa"],
    }
  },
  "Rwamagana": {
    name: "Rwamagana (Eastern)",
    sectors: {
      "Kigabiro": ["Bwinsanga", "Cyanya"],
      "Muhazi": ["Nsyira", "Rweru"],
    }
  },
  "Rusizi": {
    name: "Rusizi (Western)",
    sectors: {
      "Kamembe": ["Cyangugu", "Gihundwe"],
      "Gihundwe": ["Kihumu", "Murangi"],
    }
  }
};
