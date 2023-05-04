const MULTIPLICATIVE_INVERSE_TABLE = [];
const AFFINE_MATRIX = [];
const bin_of_hex_63 = zeroPad( hex2bin("63"), 8 );
const REDUCING_POLYNOMIAL = "100011011";
const S_BOX = [];
const INVERSE_S_BOX = [];
const ROUND_CONSTANT = [];

for (let i = 0; i < 10; i++) {
    if (i == 0)
        ROUND_CONSTANT[i] = hex2bin("1");
    else {
        if ( ROUND_CONSTANT[i - 1] < hex2bin("80") )
            ROUND_CONSTANT[i] = multiplyingPolynomials(hex2bin("2"), ROUND_CONSTANT[i - 1]);
        else
            ROUND_CONSTANT[i] = xoringPolynomials( multiplyingPolynomials(hex2bin("2"), ROUND_CONSTANT[i - 1]), hex2bin("11b") );
    }
}

for (let i = 0; i < bin_of_hex_63.length; i++) {
    AFFINE_MATRIX[i] = [];

    for (let j = 0; j < bin_of_hex_63.length; j++)
        AFFINE_MATRIX[i][j] = 1;

    for (let j = 0; j < 3; j++) 
        AFFINE_MATRIX[i][(j + i + 1) % bin_of_hex_63.length] = 0; 
};

for (let i = 0; i < bin_of_hex_63.length * 2; i++)
    INVERSE_S_BOX[i] = [];

for (let i = 0; i < bin_of_hex_63.length * 2; i++) {
    MULTIPLICATIVE_INVERSE_TABLE[i] = [];
    S_BOX[i] = [];
    
    for (let j = 0; j < bin_of_hex_63.length * 2; j++) {
        MULTIPLICATIVE_INVERSE_TABLE[i][j] = zeroPad( 
            bin2hex( 
                multiplicativeInverseOfPolynomials( 
                    hex2bin(i.toString(bin_of_hex_63.length * 2) + j.toString(bin_of_hex_63.length * 2)), 
                    REDUCING_POLYNOMIAL
                ) 
            ), 
            2
        );

        S_BOX[i][j] = zeroPad(
            bin2hex(
                matrixBinaryMatrix(
                    matrixMultiplyMatrix(
                        AFFINE_MATRIX, 
                        zeroPad( 
                            hex2bin( MULTIPLICATIVE_INVERSE_TABLE[i][j] ), 
                            bin_of_hex_63.length 
                        ).split("").reverse().map(x => [+x])
                    ), 
                    bin_of_hex_63.split("").reverse().map(x => [x]), 
                    xor
                ).reverse().join("")
            ), 
            2
        );

        INVERSE_S_BOX[ 
            parseInt( zeroPad(S_BOX[i][j], 2)[0], bin_of_hex_63.length * 2 ) 
        ][ 
            parseInt( zeroPad(S_BOX[i][j], 2)[1], bin_of_hex_63.length * 2 ) 
        ] = i.toString(bin_of_hex_63.length * 2) + j.toString(bin_of_hex_63.length * 2);
    }
}

console.table(MULTIPLICATIVE_INVERSE_TABLE);
console.table(S_BOX);
console.table(INVERSE_S_BOX);

let key = "satishcjisboring";
let keyMatrix = [];
let count = 0;

for (let i = 0; i < key.length / 4; i++)
    keyMatrix[i] = [];

for (let i = 0; i < key.length / 4; i++)
    for (let j = 0; j < key.length / 4; j++) {
        keyMatrix[i][j] = key[count].charCodeAt(0).toString(16);
        count++;
    }

console.table( keyMatrix );

rotWord = arr => ary.push( ary.shift() );

subWord = arr => arr.map(
    x => S_BOX[ 
        parseInt( zeroPad(x, 2)[0], bin_of_hex_63.length * 2 ) 
    ][ 
        parseInt( zeroPad(x, 2)[1], bin_of_hex_63.length * 2 ) 
    ]
)

g = arr => {

}

createRoundKey = key => {

}

console.log( subWord( ["69", "6e", "67", "72"] ) );