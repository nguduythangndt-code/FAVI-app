import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radius, shadow, spacing } from "../../../../src/theme";

// 9 nhóm - dùng list.json để lấy tên thuốc
import antibiotic from "../../../data/drugs/antibiotic/list.json";
import antiinflammatory from "../../../data/drugs/antiinflammatory_analgesic/list.json";
import externalParasite from "../../../data/drugs/antiparasitic_external/list.json";
import internalParasite from "../../../data/drugs/antiparasitic_internal/list.json";
import bloodParasite from "../../../data/drugs/blood_parasite/list.json";
import digestiveSupport from "../../../data/drugs/digestive_support/list.json";
import electrolyte from "../../../data/drugs/electrolyte/list.json";
import respiratorySupport from "../../../data/drugs/respiratory_support/list.json";
import vitamin from "../../../data/drugs/vitamin_tonic/list.json";


// ========= ICON CHO MỖI NHÓM =========
const GROUP_ICONS: Record<string, string> = {
  antibiotic: "medkit-outline",
  antiinflammatory_analgesic: "bandage-outline",
  antiparasitic_external: "shield-checkmark-outline",
  antiparasitic_internal: "bug-outline",
  blood_parasite: "alert-circle-outline",
  digestive_support: "restaurant-outline",
  electrolyte: "water-outline",
  respiratory_support: "pulse-outline",

  vitamin_tonic: "sparkles-outline",
};
// ==========================
// HÀM LOAD CHI TIẾT THUỐC
// ==========================
function loadDrugDetail(group: string, id: string): any | null {
  // Nhóm 1: Kháng viêm - giảm đau
  if (group === "antiinflammatory_analgesic") {
    switch (id) {
      case "flunixin":
        return require("../../../data/drugs/antiinflammatory_analgesic/flunixin.json");
      case "meloxicam":
        return require("../../../data/drugs/antiinflammatory_analgesic/meloxicam.json");
      case "ketoprofen":
        return require("../../../data/drugs/antiinflammatory_analgesic/ketoprofen.json");
      case "diclofenac":
        return require("../../../data/drugs/antiinflammatory_analgesic/diclofenac.json");
      case "paracetamol":
        return require("../../../data/drugs/antiinflammatory_analgesic/paracetamol.json");
      case "aspirin":
        return require("../../../data/drugs/antiinflammatory_analgesic/aspirin.json");
      case "ibuprofen":
        return require("../../../data/drugs/antiinflammatory_analgesic/ibuprofen.json");
      default:
        return null;
    }
  }

  // Nhóm kháng sinh
  if (group === "antibiotic") {
    switch (id) {
      case "amoxicillin":
        return require("../../../data/drugs/antibiotic/amoxicillin.json");
      case "oxytetracycline":
        return require("../../../data/drugs/antibiotic/oxytetracycline.json");
      case "doxycycline":
        return require("../../../data/drugs/antibiotic/doxycycline.json");
      case "florfenicol":
        return require("../../../data/drugs/antibiotic/florfenicol.json");
      case "enrofloxacin":
        return require("../../../data/drugs/antibiotic/enrofloxacin.json");
      case "tylosin":
        return require("../../../data/drugs/antibiotic/tylosin.json");
      case "tilmicosin":
        return require("../../../data/drugs/antibiotic/tilmicosin.json");
      case "colistin":
        return require("../../../data/drugs/antibiotic/colistin.json");
      case "ceftiofur":
        return require("../../../data/drugs/antibiotic/ceftiofur.json");
      case "sulfamethoxazole_tmp":
        return require("../../../data/drugs/antibiotic/sulfamethoxazole_tmp.json");

      case "tulathromycin":
        return require("../../../data/drugs/antibiotic/tulathromycin.json");
      case "azithromycin":
        return require("../../../data/drugs/antibiotic/azithromycin.json");
      case "spiramycin":
        return require("../../../data/drugs/antibiotic/spiramycin.json");
      case "tilmicosin_oral":
        return require("../../../data/drugs/antibiotic/tilmicosin_oral.json");
      case "josamycin":
        return require("../../../data/drugs/antibiotic/josamycin.json");
      case "lincomycin":
        return require("../../../data/drugs/antibiotic/lincomycin.json");
      case "spectinomycin":
        return require("../../../data/drugs/antibiotic/spectinomycin.json");
      case "neomycin":
        return require("../../../data/drugs/antibiotic/neomycin.json");
      case "gentamicin":
        return require("../../../data/drugs/antibiotic/gentamicin.json");
      case "kanamycin":
        return require("../../../data/drugs/antibiotic/kanamycin.json");
      case "amikacin":
        return require("../../../data/drugs/antibiotic/amikacin.json");
      case "tetracycline":
        return require("../../../data/drugs/antibiotic/tetracycline.json");

      case "oxolinic_acid":
        return require("../../../data/drugs/antibiotic/oxolinic_acid.json");
      case "ciprofloxacin":
        return require("../../../data/drugs/antibiotic/ciprofloxacin.json");
      case "norfloxacin":
        return require("../../../data/drugs/antibiotic/norfloxacin.json");
      case "levofloxacin":
        return require("../../../data/drugs/antibiotic/levofloxacin.json");
      case "nalidixic_acid":
        return require("../../../data/drugs/antibiotic/nalidixic_acid.json");
      case "oxolinic_acid_plus":
        return require("../../../data/drugs/antibiotic/oxolinic_acid_plus.json");
      case "spiramycin_tylo":
        return require("../../../data/drugs/antibiotic/spiramycin_tylo.json");
      case "danofloxacin":
        return require("../../../data/drugs/antibiotic/danofloxacin.json");
      case "marbofloxacin":
        return require("../../../data/drugs/antibiotic/marbofloxacin.json");
      case "difloxacin":
        return require("../../../data/drugs/antibiotic/difloxacin.json");

      case "flumequine":
        return require("../../../data/drugs/antibiotic/flumequine.json");
      case "enrofloxacin_oral":
        return require("../../../data/drugs/antibiotic/enrofloxacin_oral.json");
      case "cephalexin":
        return require("../../../data/drugs/antibiotic/cephalexin.json");
      case "cefaclor":
        return require("../../../data/drugs/antibiotic/cefaclor.json");
      case "amoxiclav":
        return require("../../../data/drugs/antibiotic/amoxiclav.json");
      case "cefquinome":
        return require("../../../data/drugs/antibiotic/cefquinome.json");

      default:
        return null;
    }
  }

  // Nhóm 2: Ký sinh trùng ngoài
  if (group === "antiparasitic_external") {
    switch (id) {
      case "permethrin":
        return require("../../../data/drugs/antiparasitic_external/permethrin.json");
      case "cypermethrin":
        return require("../../../data/drugs/antiparasitic_external/cypermethrin.json");
      case "deltamethrin":
        return require("../../../data/drugs/antiparasitic_external/deltamethrin.json");
      case "amitraz":
        return require("../../../data/drugs/antiparasitic_external/amitraz.json");
      case "fipronil":
        return require("../../../data/drugs/antiparasitic_external/fipronil.json");
      case "imidacloprid":
        return require("../../../data/drugs/antiparasitic_external/imidacloprid.json");
      case "fluralaner":
        return require("../../../data/drugs/antiparasitic_external/fluralaner.json");
      default:
        return null;
    }
  }

  // Nhóm 3: Ký sinh trùng nội
  if (group === "antiparasitic_internal") {
    switch (id) {
      case "albendazole":
        return require("../../../data/drugs/antiparasitic_internal/albendazole.json");
      case "fenbendazole":
        return require("../../../data/drugs/antiparasitic_internal/fenbendazole.json");
      case "levamisole":
        return require("../../../data/drugs/antiparasitic_internal/levamisole.json");
      case "ivermectin":
        return require("../../../data/drugs/antiparasitic_internal/ivermectin.json");
      case "doramectin":
        return require("../../../data/drugs/antiparasitic_internal/doramectin.json");
      case "praziquantel":
        return require("../../../data/drugs/antiparasitic_internal/praziquantel.json");
      case "closantel":
        return require("../../../data/drugs/antiparasitic_internal/closantel.json");
      case "oxyclozanide":
        return require("../../../data/drugs/antiparasitic_internal/oxyclozanide.json");
      case "triclabendazole":
        return require("../../../data/drugs/antiparasitic_internal/triclabendazole.json");
      default:
        return null;
    }
  }

  // Nhóm 4: Ký sinh trùng máu
  if (group === "blood_parasite") {
    switch (id) {
      case "azidin":
        return require("../../../data/drugs/blood_parasite/azidin.json");
      case "imidocarb":
        return require("../../../data/drugs/blood_parasite/imidocarb.json");
      case "oxytetracycline_la":
        return require("../../../data/drugs/blood_parasite/oxytetracycline_la.json");
      case "buparvaquone":
        return require("../../../data/drugs/blood_parasite/buparvaquone.json");
      default:
        return null;
    }
  }

  // Nhóm 5: Hỗ trợ tiêu hoá - đường ruột
  if (group === "digestive_support") {
    switch (id) {
      case "probiotic":
        return require("../../../data/drugs/digestive_support/probiotic.json");
      case "enzyme_mix":
        return require("../../../data/drugs/digestive_support/enzyme_mix.json");
      case "pectin_kaolin":
        return require("../../../data/drugs/digestive_support/pectin_kaolin.json");
      case "digestive_vitamin_mix":
        return require("../../../data/drugs/digestive_support/digestive_vitamin_mix.json");
      case "activated_charcoal":
        return require("../../../data/drugs/digestive_support/activated_charcoal.json");
      default:
        return null;
    }
  }

  // Nhóm 6: Điện giải - bù nước
  if (group === "electrolyte") {
    switch (id) {
      case "oresol":
        return require("../../../data/drugs/electrolyte/oresol.json");
      case "glucose":
        return require("../../../data/drugs/electrolyte/glucose.json");
      case "electrolyte_mix":
        return require("../../../data/drugs/electrolyte/electrolyte_mix.json");
      case "vitamin_c_electrolyte":
        return require("../../../data/drugs/electrolyte/vitamin_c_electrolyte.json");
      case "bcomplex_electrolyte":
        return require("../../../data/drugs/electrolyte/bcomplex_electrolyte.json");
      case "rehydration_salts":
        return require("../../../data/drugs/electrolyte/rehydration_salts.json");
      default:
        return null;
    }
  }

  // Nhóm 7: Hỗ trợ hô hấp
  if (group === "respiratory_support") {
    switch (id) {
      case "bromhexine":
        return require("../../../data/drugs/respiratory_support/bromhexine.json");
      case "eucalyptus":
        return require("../../../data/drugs/respiratory_support/eucalyptus.json");
      case "menthol_camphor":
        return require("../../../data/drugs/respiratory_support/menthol_camphor.json");
      case "guaifenesin":
        return require("../../../data/drugs/respiratory_support/guaifenesin.json");
      case "nasal_decongestant":
        return require("../../../data/drugs/respiratory_support/nasal_decongestant.json");
      default:
        return null;
    }
  }

  // Nhóm 8: Vitamin - khoáng - bổ trợ
  if (group === "vitamin_tonic") {
    switch (id) {
      case "vitamin_bc":
        return require("../../../data/drugs/vitamin_tonic/vitamin_bc.json");
      case "multivitamin":
        return require("../../../data/drugs/vitamin_tonic/multivitamin.json");
      case "vitamin_ade":
        return require("../../../data/drugs/vitamin_tonic/vitamin_ade.json");
      case "vitamin_c":
        return require("../../../data/drugs/vitamin_tonic/vitamin_c.json");
      case "vitamin_e_selenium":
        return require("../../../data/drugs/vitamin_tonic/vitamin_e_selenium.json");
      case "b1":
        return require("../../../data/drugs/vitamin_tonic/b1.json");
      case "b12":
        return require("../../../data/drugs/vitamin_tonic/b12.json");
      case "choline_chloride":
        return require("../../../data/drugs/vitamin_tonic/choline_chloride.json");
      case "sorbitol_amino":
        return require("../../../data/drugs/vitamin_tonic/sorbitol_amino.json");
      case "hepetol":
        return require("../../../data/drugs/vitamin_tonic/hepetol.json");
      case "atp":
        return require("../../../data/drugs/vitamin_tonic/atp.json");
      case "calcium_mag_b6":
        return require("../../../data/drugs/vitamin_tonic/calcium_mag_b6.json");
      case "calcium_d3":
        return require("../../../data/drugs/vitamin_tonic/calcium_d3.json");
      case "amino_peptide":
        return require("../../../data/drugs/vitamin_tonic/amino_peptide.json");
      case "electrolyte_amino_premium":
        return require("../../../data/drugs/vitamin_tonic/electrolyte_amino_premium.json");
      case "liver_kidney_tonic":
        return require("../../../data/drugs/vitamin_tonic/liver_kidney_tonic.json");
      case "butafosfan_b12":
        return require("../../../data/drugs/vitamin_tonic/butafosfan_b12.json");
      case "mineral_premix_feed":
        return require("../../../data/drugs/vitamin_tonic/mineral_premix_feed.json");
      default:
        return null;
    }
  }

  // Chưa nối nhóm khác → mặc định null
  return null;
}

