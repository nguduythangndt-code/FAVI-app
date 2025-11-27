// app/(tabs)/category/[animal]/[group]/[id].tsx

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { colors, radius, shadow, spacing } from "../../../../../src/theme";
import {logDiseaseView,type DiseaseViewSource,} from "../../../../../src/services/analytics";

// =======================
// KIỂU DỮ LIỆU CHI TIẾT BỆNH
// =======================

type DiseaseDetail = {
  name: string;

  // ===== SCHEMA CŨ =====
  cause?: string;
  symptoms?: string;
  treatment?: {
    mild?: string;
    severe?: string;
    alternative?: string;
    note?: string;

    // ===== MỞ RỘNG SCHEMA MỚI =====
    primary_drugs?: string[];
    alternative_drugs?: string[];
    symptomatic_treatment?: {
      [key: string]:
        | {
            main: string;
            alternative?: string | string[];
          }
        | string[];
    };
    supportive_care?: string[];
    dose_policy?: string;
  };

  prevention?: string | string[];

  // ===== SCHEMA MỚI =====
  summary?: string;
  causes?: string[];
  risk_factors?: string[];
  clinical_signs_detailed?: string[];
  clinical_signs_by_stage?: {
    mild?: string[];
    moderate?: string[];
    severe?: string[];
  };

  severe_case_treatment?: {
    case_type_1?: any;
    case_type_2?: any;
    note?: string;
  };

  prevention_list?: string[];
  notes?: string[];

  disclaimer?: string;
};

// =======================
// ICON THEO LOÀI
// =======================

const ANIMAL_ICONS: Record<string, string> = {
  goat: "logo-react",
  pig: "logo-octocat",
  cattle: "shapes-outline",
  chicken: "aperture-outline",
};

// =======================
// DÊ (GOAT)
// =======================

// Hô hấp
const goatRespiratoryDetails: Record<string, DiseaseDetail> = {
  ppr: require("../../../../data/goat/respiratory/detail/ppr.json"),
  mannheimiosis_severe: require("../../../../data/goat/respiratory/detail/mannheimiosis_severe.json"),
  pasteurellosis: require("../../../../data/goat/respiratory/detail/pasteurellosis.json"),
  mycoplasmosis: require("../../../../data/goat/respiratory/detail/mycoplasmosis.json"),
  pleuropneumonia: require("../../../../data/goat/respiratory/detail/pleuropneumonia.json"),
  "bronchitis-tracheitis": require("../../../../data/goat/respiratory/detail/bronchitis-tracheitis.json"),
  "environmental-pneumonia": require("../../../../data/goat/respiratory/detail/environmental-pneumonia.json"),
  "shipping-fever": require("../../../../data/goat/respiratory/detail/shipping-fever.json"),
  "verminous-pneumonia": require("../../../../data/goat/respiratory/detail/verminous-pneumonia.json"),
  aspergillosis: require("../../../../data/goat/respiratory/detail/aspergillosis.json"),
  "rhinitis-sinusitis": require("../../../../data/goat/respiratory/detail/rhinitis-sinusitis.json"),
  "aspiration-pneumonia": require("../../../../data/goat/respiratory/detail/aspiration-pneumonia.json"),
  "toxic-gas-pneumonia": require("../../../../data/goat/respiratory/detail/toxic-gas-pneumonia.json"),
  cold: require("../../../../data/goat/respiratory/detail/cold.json"),
  "chronic-pneumonia": require("../../../../data/goat/respiratory/detail/chronic-pneumonia.json"),
};

// Tiêu hoá
const goatDigestiveDetails: Record<string, DiseaseDetail> = {
  enterotoxemia_type_d: require("../../../../data/goat/digestive/detail/enterotoxemia_type_d.json"),
  johnes_disease: require("../../../../data/goat/digestive/detail/johnes_disease.json"),
  bloat: require("../../../../data/goat/digestive/detail/bloat.json"),
  coccidiosis: require("../../../../data/goat/digestive/detail/coccidiosis.json"),
  colibacillosis: require("../../../../data/goat/digestive/detail/colibacillosis.json"),
  enteritis: require("../../../../data/goat/digestive/detail/enteritis.json"),
  giardia: require("../../../../data/goat/digestive/detail/giardia.json"),
  indigestion: require("../../../../data/goat/digestive/detail/indigestion.json"),
  "rumen-acidosis": require("../../../../data/goat/digestive/detail/rumen-acidosis.json"),
  "rumen-alkalosis": require("../../../../data/goat/digestive/detail/rumen-alkalosis.json"),
  salmonellosis: require("../../../../data/goat/digestive/detail/salmonellosis.json"),
  tapeworm: require("../../../../data/goat/digestive/detail/tapeworm.json"),
};

// Ký sinh trùng
const goatParasiteDetails: Record<string, DiseaseDetail> = {
  haemonchus: require("../../../../data/goat/parasite/detail/haemonchus.json"),
  lice: require("../../../../data/goat/parasite/detail/lice.json"),
  liverfluke: require("../../../../data/goat/parasite/detail/liverfluke.json"),
  lungworm: require("../../../../data/goat/parasite/detail/lungworm.json"),
  mites: require("../../../../data/goat/parasite/detail/mites.json"),
  strongyloides: require("../../../../data/goat/parasite/detail/strongyloides.json"),
};

