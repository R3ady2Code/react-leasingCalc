import React from 'react';

import style from './RangeInput.module.scss';

const RangeInput = ({
  span,
  value,
  setValue,
  minValue,
  maxValue,
  unit,
  initialCost,
  className,
}) => {
  const formatValue = (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const formatPercentValue = (value) => {
    const option = {
      style: 'percent',
      maximumFractionDigits: 0,
    };

    const formatter = new Intl.NumberFormat('en-US', option);
    return formatter.format(value / 100);
  };

  const [onFocus, setOnFocus] = React.useState(false);
  const [focusValue, setFocusValue] = React.useState(
    span === 'Первоначальный взнос' ? formatPercentValue(value) : formatValue(value),
  );

  const updateInput = () => {
    const number =
      span === 'Первоначальный взнос' ? focusValue.slice(0, -1) : focusValue.replace(/\s+/g, '');
    const res = Number(number);

    setValue(res.toLocaleString('ru'));
  };

  const updateRangeInput = (e) => {
    setValue(e.toLocaleString('ru'));
  };

  const onKeyDownFocusValue = (e) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      updateInput();
    }
  };

  React.useEffect(() => {
    if (!onFocus) {
      updateInput();
    }
  }, [onFocus]);

  React.useEffect(() => {
    setFocusValue(span === 'Первоначальный взнос' ? formatPercentValue(value) : formatValue(value));
  }, [value]);

  return (
    <form className={className}>
      <label>{span}</label>
      {span === 'Первоначальный взнос' ? (
        <>
          <input
            type="text"
            className={style.basic}
            readOnly
            disabled
            value={initialCost}
            onChange={(e) => setValue(e.target.value)}
          />
          <input
            className={style.inputValue}
            type="text"
            value={onFocus ? focusValue : formatPercentValue(value)}
            onChange={(e) => setFocusValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onKeyDownFocusValue(e)}
            onFocus={() => setOnFocus(true)}
            onBlur={() => setOnFocus(false)}
          />
        </>
      ) : (
        <>
          <input
            type="text"
            className={style.basic}
            value={onFocus ? focusValue : formatValue(value)}
            onChange={(e) => setFocusValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onKeyDownFocusValue(e)}
            onFocus={() => setOnFocus(true)}
            onBlur={() => setOnFocus(false)}
          />
          <div className={style.unit}>{unit}</div>
        </>
      )}
      <input
        type="range"
        min={minValue}
        max={maxValue}
        value={Number(value.replace(/\s+/g, ''))}
        onChange={(e) => updateRangeInput(e.target.value)}
      />
    </form>
  );
};

export default RangeInput;
