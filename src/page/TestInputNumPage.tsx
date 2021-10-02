import React, { VFC, useState, useCallback } from 'react';
import InputNumber from '../components/InputNumber';

import { DataType } from '../components/inputUtil';

type InputValueType = {
  [id: string]: DataType;
};

const TestInputNumPage: VFC = () => {
  const [state, setState] = useState<InputValueType>({});

  // const setNumValue: setValueCallback = (id, data) => {
  //   console.log(`${id}: ${JSON.stringify(data)}`);
  //   setState((prev) => {
  //     return { ...prev, [id]: data };
  //   });
  // };
  const setNumValue = useCallback((id: string, data: DataType) => {
    console.log(`${id}: ${JSON.stringify(data)}`);
    setState((prev) => {
      return { ...prev, [id]: data };
    });
  }, []);

  const [val1, setValue1] = useState<number | null>(1);
  const copyNum2ToNum1 = () => {
    setValue1(state['InputNum2'].value);
  };

  return (
    <>
      <div>
        <InputNumber id="InputNum1" setValueCallback={setNumValue} defValue={val1} style={{ color: 'red' }} />
      </div>
      <div>
        <InputNumber id="InputNum2" setValueCallback={setNumValue} maxValue={100} />{' '}
        <button type="button" onClick={copyNum2ToNum1}>
          button
        </button>
      </div>
      <div>
        <input type="date"></input>
      </div>
    </>
  );
};

export default TestInputNumPage;
