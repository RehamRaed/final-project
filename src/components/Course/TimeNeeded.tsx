export default function TimeNeeded({ minutes }: { minutes: number }) {
  function format(mins: number) {
    if (!mins || mins <= 0) return "0 minutes";
    if (mins < 60) return `${mins} minutes`;
    const hours = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem === 0 ? `${hours} hours` : `${hours}h ${rem}m`;
  }

  return <span className="text-sm text-gray-500 mt-1">{format(minutes)}</span>;
}