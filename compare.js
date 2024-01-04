const fs = require( 'fs' );
const PDFParser = require( 'pdf-parse' );

async function getTextFromPDF( filePath ) {
    const dataBuffer = fs.readFileSync( filePath );
    const pdf = await PDFParser( dataBuffer );
    return pdf.text;
}

async function comparePDFs( file1Path, file2Path ) {
    try {
        const text1 = await getTextFromPDF( file1Path );
        const text2 = await getTextFromPDF( file2Path );

        if ( text1 === text2 ) {
            console.log( 'Files are identical' );
        } else {
            console.log( 'Files are different' );
            const diffLines = findDifference( text1, text2 );
            console.log( 'Difference in lines:' );
            diffLines.forEach( ( line, index ) => {
                console.log( `Line ${ index + 1 }:` );
                console.log( `File 1: ${ line.text1 }` );
                console.log( `File 2: ${ line.text2 }` );
                console.log( '---' );
            } );
        }
    } catch ( error ) {
        console.error( 'Error:', error.message );
    }
}

function findDifference( text1, text2 ) {
    const lines1 = text1.split( '\n' );
    const lines2 = text2.split( '\n' );
    const maxLength = Math.max( lines1.length, lines2.length );
    const diffLines = [];

    for ( let i = 0; i < maxLength; i++ ) {
        if ( lines1[ i ] !== lines2[ i ] ) {
            diffLines.push( {
                text1: lines1[ i ] || '',
                text2: lines2[ i ] || '',
            } );
        }
    }

    return diffLines;
}

// Extract file paths from command line arguments
const [ , , file1Path, file2Path ] = process.argv;

if ( !file1Path || !file2Path ) {
    console.error( 'Please provide paths for both files.' );
} else {
    comparePDFs( file1Path, file2Path );
}
