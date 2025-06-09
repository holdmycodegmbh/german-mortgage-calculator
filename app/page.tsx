"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MortgageInput } from "@/components/mortgage-input"
import { AmortizationChart } from "@/components/amortization-chart"
import type { ChartData } from "chart.js"

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
  // Form inputs
  const [inputs, setInputs] = useState({
    immobilienpreis: "350000",
    eigenkapital: "70000",
    grunderwerbsteuer: "6.5",
    notarkosten: "1.5",
    kaeufernebenkosten: "3.5",
    sollzins: "3.5",
    tilgung: "2.0",
    laufzeit: "25",
  })

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
    } = Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, Number.parseFloat(value) || 0]))

    const nebenkosten = (immobilienpreis * (grunderwerbsteuer + notarkosten + kaeufernebenkosten)) / 100
    const gesamtkosten = immobilienpreis + nebenkosten
    const darlehenssumme = Math.max(0, gesamtkosten - eigenkapital)
    const monatlicheRate = (darlehenssumme * (sollzins + tilgung)) / 12 / 100

    setResults({ gesamtkosten, darlehenssumme, monatlicheRate })

    if (darlehenssumme > 0 && laufzeit > 0) {
      setShowResults(true)
      // --- Amortization Calculation ---
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
            // Last payment
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
            borderColor: "rgb(59, 130, 246)", // blue-500
            backgroundColor: "rgba(59, 130, 246, 0.5)",
          },
          {
            label: "Kumulierte Tilgung",
            data: repaymentData,
            borderColor: "rgb(22, 163, 74)", // green-600
            backgroundColor: "rgba(22, 163, 74, 0.5)",
          },
          {
            label: "Kumulierter Zinsanteil",
            data: interestData,
            borderColor: "rgb(239, 68, 68)", // red-500
            backgroundColor: "rgba(239, 68, 68, 0.5)",
          },
        ],
      })
    } else {
      setShowResults(false)
    }
  }, [inputs])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setInputs((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center justify-center">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-6 md:mb-8">German Mortgage Calculator Example</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          <MortgageInput
            id="immobilienpreis"
            label="Immobilienpreis"
            unit="€"
            value={inputs.immobilienpreis}
            onChange={handleInputChange}
            step="1000"
          />
          <MortgageInput
            id="eigenkapital"
            label="Eigenkapital"
            unit="€"
            value={inputs.eigenkapital}
            onChange={handleInputChange}
            step="1000"
          />
          <MortgageInput
            id="grunderwerbsteuer"
            label="Grunderwerbsteuer"
            unit="%"
            value={inputs.grunderwerbsteuer}
            onChange={handleInputChange}
          />
          <MortgageInput
            id="notarkosten"
            label="Notarkosten"
            unit="%"
            value={inputs.notarkosten}
            onChange={handleInputChange}
          />
          <MortgageInput
            id="kaeufernebenkosten"
            label="Käufernebenkosten"
            unit="%"
            value={inputs.kaeufernebenkosten}
            onChange={handleInputChange}
          />
          <MortgageInput
            id="sollzins"
            label="Sollzins p.a."
            unit="%"
            value={inputs.sollzins}
            onChange={handleInputChange}
          />
          <MortgageInput
            id="tilgung"
            label="Tilgung p.a."
            unit="%"
            value={inputs.tilgung}
            onChange={handleInputChange}
          />
          <MortgageInput
            id="laufzeit"
            label="Laufzeit"
            unit="Jahre"
            value={inputs.laufzeit}
            onChange={handleInputChange}
            step="1"
          />
        </div>

        {showResults && (
          <div className="mt-8 md:mt-10 pt-6 border-t border-slate-200">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-4">Ergebnisse</h2>
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
