import { useState } from "react"
import { transferBook, returnBook, Blanks_LIMIT } from "../../requests";
import Close from "../../images/icon-close.png"
import Change from "../../images/icon-change.jpg"

export default function InnerCard({data, dataAll, setDataAll, readerData, countIssuedBlanks, hasIssuedBook}) {
    const {blank_id, material_name, part_name} = data;
    const {supplier_id, supplier_name, supplier_date} = readerData;

    const [shown, setShown] = useState(false);
    const [newData, setNewData] = useState({
        supplier_id: supplier_id,
        new_supplier_id: null,
        blank_id: blank_id,
    });

    const handleDeleteInnerCard = async () => {
        if (window.confirm(`Вы уверены, что хотите перенести заготовку "${part_name}" от заказчика ${supplier_name}?`)) {
            const res = await returnBook(newData);
            if(res){
                window.location.reload();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const res = await transferBook(newData);
    
        if (res === 200) {
            setShown(false);
            window.location.reload();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if(countIssuedBlanks(value) >= Blanks_LIMIT){
            alert(`Количество заготовок в поставке у выбранного человека превышает лимит ${Blanks_LIMIT}.`);
            return;
        }

        if(hasIssuedBook(value, blank_id)){
            alert(`У выбранного человека уже есть в поставке такое наименование ${part_name}.`);
            return;
        }

        setNewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleChancel = (e) => {
        e.preventDefault();
        setShown(false);
    }

    

    return (
        <div id={blank_id} className="inner-card-block">
            <div className="inner-card-block-title">
                <div className="inner-card-block-name">
                    <span>{material_name}</span>
                    <span>«{part_name}»</span> 
                </div>
                {shown?(
                    <>
                        <form onSubmit={handleSubmit}>
                            <div className="form-input-block">
                                <label htmlFor="new_supplier_id">Новый заказчик:</label>
                                <select
                                    name="new_supplier_id"
                                    value={newData.new_supplier_id || ""}
                                    onChange={(e) => handleChange(e)}
                                    required
                                >
                                    <option value="" disabled>
                                        Выберите заказчика
                                    </option>
                                    {dataAll.map((element) => (
                                        <option key={element.supplier_id} value={element.supplier_id}>
                                            {element.supplier_name}
                                            &ensp;
                                            {element.supplier_date}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="buttons-block">
                                <button className="grey-button" type="chancel" onClick={(e) => handleChancel(e)}>Отменить</button>
                                <button className="filed-button" type="submit">Перенаправить</button>
                            </div>
                        </form>
                    </>
                ):("")}
            </div>

            <div className="inner-card-block-buttons">
                <img src={Close} alt="Удалить" onClick={() => handleDeleteInnerCard()}/>
                {!shown && (<img src={Change} alt="Перенаправить" onClick={() => setShown(true)}/>)}
            </div>
        </div>
    )
}