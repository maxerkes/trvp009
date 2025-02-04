import { useEffect, useState } from "react"
import { fetchAllData, addReader} from "../requests";

import Card from "./ui/Card";
import AddReader from "./forms/AddReader";

export default function Main({shown, setShown, currentDate}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchAllData(setData);
    }, [])

    const countIssuedBlanks = (id) => {
        let current = data.filter((element) => {
            return parseInt(element.supplier_id) === parseInt(id)
        })

        return current[0].Blanks.length;
    }

    const hasIssuedBook = (supplier_id, blank_id) => {
        const newReader = data.filter((element) => {
            return parseInt(element.supplier_id) === parseInt(supplier_id);
        });

        const haveSameBook = newReader[0].Blanks.some((book) => 
            parseInt(book.blank_id) === parseInt(blank_id)
        )

        return haveSameBook;
    }

    return (
        <main className="main-block">
            {shown && (
                <AddReader setShown={setShown} requestFunction={addReader}/>
            )}

            <div className="main-block-cards-list">
                {data.map((element, index) => {
                    return (
                        <Card key={index} data={element} dataAll={data} setDataAll={setData} countIssuedBlanks={countIssuedBlanks} hasIssuedBook={hasIssuedBook} currentDate={currentDate}/>
                    )
                })}
            </div>
        </main>
    )
}