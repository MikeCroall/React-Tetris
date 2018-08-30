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
        height: 50
    },

    cell: {
        backgroundColor: 'blue',
        flexBasis: 46,
        flexShrink: 0,
        margin: 2
    }
});