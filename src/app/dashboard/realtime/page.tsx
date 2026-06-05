'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

type TelemetryEvent = {
  id: string
  robotName: string
  eventType: 'heartbeat' | 'sensor' | 'location' | 'battery' | 'error'
  timestamp: string
  trustScore: number
  status: 'nominal' | 'warning' | 'critical'
}

const ROBOTS = ['Atlas-7', 'Viper-3', 'Titan-12', 'Echo-9', 'Nova-5']
const EVENT_TYPES = ['heartbeat', 'sensor', 'location', 'battery', 'error'] as const
const FILTERS = ['all', ...EVENT_TYPES] as const

function generateEvent(): TelemetryEvent {
  const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)]
  const isError = eventType === 'error'
  return {
    id: crypto.randomUUID(),
    robotName: ROBOTS[Math.floor(Math.random() * ROBOTS.length)],
    eventType,
    timestamp: new Date().toISOString(),
    trustScore: isError ? Math.floor(Math.random() * 40) + 10 : Math.floor(Math.random() * 30) + 70,
    status: isError ? 'critical' : Math.random() > 0.8 ? 'warning' : 'nominal',
  }
}

const statusColor = (s: string) =>
  s === 'critical' ? 'destructive' : s === 'warning' ? 'secondary' : 'default'

export default function RealtimeDashboard() {
  const [events, setEvents] = useState<TelemetryEvent[]>([])
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => [generateEvent(), ...prev].slice(0, 50))
    }, 2000 + Math.random() * 1000)
    return () => clearInterval(interval)
  }, [])

  const filtered = filter === 'all' ? events : events.filter(e => e.eventType === filter)

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-mono">Live Telemetry Feed</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            Connected
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs rounded-md border font-mono capitalize transition-colors ${
                  filter === f ? 'bg-foreground text-background' : 'hover:bg-muted'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="max-h-[600px] overflow-y-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-mono">Robot</TableHead>
                  <TableHead className="font-mono">Event</TableHead>
                  <TableHead className="font-mono">Timestamp</TableHead>
                  <TableHead className="font-mono">Trust</TableHead>
                  <TableHead className="font-mono">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(e => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-sm">{e.robotName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs capitalize">{e.eventType}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(e.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{e.trustScore}%</TableCell>
                    <TableCell>
                      <Badge variant={statusColor(e.status)} className="font-mono text-xs capitalize">{e.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
