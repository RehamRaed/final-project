'use client';

import React from 'react';

interface TimeNeededProps {
  minutes: number | null;
}

export default function TimeNeeded({ minutes }: TimeNeededProps) {
  function formatDuration(mins: number | null) {
    if (!mins || mins <= 0) return "less than a minute";

    const totalMins = Math.round(mins);

    if (totalMins < 60) return `${totalMins} minutes`;

    const hours = Math.floor(totalMins / 60);
    const remMins = totalMins % 60;

    const hourText = `${hours} hour${hours > 1 ? 's' : ''}`;
    const minText = remMins > 0 ? ` and ${remMins} minute${remMins > 1 ? 's' : ''}` : '';

    return `${hourText}${minText}`;
  }

  return (
    <span className="text-sm text-gray-500 mt-1" aria-label={`Estimated duration: ${formatDuration(minutes)}`}>
      {formatDuration(minutes)}
    </span>
  );
}