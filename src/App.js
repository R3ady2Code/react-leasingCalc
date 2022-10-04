import React from 'react';
import axios from 'axios';
import './styles.scss';

import RangeInput from './components/RangeInput';
import Result from './components/Result';
import Button from './components/Button';

function App() {
  const [carCost, setCarCost] = React.useState('3 300 000');
  const [rate, setRate] = React.useState('13');
  const [leaseTerm, setLeaseTerm] = React.useState('60');

  const initialCost = Math.ceil((Number(carCost.replace(/\s+/g, '')) / 100) * Number(rate));
  const paymentPerMounth = Math.ceil(
    ((Number(carCost.replace(/\s+/g, '')) - initialCost) *
      (Number(rate) * 0.01 * Math.pow(1 + Number(rate) * 0.01, Number(leaseTerm)))) /
      (Math.pow(1 + Number(rate) * 0.01, Number(leaseTerm)) - 1),
  );
  const costOfLease = Math.ceil(initialCost + Number(leaseTerm) * paymentPerMounth);

  const [loading, setLoadind] = React.useState(false);

  const sendRequest = async () => {
    setLoadind(true);
    const requestBody = {
      carCost: carCost,
      rate: rate,
      leaseTerm: leaseTerm,
      initialCost: initialCost,
      paymentPerMounth: paymentPerMounth,
    };

    axios
      .post('https://eoj3r7f3r4ef6v4.m.pipedream.net', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...requestBody }),
      })
      .finally((res) => {
        alert('Ваш запрос отправлен!');
        setLoadind(false);
        console.log(res);
      });
  };

  React.useEffect(() => {
    if (Number(carCost.replace(/\s+/g, '')) < 1000000) {
      setCarCost('1 000 000');
    }
    if (Number(carCost.replace(/\s+/g, '')) > 6000000) {
      setCarCost('6 000 000');
    }
  }, [carCost]);

  React.useEffect(() => {
    if (Number(leaseTerm) < 1) {
      setLeaseTerm('1');
    }
    if (Number(leaseTerm) > 60) {
      setLeaseTerm('60');
    }
  }, [leaseTerm]);

  React.useEffect(() => {
    if (!costOfLease) {
      setCarCost('3 300 000');
      setLeaseTerm('60');
      setRate('13');
    }
  }, [costOfLease]);

  return (
    <div className="App">
      <div className="container">
        <h1>Рассчитайте стоимость автомобиля в лизинг</h1>
        <RangeInput
          span="Стоимость автомобиля"
          minValue={1000000}
          maxValue={6000000}
          value={carCost.toLocaleString('ru')}
          setValue={(e) => setCarCost(e)}
          unit="₽"
          className="isFirst"
        />
        <RangeInput
          span="Первоначальный взнос"
          minValue={10}
          maxValue={60}
          initialCost={initialCost.toLocaleString('ru', {
            style: 'currency',
            currency: 'rub',
            minimumFractionDigits: 0,
          })}
          value={rate}
          setValue={(e) => setRate(e)}
        />
        <RangeInput
          span="Срок лизинга"
          minValue={1}
          maxValue={60}
          value={leaseTerm}
          setValue={(e) => setLeaseTerm(e)}
          unit="мес."
        />
        <Result span="Сумма договора лизинга" result={costOfLease.toLocaleString('ru')} />
        <Result span="Ежемесячный платеж от" result={paymentPerMounth.toLocaleString('ru')} />
        <Button onClick={sendRequest} disabled={loading}>
          Оставить заявку
        </Button>
      </div>
    </div>
  );
}

export default App;
