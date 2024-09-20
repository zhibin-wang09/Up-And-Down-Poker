jest.mock('socket.io-client', () => {
    const emit = jest.fn();
    const on = jest.fn();
    const off = jest.fn();
    const socket = {emit,on,off};
    return jest.fn(() => socket);
})