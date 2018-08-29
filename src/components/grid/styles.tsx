import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
    grid: {
        height: 500,
        width: 500,
        
        display: 'flex',
        flexFlow: 'column'
    },

    row: {
        height: 50,
        
        display: 'flex',
        flexFlow: 'row'
    },

    cell: {
        flexBasis: 50,
        flexShrink: 0,
        
        backgroundColor: 'blue',

        padding: 2
    }
});