// Ký sinh trùng máu
const goatBloodParasiteDetails: Record<string, DiseaseDetail> = {
  anaplasmosis: require("../../../../data/goat/blood_parasite/detail/anaplasmosis.json"),
  babesiosis: require("../../../../data/goat/blood_parasite/detail/babesiosis.json"),
  theileriosis: require("../../../../data/goat/blood_parasite/detail/theileriosis.json"),
  trypanosomiasis: require("../../../../data/goat/blood_parasite/detail/trypanosomiasis.json"),
};

// Sinh sản
const goatReproductiveDetails: Record<string, DiseaseDetail> = {
  abortion: require("../../../../data/goat/reproductive/detail/abortion.json"),
  mastitis: require("../../../../data/goat/reproductive/detail/mastitis.json"),
  metritis: require("../../../../data/goat/reproductive/detail/metritis.json"),
  "milk-fever": require("../../../../data/goat/reproductive/detail/milk-fever.json"),
  "retained-placenta": require("../../../../data/goat/reproductive/detail/retained-placenta.json"),
};

// Khác
const goatOtherDetails: Record<string, DiseaseDetail> = {
  orf: require("../../../../data/goat/other/detail/orf.json"),
  cae: require("../../../../data/goat/other/detail/cae.json"),
  caseous_lymphadenitis: require("../../../../data/goat/other/detail/caseous_lymphadenitis.json"),
  fmd: require("../../../../data/goat/other/detail/fmd.json"),
  listeriosis: require("../../../../data/goat/other/detail/listeriosis.json"),
  tetanus: require("../../../../data/goat/other/detail/tetanus.json"),
  pinkeye: require("../../../../data/goat/other/detail/pinkeye.json"),
  dermatophytosis: require("../../../../data/goat/other/detail/dermatophytosis.json"),
  "heat-stress": require("../../../../data/goat/other/detail/heat-stress.json"),
  lameness: require("../../../../data/goat/other/detail/lameness.json"),
  "skin-infection": require("../../../../data/goat/other/detail/skin-infection.json"),
  injury: require("../../../../data/goat/other/detail/injury.json"),
  "nutritional-deficiency": require("../../../../data/goat/other/detail/nutritional-deficiency.json"),
  poisoning: require("../../../../data/goat/other/detail/poisoning.json"),
  allergy: require("../../../../data/goat/other/detail/allergy.json"),
};

// =======================
// HEO (PIG)
// =======================

export const pigBloodParasiteDetails: Record<string, DiseaseDetail> = {
  babesia: require("../../../../data/pig/blood_parasite/detail/babesia.json"),
  trypanosoma: require("../../../../data/pig/blood_parasite/detail/trypanosoma.json"),
  anaplasma: require("../../../../data/pig/blood_parasite/detail/anaplasma.json"),
  eperythrozoon: require("../../../../data/pig/blood_parasite/detail/eperythrozoon.json"),
};

export const pigDigestiveDetails: Record<string, DiseaseDetail> = {
  tge: require("../../../../data/pig/digestive/detail/tge.json"),
  ped: require("../../../../data/pig/digestive/detail/ped.json"),
  "swine-dysentery": require("../../../../data/pig/digestive/detail/swine-dysentery.json"),
  "edema-disease": require("../../../../data/pig/digestive/detail/edema-disease.json"),
  "lawsonia-ileitis": require("../../../../data/pig/digestive/detail/lawsonia-ileitis.json"),
  ecoli_diarrhea: require("../../../../data/pig/digestive/detail/ecoli_diarrhea.json"),
  coccidia: require("../../../../data/pig/digestive/detail/coccidia.json"),
  rotavirus: require("../../../../data/pig/digestive/detail/rotavirus.json"),
  coronavirus_tge_ped: require("../../../../data/pig/digestive/detail/coronavirus_tge_ped.json"),
  necrotic_enteritis: require("../../../../data/pig/digestive/detail/necrotic_enteritis.json"),
  salmonella_enteritis: require("../../../../data/pig/digestive/detail/salmonella_enteritis.json"),
  bloat: require("../../../../data/pig/digestive/detail/bloat.json"),
  constipation: require("../../../../data/pig/digestive/detail/constipation.json"),
  feed_poisoning: require("../../../../data/pig/digestive/detail/feed_poisoning.json"),
  gastric_ulcer: require("../../../../data/pig/digestive/detail/gastric_ulcer.json"),
  enzyme_deficiency: require("../../../../data/pig/digestive/detail/enzyme_deficiency.json"),
  gastric_torsion: require("../../../../data/pig/digestive/detail/gastric_torsion.json"),
};

