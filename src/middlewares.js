export const loadRange = async (socket, rangeItems, setRangeItems) => {
    socket.emit('getDataInventory');

    socket.on('dataInventory', (data) => {
        setRangeItems(data)  
    });
};

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