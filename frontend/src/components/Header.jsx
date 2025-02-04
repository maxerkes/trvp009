export default function Header({ shown, setShown, currentDate, setCurrentDate }) {
  // Function to format the date as DD/MM/YYYY
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to increase the date by 1 day
  const increaseDateByOneDay = () => {
    const isConfirmed = window.confirm("Вы уверены, что хотите увеличить дату на 1 день?");
    if (isConfirmed) {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 1); // Add 1 day
      setCurrentDate(newDate);
      alert("Дата успешно увеличена на 1 день!");
    } else {
      alert("Изменение даты отменено.");
    }
  };

  return (
    <header className="header-block">
      <div className="header-block-left-part">
        <img src="/images/cart.png" alt="Логотип" />
        <h1>Склад заготовок и комплектующих</h1>
      </div>
      <div className="header-block-right-part">
        {!shown && (
          <div className="header-block-right-part-menu">
            {/* Display the current date */}
            <span style={{ marginRight: "10px" }}>Текущая дата: {formatDate(currentDate)}</span>

            {/* Button to increase the date by 1 day */}
            <button
              className="filed-button"
              onClick={increaseDateByOneDay}
              style={{ marginRight: "10px" }}
            >
              +1 день
            </button>

            {/* Existing button to add a supplier */}
            <button
              className="filed-button"
              onClick={() => {
                setShown(true);
                window.scrollTo(0, 0);
              }}
            >
              Добавить заказчика
            </button>
          </div>
        )}
      </div>
    </header>
  );
}