export const pigOtherDetails: Record<string, DiseaseDetail> = {
  asf: require("../../../../data/pig/other/detail/asf.json"),
  csf: require("../../../../data/pig/other/detail/csf.json"),
  fmd: require("../../../../data/pig/other/detail/fmd.json"),
  "streptococcus-suis": require("../../../../data/pig/other/detail/streptococcus-suis.json"),
  erysipelas: require("../../../../data/pig/other/detail/erysipelas.json"),
  arthritis: require("../../../../data/pig/other/detail/arthritis.json"),
  "stress-syndrome": require("../../../../data/pig/other/detail/stress-syndrome.json"),
  "skin-infection": require("../../../../data/pig/other/detail/skin-infection.json"),
};

export const pigParasiteDetails: Record<string, DiseaseDetail> = {
  ascaris: require("../../../../data/pig/parasite/detail/ascaris.json"),
  strongyloides: require("../../../../data/pig/parasite/detail/strongyloides.json"),
  trichuris: require("../../../../data/pig/parasite/detail/trichuris.json"),
  lungworm: require("../../../../data/pig/parasite/detail/lungworm.json"),
  sarcoptes: require("../../../../data/pig/parasite/detail/sarcoptes.json"),
  lice: require("../../../../data/pig/parasite/detail/lice.json"),
  tapeworm: require("../../../../data/pig/parasite/detail/tapeworm.json"),
  liver_fluke: require("../../../../data/pig/parasite/detail/liver_fluke.json"),
  myiasis: require("../../../../data/pig/parasite/detail/myiasis.json"),
};

export const pigReproductiveDetails: Record<string, DiseaseDetail> = {
  "mma-syndrome": require("../../../../data/pig/reproductive/detail/mma-syndrome.json"),
  "parvo-smedi": require("../../../../data/pig/reproductive/detail/parvo-smedi.json"),
  brucella_abortion: require("../../../../data/pig/reproductive/detail/brucella_abortion.json"),
  lepto_abortion: require("../../../../data/pig/reproductive/detail/lepto_abortion.json"),
  postpartum_metritis: require("../../../../data/pig/reproductive/detail/postpartum_metritis.json"),
  mastitis: require("../../../../data/pig/reproductive/detail/mastitis.json"),
  delayed_estrus: require("../../../../data/pig/reproductive/detail/delayed_estrus.json"),
  infertility_pseudopregnancy: require("../../../../data/pig/reproductive/detail/infertility_pseudopregnancy.json"),
  dystocia: require("../../../../data/pig/reproductive/detail/dystocia.json"),
};

export const pigRespiratoryDetails: Record<string, DiseaseDetail> = {
  "glassers-disease": require("../../../../data/pig/respiratory/detail/glassers-disease.json"),
  "mycoplasma-hyorhinis": require("../../../../data/pig/respiratory/detail/mycoplasma-hyorhinis.json"),
  app: require("../../../../data/pig/respiratory/detail/app.json"),
  mycoplasma: require("../../../../data/pig/respiratory/detail/mycoplasma.json"),
  prrs: require("../../../../data/pig/respiratory/detail/prrs.json"),
  swine_influenza: require("../../../../data/pig/respiratory/detail/swine_influenza.json"),
  pasteurella: require("../../../../data/pig/respiratory/detail/pasteurella.json"),
  streptococcus_pneumonia: require("../../../../data/pig/respiratory/detail/streptococcus_pneumonia.json"),
  bordetella: require("../../../../data/pig/respiratory/detail/bordetella.json"),
  pasteurellosis: require("../../../../data/pig/respiratory/detail/pasteurellosis.json"),
  salmonella_respiratory: require("../../../../data/pig/respiratory/detail/salmonella_respiratory.json"),
  pcv2_respiratory: require("../../../../data/pig/respiratory/detail/pcv2_respiratory.json"),
};

// =======================
// BÒ (CATTLE)
// =======================

export const cattleBloodParasiteDetails: Record<string, DiseaseDetail> = {
  babesiosis: require("../../../../data/cattle/blood_parasite/detail/babesiosis.json"),
  anaplasmosis: require("../../../../data/cattle/blood_parasite/detail/anaplasmosis.json"),
  theileriosis: require("../../../../data/cattle/blood_parasite/detail/theileriosis.json"),
  trypanosomiasis: require("../../../../data/cattle/blood_parasite/detail/trypanosomiasis.json"),
};

export const cattleDigestiveDetails: Record<string, DiseaseDetail> = {
  bloat: require("../../../../data/cattle/digestive/detail/bloat.json"),
  acidosis: require("../../../../data/cattle/digestive/detail/acidosis.json"),
  ketosis: require("../../../../data/cattle/digestive/detail/ketosis.json"),
  hardware_disease: require("../../../../data/cattle/digestive/detail/hardware_disease.json"),
  enteritis: require("../../../../data/cattle/digestive/detail/enteritis.json"),
  coccidiosis: require("../../../../data/cattle/digestive/detail/coccidiosis.json"),
  salmonella: require("../../../../data/cattle/digestive/detail/salmonella.json"),
  colibacillosis: require("../../../../data/cattle/digestive/detail/colibacillosis.json"),
  fatty_liver: require("../../../../data/cattle/digestive/detail/fatty_liver.json"),
  impaction: require("../../../../data/cattle/digestive/detail/impaction.json"),
  hepatitis: require("../../../../data/cattle/digestive/detail/hepatitis.json"),
  clostridial_enterotoxemia: require("../../../../data/cattle/digestive/detail/clostridial_enterotoxemia.json"),
};