// ========= MAP TÊN SECTION =========
const SECTION_TITLES: Record<string, { label: string; icon: string }> = {
  mechanism: { label: "Cơ chế tác dụng", icon: "flash-outline" },
  clinical_uses: { label: "Khi nào nên dùng", icon: "help-buoy-outline" },
  indications: { label: "Chỉ định sử dụng", icon: "list-circle-outline" },
  usage_notes: { label: "Cách dùng & lưu ý", icon: "information-circle-outline" },
  combinations: { label: "Kết hợp với thuốc khác", icon: "git-merge-outline" },
  precautions: { label: "Lưu ý an toàn", icon: "warning-outline" },
  side_effects: { label: "Tác dụng phụ", icon: "alert-outline" },
  withdrawal_time: { label: "Thời gian ngưng thuốc", icon: "time-outline" },
  notes: { label: "Ghi chú thêm", icon: "reader-outline" },
};

// ========= COMPONENT CHÍNH =========
export default function DrugDetailScreen() {
  const params = useLocalSearchParams();
  const group = params.group as string;
  const id = params.id as string;

  const groupMap: Record<string, any[]> = {
    antiinflammatory_analgesic: antiinflammatory,
    antiparasitic_external: externalParasite,
    antiparasitic_internal: internalParasite,
    blood_parasite: bloodParasite,
    digestive_support: digestiveSupport,
    electrolyte: electrolyte,
    respiratory_support: respiratorySupport,
    vitamin_tonic: vitamin,
    antibiotic: antibiotic,
  };

  const list = groupMap[group] ?? [];
  const basic = list.find((i) => i.id === id);

  const detail = loadDrugDetail(group, id);
  const displayName = detail?.name || basic?.name || id;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
      >
        {/* ===== HEADER TÊN THUỐC ===== */}
        <View style={styles.header}>
          <View style={styles.headerIconWrap}>
            <Ionicons
              name={(GROUP_ICONS[group] as any) || "medkit-outline"}
              size={28}
              color={colors.primary}
            />
          </View>
          <Text style={styles.drugName}>{displayName}</Text>
        </View>

        {/* ===== CHƯA CÓ DATA ===== */}
        {!detail && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Thông báo</Text>
            <Text style={styles.sectionText}>
              Chưa có dữ liệu chi tiết cho thuốc này.
            </Text>
          </View>
        )}

        {/* ===== HIỂN THỊ CÁC MỤC ===== */}
        {detail &&
          Object.entries(detail).map(([key, value]) => {
            if (key === "id" || key === "name") return null;
            if (!value) return null;

            const meta = SECTION_TITLES[key] ?? {
              label: "Thông tin khác",
              icon: "information-circle-outline",
            };

            // Chuẩn hoá dạng string
            if (typeof value === "string") {
              return (
                <View key={key} style={styles.card}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name={meta.icon as any} size={18} color={colors.primary} />
                    <Text style={styles.sectionTitle}>{meta.label}</Text>
                  </View>
                  <Text style={styles.sectionText}>{value}</Text>
                </View>
              );
            }

            // Chuẩn hoá dạng array
            if (Array.isArray(value)) {
              if (value.length === 0) return null;
              return (
                <View key={key} style={styles.card}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name={meta.icon as any} size={18} color={colors.primary} />
                    <Text style={styles.sectionTitle}>{meta.label}</Text>
                  </View>
                  {value.map((item, index) => (
                    <Text key={index} style={styles.bulletText}>
                      • {item}
                    </Text>
                  ))}
                </View>
              );
            }

            return null;
          })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: { flex: 1 },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // ===== HEADER =====
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  headerIconWrap: {
    width: 50,
    height: 50,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  drugName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    flexShrink: 1,
  },

  // ===== CARD =====
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },

  // ===== HEADER SECTION =====
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },

  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },

  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    marginBottom: 4,
  },
});