"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const handleEquals = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const buttons = [
    { label: "C", onClick: clear, className: "bg-red-500 hover:bg-red-600 text-white" },
    {
      label: "±",
      onClick: () => setDisplay(String(-Number.parseFloat(display))),
      className: "bg-gray-500 hover:bg-gray-600 text-white",
    },
    {
      label: "%",
      onClick: () => setDisplay(String(Number.parseFloat(display) / 100)),
      className: "bg-gray-500 hover:bg-gray-600 text-white",
    },
    { label: "÷", onClick: () => performOperation("÷"), className: "bg-orange-500 hover:bg-orange-600 text-white" },

    { label: "7", onClick: () => inputNumber("7"), className: "bg-gray-700 hover:bg-gray-600 text-white" },
    { label: "8", onClick: () => inputNumber("8"), className: "bg-gray-700 hover:bg-gray-600 text-white" },
    { label: "9", onClick: () => inputNumber("9"), className: "bg-gray-700 hover:bg-gray-600 text-white" },
    { label: "×", onClick: () => performOperation("×"), className: "bg-orange-500 hover:bg-orange-600 text-white" },

    { label: "4", onClick: () => inputNumber("4"), className: "bg-gray-700 hover:bg-gray-600 text-white" },
    { label: "5", onClick: () => inputNumber("5"), className: "bg-gray-700 hover:bg-gray-600 text-white" },
    { label: "6", onClick: () => inputNumber("6"), className: "bg-gray-700 hover:bg-gray-600 text-white" },
    { label: "-", onClick: () => performOperation("-"), className: "bg-orange-500 hover:bg-orange-600 text-white" },

    { label: "1", onClick: () => inputNumber("1"), className: "bg-gray-700 hover:bg-gray-600 text-white" },
    { label: "2", onClick: () => inputNumber("2"), className: "bg-gray-700 hover:bg-gray-600 text-white" },
    { label: "3", onClick: () => inputNumber("3"), className: "bg-gray-700 hover:bg-gray-600 text-white" },
    { label: "+", onClick: () => performOperation("+"), className: "bg-orange-500 hover:bg-orange-600 text-white" },

    { label: "0", onClick: () => inputNumber("0"), className: "bg-gray-700 hover:bg-gray-600 text-white col-span-2" },
    { label: ".", onClick: inputDecimal, className: "bg-gray-700 hover:bg-gray-600 text-white" },
    { label: "=", onClick: handleEquals, className: "bg-orange-500 hover:bg-orange-600 text-white" },
  ]

  return (
    <div className="h-full bg-black p-4 flex flex-col">
      {/* Display */}
      <div className="bg-gray-900 rounded-lg p-6 mb-4 text-right">
        <div className="text-4xl font-light text-white overflow-hidden">{display}</div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        {buttons.map((button, index) => (
          <Button
            key={index}
            onClick={button.onClick}
            className={`h-16 text-xl font-medium rounded-lg ${button.className}`}
            style={{ gridColumn: button.className.includes("col-span-2") ? "span 2" : "span 1" }}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