export const cattleOtherDetails: Record<string, DiseaseDetail> = {
  foot_rot: require("../../../../data/cattle/other/detail/foot_rot.json"),
  lameness: require("../../../../data/cattle/other/detail/lameness.json"),
  ringworm: require("../../../../data/cattle/other/detail/ringworm.json"),
  pinkeye: require("../../../../data/cattle/other/detail/pinkeye.json"),
  photosensitization: require("../../../../data/cattle/other/detail/photosensitization.json"),
  nutritional_deficiency: require("../../../../data/cattle/other/detail/nutritional_deficiency.json"),
  heat_stress: require("../../../../data/cattle/other/detail/heat_stress.json"),
  arthritis: require("../../../../data/cattle/other/detail/arthritis.json"),
  skin_infection: require("../../../../data/cattle/other/detail/skin_infection.json"),
};

export const cattleParasiteDetails: Record<string, DiseaseDetail> = {
  haemonchus: require("../../../../data/cattle/parasite/detail/haemonchus.json"),
  ostertagia: require("../../../../data/cattle/parasite/detail/ostertagia.json"),
  trichostrongylus: require("../../../../data/cattle/parasite/detail/trichostrongylus.json"),
  strongyloides: require("../../../../data/cattle/parasite/detail/strongyloides.json"),
  fasciola: require("../../../../data/cattle/parasite/detail/fasciola.json"),
  paramphistomum: require("../../../../data/cattle/parasite/detail/paramphistomum.json"),
  ticks_infestation: require("../../../../data/cattle/parasite/detail/ticks_infestation.json"),
  lice_infestation: require("../../../../data/cattle/parasite/detail/lice_infestation.json"),
  mange: require("../../../../data/cattle/parasite/detail/mange.json"),
};

export const cattleReproductiveDetails: Record<string, DiseaseDetail> = {
  metritis: require("../../../../data/cattle/reproductive/detail/metritis.json"),
  retained_placenta: require("../../../../data/cattle/reproductive/detail/retained_placenta.json"),
  mastitis: require("../../../../data/cattle/reproductive/detail/mastitis.json"),
  milk_fever: require("../../../../data/cattle/reproductive/detail/milk_fever.json"),
  abomasal_displacement: require("../../../../data/cattle/reproductive/detail/abomasal_displacement.json"),
  endometritis: require("../../../../data/cattle/reproductive/detail/endometritis.json"),
  ovarian_cyst: require("../../../../data/cattle/reproductive/detail/ovarian_cyst.json"),
  repeat_breeding: require("../../../../data/cattle/reproductive/detail/repeat_breeding.json"),
};

export const cattleRespiratoryDetails: Record<string, DiseaseDetail> = {
  pasteurellosis: require("../../../../data/cattle/respiratory/detail/pasteurellosis.json"),
  mannheimia: require("../../../../data/cattle/respiratory/detail/mannheimia.json"),
  brsv: require("../../../../data/cattle/respiratory/detail/brsv.json"),
  ibr: require("../../../../data/cattle/respiratory/detail/ibr.json"),
  parainfluenza: require("../../../../data/cattle/respiratory/detail/parainfluenza.json"),
  mycoplasma: require("../../../../data/cattle/respiratory/detail/mycoplasma.json"),
  lungworm: require("../../../../data/cattle/respiratory/detail/lungworm.json"),
  aspiration_pneumonia: require("../../../../data/cattle/respiratory/detail/aspiration_pneumonia.json"),
};

// =======================
// GÀ (CHICKEN)
// =======================

export const chickenBloodParasiteDetails: Record<string, DiseaseDetail> = {
  "avian-malaria": require("../../../../data/chicken/blood_parasite/detail/avian-malaria.json"),
  leucocytozoonosis: require("../../../../data/chicken/blood_parasite/detail/leucocytozoonosis.json"),
  "haemoproteus-infection": require("../../../../data/chicken/blood_parasite/detail/haemoproteus-infection.json"),
  "mixed-blood-parasites": require("../../../../data/chicken/blood_parasite/detail/mixed-blood-parasites.json"),
};

const chickenDigestiveDetails: Record<string, DiseaseDetail> = {
  "hemorrhagic-enteritis": require("../../../../data/chicken/digestive/detail/hemorrhagic-enteritis.json"),
  "ibh-adenovirus": require("../../../../data/chicken/digestive/detail/ibh-adenovirus.json"),
  "coccidiosis-intestinal": require("../../../../data/chicken/digestive/detail/coccidiosis-intestinal.json"),
  "coccidiosis-cecal": require("../../../../data/chicken/digestive/detail/coccidiosis-cecal.json"),
  "necrotic-enteritis": require("../../../../data/chicken/digestive/detail/necrotic-enteritis.json"),
  "salmonellosis-pullorum": require("../../../../data/chicken/digestive/detail/salmonellosis-pullorum.json"),
  "enteric-colibacillosis": require("../../../../data/chicken/digestive/detail/enteric-colibacillosis.json"),
  "crop-impaction": require("../../../../data/chicken/digestive/detail/crop-impaction.json"),
};

