import users from './data/users.json'

const checkDuplicates = (e, setLoading, setDisabled, notification) => {
    if (e.projects) {
        const skuSet = new Set();
        for (const project of e.projects) {
            if (skuSet.has(project.sku)) {
                notification.error({
                    message: 'No puedes enviar elementos con SKU repetidos en una misma salida',
                    description: 'Verifica y elimina los elementos duplicados antes de continuar.',
                    duration: 5,
                });
                setDisabled(false);
                setLoading(false);
                return true;
            }
            skuSet.add(project.sku);
        }
    }
    return false;
}

const checkEmpty = (e, setLoading, setDisabled, notification) => {
    if (!e.projects || e.projects.length === 0) {
        notification.error({
            message: 'No puedes enviar una salida vacía',
            description: 'Cámbialo antes de continuar.',
            duration: 5,
        });
        setDisabled(false);
        setLoading(false);
        return true;
    }
    return false;
}

const checkFormat = (e, setLoading, setDisabled, notification) => {
    if (/^\d+$/.test(e.facture_number)) {
        notification.error({
            message: 'Número de factura inválido',
            description: 'No puedes poner sólo números tiene que tener la letra correspondiente.',
            duration: 5,
        });
        setDisabled(false)
        setLoading(false)
        return true
    }

    return false
}

const checkOrderNumber = (e, ordersData, ordersExits, setLoading, setDisabled, notification) => {
    let rangeOrderNumbers = ordersData.concat(ordersExits).map(obj => { return obj.order_number }).filter(orderNumber => !/^[A-Za-z]+$/.test(orderNumber))

    let blockExecution = rangeOrderNumbers.some(number => {
        number = number.toString().toUpperCase()
        e.facture_number = e.facture_number.toString().toUpperCase()
        return (
            (number.includes(e.facture_number) || e.facture_number.includes(number)) &&
            !e.facture_number.includes("REENVASAR") &&
            !e.facture_number.includes("PORCIONAR")
        );
    });

    if (blockExecution) {
        notification.error({
            message: 'Número de factura bloqueado',
            description: 'Por favor, cambia el valor antes de continuar.',
            duration: 5,
        });
        setDisabled(false)
        setLoading(false)
        return true
    }

    return false
}

const checkQuantity = (e, rangeItems, setLoading, setDisabled, notification) => {
    let foundError = [];


    e.projects = e.projects.map(obj => {
        const matchingRangeItem = rangeItems.find(rangeItem => rangeItem.sku === obj.sku);

        if (matchingRangeItem) {

            return { ...matchingRangeItem, quantity_currently: obj.quantity_currently };
        }

        return null;
    }).filter(obj => obj !== null);

    e.projects.forEach(obj => {
        if (Number(obj.quantity_currently) > Number(obj.quantity)) {
            foundError.push(JSON.stringify([obj.name, obj.quantity]));
            return;
        }
    });

    if (foundError.length) {
        localStorage.setItem("exitData", JSON.stringify(e))
        notification.error({
            message: 'Estás intentando sacar más productos de los disponibles en ' + foundError,
            description: 'Por favor, cambia los valores antes de continuar.',
            duration: 5,
        });
        setDisabled(false)
        setLoading(false)
        return true
    }

    return false
}

const checkExist = (e, rangeItems, setLoading, setDisabled, notification) => {
    let notExistentSkus = []

    e.projects = e.projects.map(obj => {
        const matchingRangeItem = rangeItems.find(rangeItem => rangeItem.sku === obj.sku);

        if (matchingRangeItem) {

            return { ...matchingRangeItem, quantity_currently: obj.quantity_currently };
        } else {
            notExistentSkus.push(obj.sku)
        }

        return null;
    }).filter(obj => obj !== null)

    if (notExistentSkus.length) {
        notification.error({
            message: 'Estás intentando sacar productos inexistentes' + notExistentSkus,
            description: 'Por favor, cambia los valores antes de continuar.',
            duration: 5,
        });
        setDisabled(false)
        setLoading(false)
        return true
    }
    return false
}

const processExitData = (e, items, emitType, socket, receiveOrders, message, setLoading, setDisabled, form, user, v4) => {
    const date = new Date();
    const idExit = v4();

    const data = {
        id: idExit,
        date_generate_ISO: date.toISOString(),
        date_generate: date.toLocaleString('sv', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            fractionalSecondDigits: 3,
        }).replace(',', '.').replace(' ', 'T') + 'Z',
        order_number: e.facture_number.toString().toUpperCase(),
        platform: e.platform,
        items: items,
        picking: {
            hour: date.toISOString()
        },
        packing: {
            user: user ? user.email : 'test'
        },
    };

    try {
        socket.emit(emitType, data);
        if (emitType.includes("pending")) {
            receiveOrders(data);
        }
        message.success('Cargado exitosamente');
        localStorage.setItem('exitData', JSON.stringify({}));
        setDisabled(false);
    } catch (err) {
        console.error('Error processing exit data:', err);
        message.error('No se pudo completar la operación');
    } finally {
        form.setFieldsValue({ projects: [], facture_number: '' });
        setLoading(false);
    }
}

const hasPermission = (email, roles) => {
    const user = users.find(user => user.email === email);

    if (user) {
        // Si el usuario tiene el rol de "boss", tiene acceso a todo
        if (user.roles.includes('boss')) {
            return true;
        }

        // Si roles es un array, verificamos si el usuario tiene alguno de los roles
        if (Array.isArray(roles)) {
            return roles.some(role => user.roles.includes(role));
        }

        // Si no, verificamos si tiene el rol específico
        return user.roles.includes(roles);
    }

    // Si el usuario no se encuentra en la lista
    return false;
}

const getUserName = (email) => {
    const user = users.find(user => user.email === email);
    return user ? user.name : null;
}

const getCoursiers = () => {
    const namesList = users.filter(user => user.roles.includes("coursier"))

    return namesList.map(obj => { return obj.name })
}

export { checkDuplicates, checkEmpty, checkFormat, checkOrderNumber, checkQuantity, checkExist, processExitData, hasPermission, getUserName, getCoursiers }