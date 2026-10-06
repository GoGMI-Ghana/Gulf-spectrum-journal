// A form field people never see or reach (off-screen, skipped by the Tab
// key and by screen readers, ignored by autofill) but that automated form
// spammers fill in along with everything else. The public intake routes
// quietly discard any post where it has a value — see isBotPost in
// lib/staffAlerts.ts.
export default function HoneypotField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  )
}
