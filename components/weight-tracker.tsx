"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Plus, TrendingDown, TrendingUp, Target, Calendar, Weight } from 'lucide-react'

interface WeightEntry {
  week: number
  weight: number
  date: string
  dose: number
}

const initialData: WeightEntry[] = [
  { week: 0, weight: 150.0, date: '11.11.2024', dose: 2.5 },
  { week: 1, weight: 149.0, date: '18.11.2024', dose: 2.5 },
  { week: 2, weight: 148.0, date: '25.11.2024', dose: 5.0 },
  { week: 3, weight: 146.0, date: '02.12.2024', dose: 7.5 },
  // ... zbytek dat z tabulky
]

export default function WeightTracker() {
  const [data, setData] = useState<WeightEntry[]>(initialData)
  const [newWeight, setNewWeight] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newDose, setNewDose] = useState('')
  const { toast } = useToast()

  // Výpočty statistik
  const currentWeight = data[data.length - 1]?.weight || 0
  const startWeight = data[0]?.weight || 0
  const totalLoss = startWeight - currentWeight
  const weightTrend = data.length >= 2 ? data[data.length - 1].weight - data[data.length - 2].weight : 0

  // Funkce pro přidání nového záznamu
  const addEntry = () => {
    if (!newWeight || !newDate) {
      toast({
        title: "Chyba",
        description: "Prosím vyplň hmotnost a datum",
        variant: "destructive",
      })
      return
    }

    const weight = parseFloat(newWeight)
    const dose = parseFloat(newDose) || 0
    
    const nextWeek = data.length > 0 ? Math.max(...data.map(d => d.week)) + 1 : 0
    
    const newEntry: WeightEntry = {
      week: nextWeek,
      weight: weight,
      date: newDate,
      dose: dose
    }

    setData(prev => [...prev, newEntry])
    setNewWeight('')
    setNewDate('')
    setNewDose('')
    
    toast({
      title: "Úspěch!",
      description: `Hmotnost ${weight} kg byla přidána pro týden ${nextWeek}`,
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-health-background min-h-screen">
      {/* Nadpis */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-health-text">Sledování hmotnosti</h1>
        <p className="text-health-muted">Interaktivní graf s možností přidávání nových dat</p>
      </div>

      {/* Statistiky */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-health-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-health-muted">Aktuální hmotnost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-text">{currentWeight.toFixed(1)} kg</div>
          </CardContent>
        </Card>
        {/* Další karty statistik... */}
      </div>

      {/* Graf */}
      <Card className="bg-health-card">
        <CardHeader>
          <CardTitle className="text-health-text">Graf hmotnosti v čase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="week" tickFormatter={(value) => `T${value}`} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Formulář pro přidání nového záznamu */}
      <Card className="bg-health-card">
        <CardHeader>
          <CardTitle className="text-health-text">Přidat nový záznam</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="number"
              placeholder="Hmotnost (kg)"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
            />
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Dávka (mg)"
              value={newDose}
              onChange={(e) => setNewDose(e.target.value)}
            />
            <Button onClick={addEntry}>Přidat záznam</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
