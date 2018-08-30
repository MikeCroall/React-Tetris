import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
    grid: {
        display: 'flex',
        flexFlow: 'column',
        height: 500,
        width: 500,
    },

    row: {
        display: 'flex',
        flexFlow: 'row',
        height: 20
    },

    cell: {
        backgroundColor: 'gray',
        flexBasis: 16,
        flexShrink: 0,
        margin: 2
    },

    active: {
        backgroundColor: 'black'
    }
});