import { useEffect, useState } from "react";
import { getBlanks, issueBook, Blanks_LIMIT} from "../../requests";

export default function IssueBook({ setShown, readerData, countIssuedBlanks, hasIssuedBook }) {
    const { supplier_id, supplier_name} = readerData;

    const [newData, setNewData] = useState({
        supplier_id: supplier_id,
        blank_id: "",
    })
    const [BlanksList, setBlanksList] = useState([]);

    useEffect(() => {
        getBlanks(setBlanksList);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if(countIssuedBlanks(supplier_id) >= Blanks_LIMIT){
            alert(`Количество заготовок в поставке ${supplier_name} превышает лимит ${Blanks_LIMIT}.`);
            return;
        }

        if(hasIssuedBook(supplier_id, value)){
            alert(`У ${supplier_name} уже есть такая заготовка.`);
            return;
        }

        setNewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await issueBook(newData);
        if (res === 200) {
            setShown(false);
            window.location.reload();
        }
    };

    return (
        <div className="form-block">
            <h3>Поставка заготовки</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-select-block">
                    <label htmlFor="blank_id">Заготовка</label>
                    <select
                        name='blank_id'
                        value={newData.blank_id}
                        onChange={(e) => handleChange(e)}
                        required
                    >
                        <option value="" disabled>
                            Выберите заготовку
                        </option>
                        {BlanksList.map((element) => (
                            <option key={element.blank_id} value={element.blank_id}>
                                {element.material_name} - {element.part_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="buttons-block">
                    <button className="grey-button" type="button" onClick={() => setShown(false)}>Отменить</button>
                    <button className="filed-button" type="submit">Добавить</button>
                </div>
            </form>
        </div>
    );
}