const chickenOtherDetails: Record<string, DiseaseDetail> = {
  "gumboro-ibd": require("../../../../data/chicken/other/detail/gumboro-ibd.json"),
  "mareks-disease": require("../../../../data/chicken/other/detail/mareks-disease.json"),
  fowlpox: require("../../../../data/chicken/other/detail/fowlpox.json"),
  "avian-encephalomyelitis": require("../../../../data/chicken/other/detail/avian-encephalomyelitis.json"),
  "mycoplasma-synoviae": require("../../../../data/chicken/other/detail/mycoplasma-synoviae.json"),
  "heat-stress": require("../../../../data/chicken/other/detail/heat-stress.json"),
  "cold-stress": require("../../../../data/chicken/other/detail/cold-stress.json"),
  rickets: require("../../../../data/chicken/other/detail/rickets.json"),
  gout: require("../../../../data/chicken/other/detail/gout.json"),
  "fatty-liver-syndrome": require("../../../../data/chicken/other/detail/fatty-liver-syndrome.json"),
  "leg-deformities": require("../../../../data/chicken/other/detail/leg-deformities.json"),
  "general-stress-syndrome": require("../../../../data/chicken/other/detail/general-stress-syndrome.json"),
};

const chickenParasiteDetails: Record<string, DiseaseDetail> = {
  "coccidiosis-mixed-chronic": require("../../../../data/chicken/parasite/detail/coccidiosis-mixed-chronic.json"),
  "ascaridia-galli": require("../../../../data/chicken/parasite/detail/ascaridia-galli.json"),
  "heterakis-gallinarum": require("../../../../data/chicken/parasite/detail/heterakis-gallinarum.json"),
  capillaria: require("../../../../data/chicken/parasite/detail/capillaria.json"),
  tapeworms: require("../../../../data/chicken/parasite/detail/tapeworms.json"),
  "lice-infestation": require("../../../../data/chicken/parasite/detail/lice-infestation.json"),
  "mite-infestation": require("../../../../data/chicken/parasite/detail/mite-infestation.json"),
  "scaly-leg-mite": require("../../../../data/chicken/parasite/detail/scaly-leg-mite.json"),
};

const chickenReproductiveDetails: Record<string, DiseaseDetail> = {
  "egg-peritonitis": require("../../../../data/chicken/reproductive/detail/egg-peritonitis.json"),
  salpingitis: require("../../../../data/chicken/reproductive/detail/salpingitis.json"),
  "egg-binding": require("../../../../data/chicken/reproductive/detail/egg-binding.json"),
  "prolapse-oviduct": require("../../../../data/chicken/reproductive/detail/prolapse-oviduct.json"),
  "egg-drop-syndrome": require("../../../../data/chicken/reproductive/detail/egg-drop-syndrome.json"),
  "reproductive-colibacillosis": require("../../../../data/chicken/reproductive/detail/reproductive-colibacillosis.json"),
};

export const chickenRespiratoryDetails: Record<string, DiseaseDetail> = {
  "fowl-cholera": require("../../../../data/chicken/respiratory/detail/fowl-cholera.json"),
  "ecoli-septicemia": require("../../../../data/chicken/respiratory/detail/ecoli-septicemia.json"),
  "crd-complex-advanced": require("../../../../data/chicken/respiratory/detail/crd-complex-advanced.json"),
  "brooder-pneumonia-severe": require("../../../../data/chicken/respiratory/detail/brooder-pneumonia-severe.json"),
  "newcastle-disease": require("../../../../data/chicken/respiratory/detail/newcastle-disease.json"),
  "avian-influenza": require("../../../../data/chicken/respiratory/detail/avian-influenza.json"),
  "infectious-bronchitis": require("../../../../data/chicken/respiratory/detail/infectious-bronchitis.json"),
  "mycoplasma-gallisepticum": require("../../../../data/chicken/respiratory/detail/mycoplasma-gallisepticum.json"),
  "infectious-coryza": require("../../../../data/chicken/respiratory/detail/infectious-coryza.json"),
  "infectious-laryngotracheitis": require("../../../../data/chicken/respiratory/detail/infectious-laryngotracheitis.json"),
  "respiratory-colibacillosis": require("../../../../data/chicken/respiratory/detail/respiratory-colibacillosis.json"),
  aspergillosis: require("../../../../data/chicken/respiratory/detail/aspergillosis.json"),
};

// =======================
// HÀM LẤY CHI TIẾT BỆNH
// =======================

