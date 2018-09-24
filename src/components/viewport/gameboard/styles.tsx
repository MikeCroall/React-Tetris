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

    active: {
        backgroundColor: '#3399ff',
        boxShadow: 'inset 1px 1px #0073e6'
    }
});