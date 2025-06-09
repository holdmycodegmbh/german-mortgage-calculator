"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ValidatedMortgageInput } from "@/components/validated-mortgage-input"
import { AmortizationChart } from "@/components/amortization-chart"
import { mortgageSchema, type MortgageFormData } from "@/lib/validations"
import type { ChartData } from "chart.js"
import { Github } from "lucide-react"

// Helper to format currency in German style
const formatCurrency = (value: number): string => {
  if (isNaN(value) || !isFinite(value)) {
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(0)
  }
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value)
}

const initialChartData: ChartData<"line"> = {
  labels: [],
  datasets: [],
}

export default function MortgageCalculatorPage() {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<MortgageFormData>({
    resolver: zodResolver(mortgageSchema),
    defaultValues: {
      immobilienpreis: 350000,
      eigenkapital: 70000,
      grunderwerbsteuer: 6.5,
      notarkosten: 1.5,
      kaeufernebenkosten: 3.5,
      sollzins: 3.5,
      tilgung: 2.0,
      laufzeit: 25,
    },
    mode: "onChange",
  })

  // Manual validation trigger on value changes
  const handleInputChange = async (field: keyof MortgageFormData, value: number) => {
    setValue(field, value)
    await trigger(field) // Manually trigger validation
  }

  // Watch all form values
  const formData = watch()

  // Calculated results
  const [results, setResults] = useState({
    gesamtkosten: 0,
    darlehenssumme: 0,
    monatlicheRate: 0,
  })

  const [chartData, setChartData] = useState<ChartData<"line">>(initialChartData)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const {
      immobilienpreis,
      eigenkapital,
      grunderwerbsteuer,
      notarkosten,
      kaeufernebenkosten,
      sollzins,
      tilgung,
      laufzeit,
    } = formData

    // Only calculate if all values are valid numbers
    if (Object.values(formData).some(val => val === undefined || val === null || isNaN(val))) {
      setShowResults(false)
      return
    }

    const hasErrors = Object.keys(errors).length > 0

    const nebenkosten = (immobilienpreis * (grunderwerbsteuer + notarkosten + kaeufernebenkosten)) / 100
    const gesamtkosten = immobilienpreis + nebenkosten
    const darlehenssumme = Math.max(0, gesamtkosten - eigenkapital)
    const monatlicheRate = (darlehenssumme * (sollzins + tilgung)) / 12 / 100

    setResults({ gesamtkosten, darlehenssumme, monatlicheRate })


    
    // Calculate amortization schedule for chart display
    let remainingDebt = darlehenssumme
    const monthlyInterestRate = sollzins / 100 / 12

    const labels: string[] = []
    const interestData: number[] = []
    const repaymentData: number[] = []
    const remainingDebtData: number[] = []

    let cumulativeInterest = 0
    let cumulativeRepayment = 0

    for (let year = 1; year <= laufzeit; year++) {
      let yearlyInterest = 0
      for (let month = 1; month <= 12; month++) {
        const interestForMonth = remainingDebt * monthlyInterestRate
        const repaymentForMonth = monatlicheRate - interestForMonth
                  if (remainingDebt - repaymentForMonth < 0) {
            // Final payment covers remaining debt
            cumulativeRepayment += remainingDebt
            remainingDebt = 0
            break
          }
        remainingDebt -= repaymentForMonth
        yearlyInterest += interestForMonth
      }
      cumulativeInterest += yearlyInterest
      cumulativeRepayment = darlehenssumme - remainingDebt

      labels.push(`Jahr ${year}`)
      interestData.push(cumulativeInterest)
      repaymentData.push(cumulativeRepayment)
      remainingDebtData.push(remainingDebt)
      if (remainingDebt <= 0) break
    }

    setChartData({
      labels,
      datasets: [
        {
          label: "Restschuld",
          data: remainingDebtData,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
        },
        {
          label: "Kumulierte Tilgung",
          data: repaymentData,
          borderColor: "rgb(22, 163, 74)",
          backgroundColor: "rgba(22, 163, 74, 0.5)",
        },
        {
          label: "Kumulierter Zinsanteil",
          data: interestData,
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.5)",
        },
      ],
    })
    
    setShowResults(true)
  }, [
    formData.immobilienpreis,
    formData.eigenkapital,
    formData.grunderwerbsteuer,
    formData.notarkosten,
    formData.kaeufernebenkosten,
    formData.sollzins,
    formData.tilgung,
    formData.laufzeit,
    Object.keys(errors).length
  ])

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center justify-center">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">German Mortgage Calculator Example</h1>
          <a 
            href="https://github.com/holdmycodegmbh/german-mortgage-calculator" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            title="View on GitHub"
          >
            <Github size={16} />
            View on GitHub
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          <ValidatedMortgageInput
            id="immobilienpreis"
            label="Immobilienpreis"
            unit="€"
            value={formData.immobilienpreis}
            onChange={(value) => handleInputChange("immobilienpreis", value)}
            step="1000"
            error={errors.immobilienpreis?.message}
          />
          <ValidatedMortgageInput
            id="eigenkapital"
            label="Eigenkapital"
            unit="€"
            value={formData.eigenkapital}
            onChange={(value) => handleInputChange("eigenkapital", value)}
            step="1000"
            error={errors.eigenkapital?.message}
          />
          <ValidatedMortgageInput
            id="grunderwerbsteuer"
            label="Grunderwerbsteuer"
            unit="%"
            value={formData.grunderwerbsteuer}
            onChange={(value) => handleInputChange("grunderwerbsteuer", value)}
            error={errors.grunderwerbsteuer?.message}
          />
          <ValidatedMortgageInput
            id="notarkosten"
            label="Notarkosten"
            unit="%"
            value={formData.notarkosten}
            onChange={(value) => handleInputChange("notarkosten", value)}
            error={errors.notarkosten?.message}
          />
          <ValidatedMortgageInput
            id="kaeufernebenkosten"
            label="Käufernebenkosten"
            unit="%"
            value={formData.kaeufernebenkosten}
            onChange={(value) => handleInputChange("kaeufernebenkosten", value)}
            error={errors.kaeufernebenkosten?.message}
          />
          <ValidatedMortgageInput
            id="sollzins"
            label="Sollzins p.a."
            unit="%"
            value={formData.sollzins}
            onChange={(value) => handleInputChange("sollzins", value)}
            error={errors.sollzins?.message}
          />
          <ValidatedMortgageInput
            id="tilgung"
            label="Tilgung p.a."
            unit="%"
            value={formData.tilgung}
            onChange={(value) => handleInputChange("tilgung", value)}
            error={errors.tilgung?.message}
          />
          <ValidatedMortgageInput
            id="laufzeit"
            label="Laufzeit"
            unit="Jahre"
            value={formData.laufzeit}
            onChange={(value) => handleInputChange("laufzeit", value)}
            step="1"
            error={errors.laufzeit?.message}
          />
        </div>

        {showResults && (
          <div className="mt-8 md:mt-10 pt-6 border-t border-slate-200">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-4">Ergebnisse</h2>
            {Object.keys(errors).length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <div className="text-yellow-600 text-sm">
                    ⚠️ <strong>Hinweis:</strong> Einige Eingaben sind nicht valide. Die Berechnungen basieren auf den aktuellen Werten, könnten aber ungenau sein.
                  </div>
                </div>
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 p-4 rounded-lg shadow-sm">
                <div className="text-sm text-slate-500">Gesamtkosten</div>
                <div className="text-xl font-bold text-slate-800">{formatCurrency(results.gesamtkosten)}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg shadow-sm">
                <div className="text-sm text-slate-500">Darlehenssumme</div>
                <div className="text-xl font-bold text-slate-800">{formatCurrency(results.darlehenssumme)}</div>
              </div>
              <div className="bg-sky-50 p-4 rounded-lg shadow-sm border border-sky-200">
                <div className="text-sm text-sky-600">Monatliche Rate</div>
                <div className="text-2xl font-bold text-sky-700">{formatCurrency(results.monatlicheRate)}</div>
              </div>
            </div>
            <AmortizationChart chartData={chartData} />
          </div>
        )}
      </div>
      <footer className="text-center text-sm text-slate-500 mt-8">
        <p>Made with ❤️ by Gregor Doroschenko @ <a href="https://holdmycode.com" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 underline">Hold My Code GmbH</a>. Alle Angaben ohne Gewähr.</p>
      </footer>
    </div>
  )
}
