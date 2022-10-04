import React from 'react';
import style from './Result.module.scss';

const Result = ({ span, result }) => {
  return (
    <div className={style.result}>
      <span>{span}</span>
      <h3>{result}</h3>
    </div>
  );
};

export default Result;
