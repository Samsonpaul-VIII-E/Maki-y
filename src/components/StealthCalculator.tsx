import React, { useState } from 'react';
import { sound } from '../services/sound';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface StealthCalculatorProps {
  onUnlock: () => void;
  onDuressWipe: () => void;
}

export const StealthCalculator: React.FC<StealthCalculatorProps> = ({ onUnlock, onDuressWipe }) => {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [wipeNotice, setWipeNotice] = useState(false);

  const handleKey = (val: string) => {
    sound.playKeyClick('brown');

    if (val === 'C') {
      setDisplay('0');
      setPrevVal(null);
      setOp(null);
      return;
    }

    if (val === '=') {
      // Check for secret passcodes
      if (display === '1337' || display === '7777') {
        sound.playTerminalBeep(1200, 0.1);
        onUnlock();
        return;
      }
      if (display === '9999' || display === '0000') {
        sound.playTerminalBeep(300, 0.4);
        setWipeNotice(true);
        setTimeout(() => {
          onDuressWipe();
        }, 1500);
        return;
      }

      if (op && prevVal !== null) {
        const cur = parseFloat(display);
        let res = 0;
        if (op === '+') res = prevVal + cur;
        else if (op === '-') res = prevVal - cur;
        else if (op === '×') res = prevVal * cur;
        else if (op === '÷') res = cur !== 0 ? prevVal / cur : 0;
        setDisplay(String(Number(res.toFixed(6))));
        setPrevVal(null);
        setOp(null);
      }
      return;
    }

    if (['+', '-', '×', '÷'].includes(val)) {
      setPrevVal(parseFloat(display));
      setOp(val);
      setDisplay('0');
      return;
    }

    if (val === '.') {
      if (!display.includes('.')) setDisplay(display + '.');
      return;
    }

    // Number input
    if (display === '0') {
      setDisplay(val);
    } else {
      setDisplay(display + val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1c1c1e] text-white flex flex-col items-center justify-center p-4 select-none font-sans">
      <div className="w-full max-w-xs bg-black rounded-3xl p-6 shadow-2xl border border-neutral-800">
        <div className="flex justify-between items-center mb-4 text-xs text-neutral-500 font-mono">
          <span className="cursor-pointer hover:text-neutral-300" onClick={onUnlock}>CALC_STD_v2.4</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-neutral-600"></span> READY
          </span>
        </div>

        {wipeNotice && (
          <div className="mb-3 p-2 bg-red-950/80 border border-red-500 rounded text-red-400 text-xs flex items-center gap-2 animate-pulse">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
            <span>DURESS PIN DETECTED: PURGING VOLATILE RAM & ENCLAVE KEYS...</span>
          </div>
        )}

        {/* Display */}
        <div className="bg-[#121214] rounded-2xl p-4 mb-5 text-right font-light text-4xl overflow-x-auto tracking-tight border border-neutral-900 h-20 flex items-center justify-end">
          {display}
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-4 gap-3">
          {['C', '±', '%', '÷'].map((btn) => (
            <button
              key={btn}
              id={`calc-btn-${btn}`}
              onClick={() => handleKey(btn)}
              className="h-14 rounded-full bg-neutral-700 text-black font-medium text-lg hover:bg-neutral-600 active:scale-95 transition-all flex items-center justify-center"
            >
              {btn}
            </button>
          ))}

          {['7', '8', '9', '×'].map((btn) => (
            <button
              key={btn}
              id={`calc-btn-${btn}`}
              onClick={() => handleKey(btn)}
              className={`h-14 rounded-full font-medium text-lg active:scale-95 transition-all flex items-center justify-center ${
                btn === '×' ? 'bg-amber-500 text-white hover:bg-amber-400' : 'bg-neutral-800 text-white hover:bg-neutral-700'
              }`}
            >
              {btn}
            </button>
          ))}

          {['4', '5', '6', '-'].map((btn) => (
            <button
              key={btn}
              id={`calc-btn-${btn}`}
              onClick={() => handleKey(btn)}
              className={`h-14 rounded-full font-medium text-lg active:scale-95 transition-all flex items-center justify-center ${
                btn === '-' ? 'bg-amber-500 text-white hover:bg-amber-400' : 'bg-neutral-800 text-white hover:bg-neutral-700'
              }`}
            >
              {btn}
            </button>
          ))}

          {['1', '2', '3', '+'].map((btn) => (
            <button
              key={btn}
              id={`calc-btn-${btn}`}
              onClick={() => handleKey(btn)}
              className={`h-14 rounded-full font-medium text-lg active:scale-95 transition-all flex items-center justify-center ${
                btn === '+' ? 'bg-amber-500 text-white hover:bg-amber-400' : 'bg-neutral-800 text-white hover:bg-neutral-700'
              }`}
            >
              {btn}
            </button>
          ))}

          <button
            id="calc-btn-0"
            onClick={() => handleKey('0')}
            className="col-span-2 h-14 rounded-full bg-neutral-800 text-white font-medium text-lg hover:bg-neutral-700 active:scale-95 transition-all flex items-center pl-6"
          >
            0
          </button>
          <button
            id="calc-btn-dot"
            onClick={() => handleKey('.')}
            className="h-14 rounded-full bg-neutral-800 text-white font-medium text-lg hover:bg-neutral-700 active:scale-95 transition-all flex items-center justify-center"
          >
            .
          </button>
          <button
            id="calc-btn-eq"
            onClick={() => handleKey('=')}
            className="h-14 rounded-full bg-amber-500 text-white font-medium text-lg hover:bg-amber-400 active:scale-95 transition-all flex items-center justify-center"
          >
            =
          </button>
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-900 text-[10px] text-neutral-600 flex justify-between items-center font-mono">
          <span>Decoy Cover Active</span>
          <span className="text-neutral-500">PIN: 1337 = Return</span>
        </div>
      </div>
    </div>
  );
};
