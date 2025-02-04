import React, { useState, useEffect } from 'react';
import { getBlanks } from '../../requests';

export default function AddBook({setShown, requestFunction, initialData={}}) {
    const { blank_id, material_name, part_name, total_quantity } = initialData;
    const [newData, setNewData] = useState({
        material_name: material_name || '',
        part_name: part_name || '',
        total_quantity: total_quantity || '',
    })

    const [BlanksList, setBlanksList] = useState([]);

    useEffect(() => {
        getBlanks(setBlanksList);
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!blank_id){
            const isBookExists = BlanksList.some(
                (book) =>
                    book.material_name.toLowerCase() === newData.material_name.toLowerCase() &&
                    book.part_name.toLowerCase() === newData.part_name.toLowerCase()
            );
    
            if (isBookExists) {
                alert('Такая заготовка уже есть.');
                return; 
            }
        }

        const res = await requestFunction(newData, blank_id);

        if (res === 200) {
            setShown(false);
            window.location.reload();
        }
    };

    return (
        <div className="form-block">
            <h2>{blank_id?`Редактирование данных о заготовке`:"Добавление заготовки"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-input-block">
                    <label htmlFor="material_name">Материал</label>
                    <input
                        name="material_name"
                        type="text"
                        value={newData.material_name}
                        placeholder="Чугун"
                        onChange={(e) => handleChange(e)}
                        required
                    />
                </div>
                <div className="form-input-block">
                    <label htmlFor="part_name">Название</label>
                    <input
                        name="part_name"
                        type="text"
                        value={newData.part_name}
                        placeholder="Наименование"
                        onChange={(e) => handleChange(e)}
                        required
                    />
                </div>
                <div className="form-input-block">
                    <label htmlFor="total_quantity">Количество</label>
                    <input
                        name="total_quantity"
                        type="number"
                        placeholder='1'
                        value={newData.total_quantity}
                        min="1"
                        onChange={(e) => handleChange(e)}
                        required
                    />
                </div>

                <div className="buttons-block">
                    <button className="grey-button" type="chancel" onClick={() => setShown(false)}>Отменить</button>
                    <button className="filed-button" type="submit">{blank_id?"Сохранить":"Добавить"}</button>
                </div>
            </form>
        </div>
    );
}