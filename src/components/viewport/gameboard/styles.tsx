import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
    grid: {
        alignItems: 'center',
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'center',
        margin: 'auto'
    },

    row: {
        display: 'flex',
        flexFlow: 'row',
        height: 20,
        justifyContent: 'center'
    },

    cell: {
        backgroundColor: 'white',
        border: '1px solid black',
        flexBasis: 18,
        flexShrink: 0,
        margin: 1
    },

    activeDefault: {
        backgroundColor: '#3399ff',
        boxShadow: 'inset 1px 1px #0073e6'
    },

    longBoy: {
        backgroundColor: '#00ffff',
        boxShadow: 'inset 1px 1px #00b3b3'
    },

    backL: {
        backgroundColor: '#0000ff',
        boxShadow: 'inset 1px 1px #0000b3'
    },

    l: {
        backgroundColor: '#ffa500',
        boxShadow: 'inset 1px 1px #b37400'
    },

    square: {
        backgroundColor: '#ffff00',
        boxShadow: 'inset 1px 1px #b3b300'
    },

    backZ: {
        backgroundColor: '#00ff00',
        boxShadow: 'inset 1px 1px #00b300'
    },

    t: {
        backgroundColor: '#800080',
        boxShadow: 'inset 1px 1px #330033'
    },

    z: {
        backgroundColor: '#ff0000',
        boxShadow: 'inset 1px 1px #b30000'
    }
});
