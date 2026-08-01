import { Timer as TimerIcon } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';
import { formatTime } from '../../utils/formatTime';
import { StatChip } from './StatChip';

interface TimerChipProps {
  startedAt: number | null;
  endedAt: number | null;
}

export function TimerChip({ startedAt, endedAt }: TimerChipProps) {
  const elapsed = useTimer(startedAt, endedAt);
  return <StatChip icon={<TimerIcon size={16} />} value={formatTime(elapsed)} label="Time elapsed" />;
}
