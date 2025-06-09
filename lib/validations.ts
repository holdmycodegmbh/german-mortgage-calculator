import { z } from "zod"

export const mortgageSchema = z.object({
  immobilienpreis: z
    .number({
      required_error: "Immobilienpreis ist erforderlich",
      invalid_type_error: "Bitte geben Sie eine gültige Zahl ein",
    })
    .min(50000, "Immobilienpreis muss mindestens 50.000€ betragen")
    .max(10000000, "Immobilienpreis darf höchstens 10.000.000€ betragen"),

  eigenkapital: z
    .number({
      required_error: "Eigenkapital ist erforderlich", 
      invalid_type_error: "Bitte geben Sie eine gültige Zahl ein",
    })
    .min(0, "Eigenkapital kann nicht negativ sein")
    .max(5000000, "Eigenkapital darf höchstens 5.000.000€ betragen"),

  grunderwerbsteuer: z
    .number({
      required_error: "Grunderwerbsteuer ist erforderlich",
      invalid_type_error: "Bitte geben Sie eine gültige Zahl ein",
    })
    .min(0, "Grunderwerbsteuer kann nicht negativ sein")
    .max(15, "Grunderwerbsteuer darf höchstens 15% betragen"),

  notarkosten: z
    .number({
      required_error: "Notarkosten sind erforderlich",
      invalid_type_error: "Bitte geben Sie eine gültige Zahl ein", 
    })
    .min(0, "Notarkosten können nicht negativ sein")
    .max(5, "Notarkosten dürfen höchstens 5% betragen"),

  kaeufernebenkosten: z
    .number({
      required_error: "Käufernebenkosten sind erforderlich",
      invalid_type_error: "Bitte geben Sie eine gültige Zahl ein",
    })
    .min(0, "Käufernebenkosten können nicht negativ sein")
    .max(10, "Käufernebenkosten dürfen höchstens 10% betragen"),

  sollzins: z
    .number({
      required_error: "Sollzins ist erforderlich",
      invalid_type_error: "Bitte geben Sie eine gültige Zahl ein",
    })
    .min(0.1, "Sollzins muss mindestens 0,1% betragen")
    .max(15, "Sollzins darf höchstens 15% betragen"),

  tilgung: z
    .number({
      required_error: "Tilgung ist erforderlich",
      invalid_type_error: "Bitte geben Sie eine gültige Zahl ein",
    })
    .min(0.5, "Tilgung muss mindestens 0,5% betragen")
    .max(10, "Tilgung darf höchstens 10% betragen"),

  laufzeit: z
    .number({
      required_error: "Laufzeit ist erforderlich",
      invalid_type_error: "Bitte geben Sie eine gültige Zahl ein",
    })
    .min(5, "Laufzeit muss mindestens 5 Jahre betragen")
    .max(50, "Laufzeit darf höchstens 50 Jahre betragen"),
})
.refine((data) => data.eigenkapital <= data.immobilienpreis, {
  message: "Eigenkapital darf nicht höher als der Immobilienpreis sein",
  path: ["eigenkapital"],
})
.refine((data) => {
  const gesamtNebenkosten = data.grunderwerbsteuer + data.notarkosten + data.kaeufernebenkosten;
  return gesamtNebenkosten <= 25;
}, {
  message: "Gesamte Nebenkosten dürfen 25% nicht überschreiten",
  path: ["kaeufernebenkosten"],
});

export type MortgageFormData = z.infer<typeof mortgageSchema> 