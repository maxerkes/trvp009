// ---------- Лимит на поставку заготовок ----------

export const Blanks_LIMIT = 7;

// ---------- Адрес сервера ----------

const URL = "http://localhost:5000";

// ---------- Запрос на получение всех покупателей и заготовок ----------

export const fetchAllData = async (setData) => {
    try {
      const response = await fetch(`${URL}/Suppliers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }

      const data = await response.json();
      
      setData(data);
    } catch (error) {
      console.error('Ошибка при первичной загрузке данных:', error.message);
      alert('Ошибка при первичной загрузке данных: ' + error.message);
    }
};

// ---------- Запрос на Добавление заказчика ----------

export const addReader = async (data) => {
  try {

    const response = await fetch(`${URL}/Suppliers/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при добавлении заказчика');
    }

    alert('Поставщик успешно добавлен!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при добавлении заказчика: ' + error.message);
  }
};

// ---------- Запрос на удаление поставщика по его ID ----------

export const deleteReader = async (id) => {
    try {
        const response = await fetch(`${URL}/Suppliers/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка при удалении заказчика');
        }

        const result = await response.json();
        return result; 
    } catch (error) {
        console.error('Ошибка:', error.message);
        alert('Ошибка при удалении заказчика: ' + error.message);
    }
};

// ---------- Запрос на редактирование данных поставщика ----------

export const editReader = async (data, id) => {
  try {

    const response = await fetch(`${URL}/Suppliers/edit/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при обновлении данных заказчика');
    }

    alert('Данные заказчика успешно обновлены!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при обновлении данных заказчика: ' + error.message);
  }
};

// ---------- Запрос на добавление всех заготовок ----------

export const getBlanks = async (setData) => {
  try {
      const response = await fetch(`${URL}/Blanks`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Ошибка при поставке заготовок');
      }

      const data = await response.json();
      setData(data)
  } catch (error) {
      console.error('Ошибка при поставке заготовок:', error.message);
      alert('Ошибка при поставке заготовки: ' + error.message);
  }
};

// ---------- Запрос на Добавление заготовки ----------

export const addBook = async (data) => {
  try {

    const response = await fetch(`${URL}/Blanks/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при добавлении заготовки');
    }

    alert('Заготовка успешно добавлена!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при добавлении Заготовки: ' + error.message);
  }
};

// ---------- Запрос на редактирование заготовки ----------

export const editBook = async (data, id) => {
  try {

    const response = await fetch(`${URL}/Blanks/edit/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при обновлении данных о заготовке');
    }

    alert('Данные о заготовке успешно обновлены!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при обновлении данных о заготовке: ' + error.message);
  }
};

// ---------- Запрос на поставку ----------

export const issueBook = async (data) => {
  try {

    const response = await fetch(`${URL}/supply-blank`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Такой детали на складе не осталось');
    }

    alert('Сообщение успешно добавлен!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при сообщении о поставке: ' + error.message);
  }
};

// ---------- Запрос на возвращение заготовки на склад ----------

export const returnBook = async (data) => {
  try {

    const response = await fetch(`${URL}/new-blank`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при возвращении заготовки на склад');
    }

    alert('Заготовка успешно возвращена на склад!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при возвращении заготовки на склад: ' + error.message);
  }
};

// ---------- Запрос на перемещение заготовки между поставщиками ----------

export const transferBook = async (data) => {
  try {

    const response = await fetch(`${URL}/transfer-blank`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при перемещении заготовки между заказчиками');
    }

    alert('Заготовкаа успешно перенаправлена другому заказчику!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при перемещении заготовки между заказчиками: ' + error.message);
  }
};

