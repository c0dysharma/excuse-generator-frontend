"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ExcuseGenerator() {
  const [excuseType, setExcuseType] = useState<string>("")
  const [daysOff, setDaysOff] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [excuseText, setExcuseText] = useState<string>("")

  const getClassNames = (selected: boolean) => {
    return selected
      ? "rounded-full px-6 py-2 border-2 bg-[#820263] text-[#EADEDA] border-[#2E294E] hover:bg-[#820263]/90"
      : "rounded-full px-6 py-2 border-2 bg-transparent text-[#D90368] border-[#D90368] hover:bg-[#820263] hover:text-[#EADEDA] hover:border-transparent"
  }

  const handleGetExcuseClick = async () => {
    setIsModalOpen(true)
    setExcuseText("")

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: excuseType,
          days_off: parseInt(daysOff),
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      setExcuseText(data.excuse)
    } catch (error) {
      setExcuseText("Failed to load excuse")
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(excuseText)
  }

  return (
    <div className="relative min-h-screen">
      <div className={`flex items-center justify-center min-h-screen p-4 bg-[#2E294E] ${isModalOpen ? 'blur-sm' : ''}`} style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
        <Card className="w-full max-w-md bg-[#EADEDA] border-none shadow-lg">
          <CardHeader className="mt-4">
            <CardTitle className="text-3xl text-[#D90368]">Excuse Me</CardTitle>
          </CardHeader>
          <CardContent className="space-y-10">
            <div className="space-y-4">
              <p className="text-sm font-medium text-[#820263] uppercase">Type</p>
              <ToggleGroup
                type="single"
                value={excuseType}
                onValueChange={setExcuseType}
                className="flex flex-wrap gap-3"
              >
                {["funny", "serious", "extreme"].map((type) => (
                  <ToggleGroupItem
                    key={type}
                    value={type}
                    className={getClassNames(excuseType === type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-[#820263] uppercase">Days off</p>
              <ToggleGroup type="single" value={daysOff} onValueChange={setDaysOff} className="flex flex-wrap gap-3">
                {["1", "2", "3", "4"].map((day) => (
                  <ToggleGroupItem
                    key={day}
                    value={day}
                    className={getClassNames(daysOff === day)}
                  >
                    {day}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </CardContent>
          <CardFooter className="mt-10 mb-10">
            <Button
              className="w-full bg-[#D90368] hover:bg-[#D90368]/90 text-white py-6"
              onClick={handleGetExcuseClick}
              disabled={!excuseType || !daysOff}
            >
              Get Excuse
            </Button>
          </CardFooter>
        </Card>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
          <div className="relative bg-white w-[500px] h-[500px] p-4 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out scale-95">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-4xl" onClick={handleCloseModal}>
              &times;
            </button>
            <button
              className="absolute top-2 left-2 text-[#EADEDA] hover:text-gray-700 text-sm bg-[#820263] p-1 rounded"
              onClick={handleCopyText}
              disabled={!excuseText}
            >
              Copy
            </button>
            <div className="flex items-center justify-center h-full">
              {excuseText ? (
                <p className="text-center">{excuseText}</p>
              ) : (
                <img src="/boss.gif" alt="Loading" className="w-72 h-72" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
