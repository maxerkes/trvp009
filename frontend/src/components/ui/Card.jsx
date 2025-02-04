import { useState, useEffect } from "react";
import { deleteReader, editReader } from "../../requests";
import InnerCard from "./InnerCard";
import AddReader from "../forms/AddReader";
import IssueBook from "../forms/IssueBook";

export default function Card({ data, dataAll, setDataAll, countIssuedBlanks, hasIssuedBook, currentDate}) {
  const { supplier_id, supplier_name, supplier_date, Blanks } = data;
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);

  // Convert the supplier_date from DD/MM/YYYY to a Date object
  const [day, month, year] = supplier_date.split('/');
  const supplierDateObj = new Date(`${year}-${month}-${day}`);

  // Check if the supplier_date is not less than the current date
  const isSupplierDateValid = supplierDateObj >= currentDate;

  // If the supplier_date is invalid, do not render the card
  if (!isSupplierDateValid) {
    return null; // Skip rendering this card
  }

  const readerData = {
    supplier_id: supplier_id,
    supplier_name: supplier_name,
    supplier_date: supplier_date,
  };

  const handleDeleteReader = async (id) => {
    if (window.confirm(`Вы уверены, что хотите удалить заказчика "${supplier_name}"?`)) {
      const res = await deleteReader(id);
      if (res) {
        setDataAll(dataAll.filter((element) => element.supplier_id !== id));
      }
      alert(res.message);
    }
  };

  return (
    <div id={supplier_id} className="card-block">
      {edit ? (
        <AddReader setShown={setEdit} requestFunction={editReader} initialData={data} />
      ) : (
        <div className="card-block-title">
          <h2 className="card-block-title-name" title={supplier_name}>
            {supplier_name}
          </h2>
        </div>
      )}
      <div className="card-block-date">
        <h2 className="card-block-date-date" title={supplier_date}>
          {supplier_date}
        </h2>
      </div>
      <div className="card-block-subitems">
        <h3>{Blanks.length > 0 ? "Доставленные заготовки" : "Нет доставленных заготовок"}</h3>
        {Blanks.length > 0 ? (
          <div className="card-block-subitems-list">
            {Blanks.map((element, index) => {
              return (
                <InnerCard
                  key={index}
                  data={element}
                  readerData={readerData}
                  dataAll={dataAll}
                  setDataAll={setDataAll}
                  countIssuedBlanks={countIssuedBlanks}
                  hasIssuedBook={hasIssuedBook}
                />
              );
            })}
          </div>
        ) : (
          ""
        )}
        {add && (
          <IssueBook
            setShown={setAdd}
            readerData={readerData}
            countIssuedBlanks={countIssuedBlanks}
            hasIssuedBook={hasIssuedBook}
          />
        )}
      </div>
      <div className="buttons-block">
        {!add && (
          <button className="unfiled-button" onClick={() => setAdd(true)}>
            Добавить заготовку
          </button>
        )}
        {!edit && !add && (
          <button className="grey-button" onClick={() => setEdit(true)}>
            Изменить
          </button>
        )}
        {!add && (
          <button className="delete-button" onClick={() => handleDeleteReader(supplier_id)}>
            Удалить
          </button>
        )}
      </div>
    </div>
  );
}