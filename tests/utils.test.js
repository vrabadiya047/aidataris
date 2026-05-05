import { describe, it, expect } from 'vitest'
import { toDateStr, computeSlots } from '../server.js'

/* ── toDateStr ─────────────────────────────────────────── */
describe('toDateStr', () => {
  it('pads single-digit month and day with leading zeros', () => {
    expect(toDateStr(new Date(2025, 0, 5))).toBe('2025-01-05')
  })

  it('formats double-digit month and day correctly', () => {
    expect(toDateStr(new Date(2025, 11, 31))).toBe('2025-12-31')
  })

  it('handles the start of the year', () => {
    expect(toDateStr(new Date(2026, 0, 1))).toBe('2026-01-01')
  })
})

/* ── computeSlots ──────────────────────────────────────── */
describe('computeSlots', () => {
  const date = '2025-06-10'  // a Tuesday

  // Slots are generated at every SLOT_MIN (30-min) interval within the day.
  // A 60-min booking starting at 09:00 runs 09:00–10:00; the next start is
  // 09:30 (30 min later), not 10:00 — so the slot count is higher than 8.
  // Formula: floor((dayEnd - dayStart - duration) / slotMin) + 1

  it('returns 16 slots for 30-min duration (09:00–16:30)', () => {
    const slots = computeSlots([], date, 30)
    expect(slots).toHaveLength(16)
    expect(slots[0]).toBe('09:00')
    expect(slots[slots.length - 1]).toBe('16:30')
  })

  it('returns 15 slots for 60-min duration (09:00–16:00)', () => {
    const slots = computeSlots([], date, 60)
    expect(slots).toHaveLength(15)
    expect(slots[0]).toBe('09:00')
    expect(slots[slots.length - 1]).toBe('16:00')
  })

  it('returns 14 slots for 90-min duration (09:00–15:30)', () => {
    const slots = computeSlots([], date, 90)
    expect(slots).toHaveLength(14)
    expect(slots[0]).toBe('09:00')
    expect(slots[slots.length - 1]).toBe('15:30')
  })

  it('excludes slots that overlap a busy block', () => {
    // Block 10:00–11:00 AWST = 02:00–03:00 UTC
    const busy = [{
      start: new Date(`${date}T02:00:00Z`),
      end:   new Date(`${date}T03:00:00Z`),
    }]
    const slots = computeSlots(busy, date, 60)
    expect(slots).not.toContain('10:00')  // starts inside block
    expect(slots).not.toContain('09:30')  // 09:30–10:30 overlaps block
    expect(slots).toContain('09:00')      // 09:00–10:00 ends exactly at block start — ok
    expect(slots).toContain('11:00')      // starts when block ends — ok
  })

  it('excludes a slot whose start falls during a busy block', () => {
    // Block 09:30–10:30 AWST = 01:30–02:30 UTC
    const busy = [{
      start: new Date(`${date}T01:30:00Z`),
      end:   new Date(`${date}T02:30:00Z`),
    }]
    const slots = computeSlots(busy, date, 60)
    expect(slots).not.toContain('09:30')  // starts inside block
    expect(slots).not.toContain('09:00')  // 09:00–10:00 overlaps 09:30–10:30
    expect(slots).toContain('10:30')      // starts when block ends
  })

  it('returns empty array when the whole day is blocked', () => {
    // Block 09:00–17:00 AWST = 01:00–09:00 UTC
    const busy = [{
      start: new Date(`${date}T01:00:00Z`),
      end:   new Date(`${date}T09:00:00Z`),
    }]
    const slots = computeSlots(busy, date, 30)
    expect(slots).toHaveLength(0)
  })

  it('returns only 09:00 when duration fills the entire working day', () => {
    // 480-min (8h) slot: 09:00–17:00 fits exactly; 09:30–17:30 does not
    const slots = computeSlots([], date, 480)
    expect(slots).toHaveLength(1)
    expect(slots[0]).toBe('09:00')
  })

  it('handles multiple non-contiguous busy blocks', () => {
    const busy = [
      { start: new Date(`${date}T01:00:00Z`), end: new Date(`${date}T02:00:00Z`) }, // 09–10 AWST
      { start: new Date(`${date}T04:00:00Z`), end: new Date(`${date}T05:00:00Z`) }, // 12–13 AWST
    ]
    const slots = computeSlots(busy, date, 60)
    expect(slots).not.toContain('09:00')  // 09:00–10:00 is blocked
    expect(slots).not.toContain('12:00')  // 12:00–13:00 is blocked
    expect(slots).toContain('10:00')
    expect(slots).toContain('11:00')
    expect(slots).toContain('13:00')
  })
})
