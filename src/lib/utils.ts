import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NextResponse } from "next/server"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function apiError(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : "An unexpected error occurred"
  return NextResponse.json({ error: message }, { status })
}
