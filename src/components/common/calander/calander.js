import { Form } from "react-router-dom";

{/*
    DatePicker사용    

    fucntion밑, return 위에 꼭 넣기
      //react-datepicker
  const [startDate, setStartDate] = useState(new Date());
  const years = range(1990, new Date().getFullYear() + 1, 1);
  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
    ];
*/}

<Form>
<Form.Group className="mb-3">
  <Form.Label>생일</Form.Label>
  {/* <Form.Control type="text" placeholder="생일을 입력하세요" /> */}
  <DatePicker
    showIcon
    selected={startDate}
    onChange={(date) => setStartDate(date)}
    renderCustomHeader={({
      date,
      changeYear,
      changeMonth,
      decreaseMonth,
      increaseMonth,
      prevMonthButtonDisabled,
      nextMonthButtonDisabled,
    }) => (
      <div
        style={{
          margin: 10,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
          {"<"}
        </button>
        <select
          value={date.getFullYear()}
          onChange={({ target: { value } }) => changeYear(value)}
        >
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={months[date.getMonth()]}
          onChange={({ target: { value } }) =>
            changeMonth(months.indexOf(value))
          }
        >
          {months.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
          {">"}
        </button>
      </div>
    )}
  />
</Form.Group>;


</Form>
