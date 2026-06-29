import { NextResponse } from 'next/server';

export function csvParam(value: string | null) {
  return value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

export function numberParam(value: string | null) {
  if (!value) return undefined;
  const next = Number(value);
  return Number.isFinite(next) ? next : undefined;
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