function getDiseaseDetail(animal: string, group: string, id: string): DiseaseDetail | null {
  if (animal === "goat") {
    if (group === "respiratory") return goatRespiratoryDetails[id] ?? null;
    if (group === "digestive") return goatDigestiveDetails[id] ?? null;
    if (group === "parasite") return goatParasiteDetails[id] ?? null;
    if (group === "blood_parasite" || group === "blood-parasite") return goatBloodParasiteDetails[id] ?? null;
    if (group === "reproductive") return goatReproductiveDetails[id] ?? null;
    if (group === "other") return goatOtherDetails[id] ?? null;
  }

  if (animal === "pig") {
    if (group === "digestive") return pigDigestiveDetails[id] ?? null;
    if (group === "other") return pigOtherDetails[id] ?? null;
    if (group === "parasite") return pigParasiteDetails[id] ?? null;
    if (group === "reproductive") return pigReproductiveDetails[id] ?? null;
    if (group === "respiratory") return pigRespiratoryDetails[id] ?? null;
    if (group === "blood_parasite" || group === "blood-parasite") return pigBloodParasiteDetails[id] ?? null;
  }

  if (animal === "cattle") {
    if (group === "digestive") return cattleDigestiveDetails[id] ?? null;
    if (group === "other") return cattleOtherDetails[id] ?? null;
    if (group === "parasite") return cattleParasiteDetails[id] ?? null;
    if (group === "reproductive") return cattleReproductiveDetails[id] ?? null;
    if (group === "respiratory") return cattleRespiratoryDetails[id] ?? null;
    if (group === "blood_parasite" || group === "blood-parasite") return cattleBloodParasiteDetails[id] ?? null;
  }

  if (animal === "chicken") {
    if (group === "digestive") return chickenDigestiveDetails[id] ?? null;
    if (group === "other") return chickenOtherDetails[id] ?? null;
    if (group === "parasite") return chickenParasiteDetails[id] ?? null;
    if (group === "reproductive") return chickenReproductiveDetails[id] ?? null;
    if (group === "respiratory") return chickenRespiratoryDetails[id] ?? null;
    if (group === "blood_parasite" || group === "blood-parasite") return chickenBloodParasiteDetails[id] ?? null;
  }

  return null;
}

// =======================
// HELPER RENDER
// =======================

const renderBullets = (items?: any) => {
  if (items == null) return null;

  const arr: string[] = [];

  const toLabel = (key: string) => {
    const map: Record<string, string> = {
      description: "Mô tả tình trạng",
      guideline: "Hướng dẫn xử lý",
    };
    if (map[key]) return map[key];
    return key.replace(/_/g, " ").replace(/-/g, " ");
  };

  const pushValue = (value: any) => {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach((v) => pushValue(v));
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      const text = String(value).trim();
      if (text) arr.push(text);
    }
  };

  if (
    typeof items === "string" ||
    typeof items === "number" ||
    typeof items === "boolean"
  ) {
    pushValue(items);
  } else if (Array.isArray(items)) {
    pushValue(items);
  } else if (typeof items === "object") {
    Object.entries(items).forEach(([key, value]) => {
      const label = toLabel(key);
      arr.push(label + ":");
      pushValue(value);
    });
  }

  if (arr.length === 0) return null;

  return (
    <View style={{ marginTop: 4 }}>
      {arr.map((item, idx) => (
        <Text key={idx} style={styles.bulletText}>
          {"\u2022"} {item}
        </Text>
      ))}
    </View>
  );
};

const SYMPTOMATIC_GROUP_LABELS: Record<string, string> = {
  antiinflammatory: "Kháng viêm - giảm đau",
  respiratory_support: "Hỗ trợ hô hấp",
  electrolyte: "Bù nước - điện giải",
  vitamin: "Vitamin - phục hồi",
  digestive_support: "Hỗ trợ tiêu hoá",
  digestive: "Hỗ trợ tiêu hoá",
  other: "Điều trị triệu chứng khác",
};

