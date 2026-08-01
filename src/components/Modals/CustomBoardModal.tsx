import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../UI/Button';
import { CUSTOM_BOARD_LIMITS } from '../../constants/difficulties';

interface CustomBoardModalProps {
  open: boolean;
  onClose: () => void;
  onStart: (rows: number, cols: number, mines: number) => void;
}

const { minRows, maxRows, minCols, maxCols } = CUSTOM_BOARD_LIMITS;

function Slider({
  label,
  value,
  min,
  max,
  onChange,
  suffix = '',
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-text-muted">{label}</span>
        <span className="font-display font-bold text-text">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-muted accent-accent-blue"
      />
    </label>
  );
}

export function CustomBoardModal({ open, onClose, onStart }: CustomBoardModalProps) {
  const [rows, setRows] = useState(12);
  const [cols, setCols] = useState(12);
  const [mines, setMines] = useState(29);

  const maxMines = Math.max(1, rows * cols - 9);
  const clampedMines = Math.min(mines, maxMines);
  const density = Math.round((clampedMines / (rows * cols)) * 100);

  const handleRowsChange = (v: number) => {
    setRows(v);
    setMines((m) => Math.min(m, Math.max(1, v * cols - 9)));
  };
  const handleColsChange = (v: number) => {
    setCols(v);
    setMines((m) => Math.min(m, Math.max(1, rows * v - 9)));
  };

  const handleStart = () => {
    onStart(rows, cols, clampedMines);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Custom board">
      <div className="space-y-4">
        <Slider label="Rows" value={rows} min={minRows} max={maxRows} onChange={handleRowsChange} />
        <Slider label="Columns" value={cols} min={minCols} max={maxCols} onChange={handleColsChange} />
        <Slider label="Mines" value={clampedMines} min={1} max={maxMines} onChange={setMines} suffix={` (${density}%)`} />
        <Button onClick={handleStart} fullWidth>
          Start custom game
        </Button>
      </div>
    </Modal>
  );
}
