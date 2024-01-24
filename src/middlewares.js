export const loadRange = async (socket, rangeItems, setRangeItems) => {
    socket.emit('getDataInventory');

    socket.on('dataInventory', (data) => {
        setRangeItems(data)  
    });
};

export const loadData = async (socket, pendingData, setPendingData) => {
    socket.emit('getExitsData')

    socket.on('dataExits', (data) => {
        setPendingData(data)
    })
}

export const TimeLoad = async (loadRange) => {

    const lastUpdateTimestamp = localStorage.getItem("lastUpdateTimestamp");

    const currentTimestamp = new Date().getTime();

    const oneHourInMilliseconds = 60 * 60 * 1000;
    const shouldUpdate = !lastUpdateTimestamp || (currentTimestamp - lastUpdateTimestamp) >= oneHourInMilliseconds;

    if (shouldUpdate) {
        await loadRange();
        localStorage.setItem("lastUpdateTimestamp", currentTimestamp);
    }

    setInterval(async () => {
        await loadRange();
    }, oneHourInMilliseconds);
};

export const TimeLoad20Minutes = async (socket) => {

    const lastUpdateTimestamp = localStorage.getItem("lastUpdateTimestamp");

    const currentTimestamp = new Date().getTime();

    const oneHourInMilliseconds = 1200000;
    const shouldUpdate = !lastUpdateTimestamp || (currentTimestamp - lastUpdateTimestamp) >= oneHourInMilliseconds;

    if (shouldUpdate) {
        await socket.emit('updateDB');
        localStorage.setItem("lastUpdateTimestamp", currentTimestamp);
    }

    setInterval(async () => {
        await socket.emit('updateDB');
    }, oneHourInMilliseconds);
};