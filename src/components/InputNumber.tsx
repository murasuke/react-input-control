import React, { ComponentPropsWithoutRef, VFC, useEffect, useState, useMemo, useCallback } from 'react';

import { ControlType, setValueCallback, defaultSetValue, Nullable } from './inputUtil';

type InputNumericalType = ComponentPropsWithoutRef<'input'> & {
  id: string;
  setValueCallback?: setValueCallback;
  integerDigits?: number;
  decimalDigit?: number;
  autoFormat?: boolean;
  allowEmpty?: boolean;
  defValue?: Nullable<number>;
  maxValue?: number;
  minValue?: number;
};

const InputNumber: VFC<InputNumericalType> = ({
  setValueCallback = defaultSetValue,
  integerDigits = 10,
  decimalDigit = 0,
  autoFormat = true,
  allowEmpty = true,
  defValue = null,
  maxValue = Number.MAX_SAFE_INTEGER,
  minValue = Number.MIN_SAFE_INTEGER,
  ...props
}) => {
  const [inputState, setInputState] = useState<{ value: Nullable<number>; text: string }>({ value: null, text: '' });
  const [active, setActive] = useState(false);
  const regexp = `^-?[0-9]{0,${integerDigits}}(.[0-9]{0,${decimalDigit})?$`;

  const toNum = (value: string) => {
    if (value === '-') return -0;
    return value ? Number(value) : null;
  };

  const formatValue = useCallback(
    (value: Nullable<number>, format: boolean = true) => {
      if (typeof value === 'number') {
        if (Object.is(value, -0)) {
          return { type: ControlType.NUMBER, value: 0, text: '-' };
        }
        const formatValue = format && autoFormat ? value.toLocaleString() : value.toString();
        return { type: ControlType.NUMBER, value, text: formatValue };
      } else {
        return { type: ControlType.NUMBER, value, text: '' };
      }
    },
    [autoFormat],
  );

  const validate = (value: string) => {
    if (!validationExp.test(value)) return false;
    //const num = Number(value);
    // if (num > maxValue) return false;
    // if (num < minValue) return false;
    return true;
  };

  const validationExp = useMemo(() => new RegExp(regexp), [regexp]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputState((prev) => {
      if (validate(e.target.value)) {
        const val = formatValue(toNum(e.target.value), !active);
        return { ...prev, ...val };
      }
      return prev;
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setActive(true);
    setInputState((prev) => {
      const val = formatValue(toNum(e.target.value.replaceAll(',', '')), false);
      return { ...prev, ...val };
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setActive(false);
    setInputState((prev) => {
      const val = formatValue(toNum(e.target.value.replaceAll(',', '')));
      return { ...prev, ...val };
    });
  };

  useEffect(() => {
    setInputState((prev) => {
      const val = formatValue(defValue);
      setValueCallback(props.id, val);
      return { ...prev, ...val };
    });
  }, [props.id, defValue, formatValue, setValueCallback]);

  useEffect(() => {
    setValueCallback(props.id, formatValue(inputState.value));
  }, [props.id, inputState, formatValue, setValueCallback]);
  const changeHandlers = [handleChange];
  // if (props.onChange) {
  //   changeHandlers.push(props.onChange);
  //   delete props.onChange;
  // }

  let mergeStyle: React.CSSProperties = { textAlign: 'right' };
  if (props.style) {
    mergeStyle = { ...props.style, textAlign: 'right' };
    delete props.style;
  }

  return (
    <input
      type="text"
      style={mergeStyle}
      onChange={(e) => changeHandlers.forEach((handler) => handler(e))}
      onFocus={handleFocus}
      onBlur={handleBlur}
      value={inputState.text}
      {...props}
    ></input>
  );
};

export default InputNumber;
