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
            ROUND_CONSTANT[i] = multiplyingPolynomials(
                hex2bin("2"), 
                ROUND_CONSTANT[i - 1]
            );
        else
            ROUND_CONSTANT[i] = xoringPolynomials( 
                multiplyingPolynomials(
                    hex2bin("2"), 
                    ROUND_CONSTANT[i - 1]
                ), 
                hex2bin("11b") 
            );
    }
}

for (let i = 0; i < ROUND_CONSTANT.length; i++) {
    let temp = bin2hex( ROUND_CONSTANT[i] );
    ROUND_CONSTANT[i] = hex2bin( temp )
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

// console.table(MULTIPLICATIVE_INVERSE_TABLE);
// console.table(S_BOX);
// console.table(INVERSE_S_BOX);

let key_hex = "2b7e151628aed2a6abf7158809cf4f3c";
let key_hex_16 = "2b7e151628aed2a6abf7158809cf4f3c";
let key_hex_24 = "8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b"
let key_hex_32 = "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4";
let N = (key_hex.length / 2) / 4;
let keyMatrix = [];
let count = 0;

for (let i = 0; i < N; i++)
    keyMatrix[i] = [];

for (let i = 0; i < N; i++)
    for (let j = 0; j < 4; j++) {
        keyMatrix[i][j] = key_hex[count] + key_hex[count + 1];
        count += 2;
    }

// console.log( createRoundKey( keyMatrix ) );