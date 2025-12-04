// src/services/care.ts

import {
  CareAnimal,
  CareTopicSummary,
  CareDetail,
} from "../types/care";

// ====== IMPORT LIST CHO 4 LOÀI ======
import goatCareList from "../../app/data/care/goat/list.json";
import pigCareList from "../../app/data/care/pig/list.json";
import cattleCareList from "../../app/data/care/cattle/list.json";
import chickenCareList from "../../app/data/care/chicken/list.json";

// Ép kiểu cho list (data hiện tại: { id, name, shortDesc })
const goatCareListTyped = goatCareList as CareTopicSummary[];
const pigCareListTyped = pigCareList as CareTopicSummary[];
const cattleCareListTyped = cattleCareList as CareTopicSummary[];
const chickenCareListTyped = chickenCareList as CareTopicSummary[];

// ====== MAP CHI TIẾT CHO 4 LOÀI ======

// GOAT
const goatCareDetailMap: Record<string, CareDetail> = {
  goat_fattening: require("../../app/data/care/goat/goat_fattening.json") as CareDetail,
  goat_doe: require("../../app/data/care/goat/goat_doe.json") as CareDetail,
  goat_replacement: require("../../app/data/care/goat/goat_replacement.json") as CareDetail,
  goat_kid: require("../../app/data/care/goat/goat_kid.json") as CareDetail,
  goat_sick: require("../../app/data/care/goat/goat_sick.json") as CareDetail,
  goat_recovery: require("../../app/data/care/goat/goat_recovery.json") as CareDetail,
  goat_housing: require("../../app/data/care/goat/goat_housing.json") as CareDetail,
  goat_silage: require("../../app/data/care/goat/goat_silage.json") as CareDetail,
};

// PIG
const pigCareDetailMap: Record<string, CareDetail> = {
  pig_fattening: require("../../app/data/care/pig/pig_fattening.json") as CareDetail,
  pig_sow: require("../../app/data/care/pig/pig_sow.json") as CareDetail,
  pig_gilt: require("../../app/data/care/pig/pig_gilt.json") as CareDetail,
  pig_piglet: require("../../app/data/care/pig/pig_piglet.json") as CareDetail,
  pig_sick: require("../../app/data/care/pig/pig_sick.json") as CareDetail,
  pig_recovery: require("../../app/data/care/pig/pig_recovery.json") as CareDetail,
  pig_housing: require("../../app/data/care/pig/pig_housing.json") as CareDetail,
  pig_feeding: require("../../app/data/care/pig/pig_feeding.json") as CareDetail,
};

// CATTLE
const cattleCareDetailMap: Record<string, CareDetail> = {
  cattle_fattening: require("../../app/data/care/cattle/cattle_fattening.json") as CareDetail,
  cattle_cow: require("../../app/data/care/cattle/cattle_cow.json") as CareDetail,
  cattle_replacement: require("../../app/data/care/cattle/cattle_replacement.json") as CareDetail,
  cattle_calf: require("../../app/data/care/cattle/cattle_calf.json") as CareDetail,
  cattle_sick: require("../../app/data/care/cattle/cattle_sick.json") as CareDetail,
  cattle_recovery: require("../../app/data/care/cattle/cattle_recovery.json") as CareDetail,
  cattle_housing: require("../../app/data/care/cattle/cattle_housing.json") as CareDetail,
  cattle_silage: require("../../app/data/care/cattle/cattle_silage.json") as CareDetail,
};

// CHICKEN
const chickenCareDetailMap: Record<string, CareDetail> = {
  chicken_broiler: require("../../app/data/care/chicken/chicken_broiler.json") as CareDetail,
  chicken_layer: require("../../app/data/care/chicken/chicken_layer.json") as CareDetail,
  chicken_chick: require("../../app/data/care/chicken/chicken_chick.json") as CareDetail,
  chicken_sick: require("../../app/data/care/chicken/chicken_sick.json") as CareDetail,
  chicken_recovery: require("../../app/data/care/chicken/chicken_recovery.json") as CareDetail,
  chicken_housing: require("../../app/data/care/chicken/chicken_housing.json") as CareDetail,
  chicken_litter: require("../../app/data/care/chicken/chicken_litter.json") as CareDetail,
};

// ====== HÀM PUBLIC DÙNG Ở UI ======

export function loadCareList(animal: CareAnimal): CareTopicSummary[] {
  switch (animal) {
    case "goat":
      return goatCareListTyped;
    case "pig":
      return pigCareListTyped;
    case "cattle":
      return cattleCareListTyped;
    case "chicken":
      return chickenCareListTyped;
    default:
      return [];
  }
}

export function loadCareDetail(
  animal: CareAnimal,
  topicId: string
): CareDetail | null {
  switch (animal) {
    case "goat":
      return goatCareDetailMap[topicId] ?? null;
    case "pig":
      return pigCareDetailMap[topicId] ?? null;
    case "cattle":
      return cattleCareDetailMap[topicId] ?? null;
    case "chicken":
      return chickenCareDetailMap[topicId] ?? null;
    default:
      return null;
  }
}
