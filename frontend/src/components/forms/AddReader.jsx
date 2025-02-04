import React, { useState } from 'react';

export default function AddReader({setShown, requestFunction, dataAll, initialData={}}) {
    const { supplier_id, supplier_name } = initialData;
    const [newData, setNewData] = useState({
        supplier_name: supplier_name || '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await requestFunction(newData, supplier_id);
        if (res === 200) {
            setShown(false);
            window.location.reload();
        }
    };

    return (
        <div className="form-block">
            <h2>{supplier_id?`Редактирование данных о заказчике`:"Добавление заказчика"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-input-block">
                    <label htmlFor="supplier_name">ФИО</label>
                    <input
                        name="supplier_name"
                        type="text"
                        value={newData.supplier_name}
                        placeholder="Кто-то"
                        onChange={(e) => handleChange(e)}
                        required
                    />
                </div>
                <div className="form-input-block">
                    <label htmlFor="supplier_date">Дата заказа</label>
                    <input
                        name="supplier_date"
                        type="text"
                        value={newData.supplier_date}
                        placeholder="Дата"
                        onChange={(e) => handleChange(e)}
                        required
                    />
                </div>

                <div className="buttons-block">
                    <button className="grey-button" type="chancel" onClick={() => setShown(false)}>Отменить</button>
                    <button className="filed-button" type="submit">{supplier_id?"Сохранить":"Добавить"}</button>
                </div>
            </form>
        </div>
    );
}