const renderSymptomaticTreatment = (
  symptomatic?:
    | {
        [key: string]:
          | {
              main: string;
              alternative?: string | string[];
            }
          | string[];
      }
    | string[]
    | undefined
) => {
  if (!symptomatic) return null;

  if (Array.isArray(symptomatic)) {
    return renderBullets(symptomatic);
  }

  const getLabel = (key: string) => {
    if (SYMPTOMATIC_GROUP_LABELS[key]) {
      return SYMPTOMATIC_GROUP_LABELS[key];
    }
    return key
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
  };

  return (
    <View style={{ marginTop: 4 }}>
      {Object.entries(symptomatic).map(([key, value]) => {
        let main: string | undefined;
        let alternatives: string[] = [];

        if (Array.isArray(value)) {
          if (value.length > 0) {
            main = String(value[0]);
            alternatives = value.slice(1).map((v) => String(v));
          }
        } else if (value && typeof value === "object") {
          // @ts-ignore
          main = value.main as string;
          // @ts-ignore
          const altRaw = value.alternative as string | string[] | undefined;
          if (typeof altRaw === "string") {
            const t = altRaw.trim();
            if (t) alternatives = [t];
          } else if (Array.isArray(altRaw)) {
            alternatives = altRaw.map((v) => String(v));
          }
        }

        if (!main) return null;

        return (
          <View key={key} style={{ marginBottom: 8 }}>
            <Text style={styles.symptomaticGroupTitle}>{getLabel(key)}</Text>
            <Text style={styles.bulletText}>
              • <Text style={{ fontWeight: "600" }}>Thuốc chính: </Text>
              {main}
            </Text>
            {alternatives.length > 0 && (
              <Text style={styles.bulletText}>
                • <Text style={{ fontWeight: "600" }}>Thay thế: </Text>
                {alternatives.join(", ")}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: string;
  children?: React.ReactNode;
}) => {
  if (!children) return null;
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        {icon && (
          <Ionicons name={icon as any} size={18} color={colors.primary} />
        )}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
};

// =======================
// COMPONENT CHI TIẾT BỆNH
// =======================

export default function DiseaseDetailScreen() {
  // Lấy params từ router, handle cả trường hợp string[] cho chắc
  const params = useLocalSearchParams<Record<string, string | string[]>>();

  const getParam = (key: string): string => {
    const value = params[key];
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
  };

  const animal = getParam("animal");
  const group = getParam("group");
  const id = getParam("id");
  const rawFromScreen = getParam("fromScreen");
  const searchQueryRaw = getParam("searchQuery");

  const fromScreen: DiseaseViewSource =
    rawFromScreen === "quicksearch" ? "quicksearch" : "category";

  const searchQuery = searchQueryRaw || undefined;

  const detail = getDiseaseDetail(animal, group, id);
  const displayName =
  (detail && detail.name) ||
  (typeof params.name === "string" ? params.name : "") ||
  id;


  // ====== LOG HÀNH VI XEM BỆNH ======
  const viewStartRef = useRef<number | null>(null);
  const hasLoggedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!detail) return;

    viewStartRef.current = Date.now();

    // Auto log sau 12s nếu chưa log
    timerRef.current = setTimeout(() => {
      if (hasLoggedRef.current || !viewStartRef.current) return;
      const duration = Date.now() - viewStartRef.current;
      logDiseaseView({
  animal,
  group,
  diseaseId: id,
  diseaseName: displayName ?? null,
  fromScreen,
  searchQuery: searchQuery ?? null,
  timeOnScreenMs: duration ?? null,
});


      hasLoggedRef.current = true;
    }, 12000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!hasLoggedRef.current && viewStartRef.current) {
        const duration = Date.now() - viewStartRef.current;
        if (duration >= 3000) {
          logDiseaseView({
            animal,
            group,
            diseaseId: id,
            diseaseName: detail.name,
            fromScreen,
            searchQuery,
            timeOnScreenMs: duration,
          });
          hasLoggedRef.current = true;
        }
      }
    };
  }, [animal, group, id, detail?.name, fromScreen, searchQuery]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!detail) return;
    if (hasLoggedRef.current) return;

    if (!viewStartRef.current) viewStartRef.current = Date.now();
    const duration = Date.now() - viewStartRef.current;

    // lướt siêu nhanh thì bỏ
    if (duration < 500) return;

    logDiseaseView({
      animal,
      group,
      diseaseId: id,
      diseaseName: detail.name,
      fromScreen,
      searchQuery,
      timeOnScreenMs: duration,
    });
    hasLoggedRef.current = true;
  };

  if (!detail) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            Chưa có dữ liệu chi tiết cho bệnh này
          </Text>
          <Text style={styles.emptyText}>
            Kiểm tra lại mã bệnh hoặc bổ sung file chi tiết tương ứng.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const advanced = detail as any;
  const headerIcon = (ANIMAL_ICONS[animal] as any) || "medkit-outline";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={120}
      >
        {/* HEADER TÊN BỆNH + ICON */}
        <View style={styles.header}>
          <View style={styles.headerIconWrap}>
            <Ionicons name={headerIcon} size={28} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.diseaseName}>{displayName}</Text>
            {advanced.summary ? (
              <Text style={styles.summaryText}>{advanced.summary}</Text>
            ) : null}
          </View>
        </View>

        {/* NGUYÊN NHÂN */}
        <Section title="Nguyên nhân" icon="alert-circle-outline">
          {advanced.causes
            ? renderBullets(advanced.causes)
            : detail.cause
            ? renderBullets(detail.cause)
            : null}
        </Section>

        {/* YẾU TỐ NGUY CƠ */}
        <Section title="Yếu tố nguy cơ" icon="warning-outline">
          {advanced.risk_factors && renderBullets(advanced.risk_factors)}
        </Section>

        {/* TRIỆU CHỨNG CHI TIẾT */}
        <Section title="Triệu chứng chi tiết" icon="list-circle-outline">
          {advanced.clinical_signs_detailed
            ? renderBullets(advanced.clinical_signs_detailed)
            : detail.symptoms
            ? renderBullets(detail.symptoms)
            : null}
        </Section>

        {/* TRIỆU CHỨNG THEO MỨC ĐỘ */}
        {advanced.clinical_signs_by_stage && (
          <Section title="Triệu chứng theo mức độ" icon="analytics-outline">
            <View>
              {advanced.clinical_signs_by_stage.mild && (
                <>
                  <Text style={styles.stageTitle}>⚪ Mức độ nhẹ</Text>
                  {renderBullets(advanced.clinical_signs_by_stage.mild)}
                </>
              )}

              {advanced.clinical_signs_by_stage.moderate && (
                <>
                  <Text style={styles.stageTitle}>🟡 Mức độ vừa</Text>
                  {renderBullets(advanced.clinical_signs_by_stage.moderate)}
                </>
              )}

              {advanced.clinical_signs_by_stage.severe && (
                <>
                  <Text style={styles.stageTitle}>🔴 Mức độ nặng</Text>
                  {renderBullets(advanced.clinical_signs_by_stage.severe)}
                </>
              )}
            </View>
          </Section>
        )}

        {/* ĐIỀU TRỊ - SCHEMA CŨ */}
        {(detail.treatment?.mild ||
          detail.treatment?.severe ||
          detail.treatment?.alternative ||
          detail.treatment?.note) && (
          <Section title="Điều trị (mô tả chung)" icon="medkit-outline">
            {detail.treatment?.mild && (
              <Text style={styles.paragraph}>
                <Text style={styles.bold}>Trường hợp nhẹ: </Text>
                {detail.treatment.mild}
              </Text>
            )}

            {detail.treatment?.severe && (
              <Text style={styles.paragraph}>
                <Text style={styles.bold}>Trường hợp nặng: </Text>
                {detail.treatment.severe}
              </Text>
            )}

            {detail.treatment?.alternative && (
              <Text style={styles.paragraph}>
                <Text style={styles.bold}>Thuốc thay thế: </Text>
                {detail.treatment.alternative}
              </Text>
            )}

            {detail.treatment?.note && (
              <Text style={styles.paragraph}>
                <Text style={styles.bold}>Lưu ý: </Text>
                {detail.treatment.note}
              </Text>
            )}
          </Section>
        )}

        {/* ĐIỀU TRỊ - SCHEMA MỚI */}
        {(advanced.treatment?.primary_drugs ||
          advanced.treatment?.alternative_drugs ||
          advanced.treatment?.symptomatic_treatment ||
          advanced.treatment?.supportive_care ||
          advanced.treatment?.dose_policy) && (
          <Section
            title="Hướng dẫn điều trị (mang tính tham khảo)"
            icon="pulse-outline"
          >
            {advanced.treatment?.primary_drugs && (
              <>
                <Text style={styles.stageTitle}>💊 Thuốc ưu tiên</Text>
                {renderBullets(advanced.treatment.primary_drugs)}
              </>
            )}

            {advanced.treatment?.alternative_drugs && (
              <>
                <Text style={styles.stageTitle}>🔁 Thuốc có thể thay thế</Text>
                {renderBullets(advanced.treatment.alternative_drugs)}
              </>
            )}

            {advanced.treatment?.symptomatic_treatment && (
              <>
                <Text style={styles.stageTitle}>🩺 Điều trị triệu chứng</Text>
                {renderSymptomaticTreatment(
                  advanced.treatment.symptomatic_treatment
                )}
              </>
            )}

            {advanced.treatment?.supportive_care && (
              <>
                <Text style={styles.stageTitle}>🧴 Chăm sóc - hỗ trợ</Text>
                {renderBullets(advanced.treatment.supportive_care)}
              </>
            )}

            {advanced.treatment?.dose_policy && (
              <Text style={styles.dosePolicyText}>
                {advanced.treatment.dose_policy}
              </Text>
            )}
          </Section>
        )}

        {/* XỬ LÝ CA NẶNG */}
        {advanced.severe_case_treatment && (
          <Section title="Xử lý ca nặng" icon="flask-outline">
            <View>
              {advanced.severe_case_treatment.case_type_1 && (
                <>
                  <Text style={styles.stageTitle}>
                    🩻 Trường hợp nặng loại 1
                  </Text>
                  {renderBullets(advanced.severe_case_treatment.case_type_1)}
                </>
              )}

              {advanced.severe_case_treatment.case_type_2 && (
                <>
                  <Text style={styles.stageTitle}>
                    🧪 Trường hợp nặng loại 2
                  </Text>
                  {renderBullets(advanced.severe_case_treatment.case_type_2)}
                </>
              )}

              {advanced.severe_case_treatment.note && (
                <Text style={styles.dosePolicyText}>
                  {advanced.severe_case_treatment.note}
                </Text>
              )}
            </View>
          </Section>
        )}

        {/* PHÒNG BỆNH */}
        <Section title="Phòng bệnh" icon="shield-checkmark-outline">
          {advanced.prevention_list
            ? renderBullets(advanced.prevention_list)
            : detail.prevention
            ? renderBullets(detail.prevention)
            : null}
        </Section>

        {/* LƯU Ý THÊM */}
        <Section title="Lưu ý thêm" icon="reader-outline">
          {advanced.notes && renderBullets(advanced.notes)}
        </Section>

        {/* DISCLAIMER */}
        {detail.disclaimer ? (
          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>{detail.disclaimer}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// =======================
// STYLES
// =======================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  headerIconWrap: {
    width: 50,
    height: 50,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  diseaseName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },

  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },

  stageTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: spacing.sm,
    marginBottom: 2,
    color: colors.text,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "600",
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    marginBottom: 2,
  },
  symptomaticGroupTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
    marginTop: spacing.sm,
  },
  dosePolicyText: {
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 19,
    fontStyle: "italic",
    color: colors.textMuted,
  },

  disclaimerBox: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "#FFF4E5",
    borderWidth: 1,
    borderColor: "#FFE2BF",
  },
  disclaimerText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#8A5A10",
  },

  emptyContainer: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.sm,
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
});
